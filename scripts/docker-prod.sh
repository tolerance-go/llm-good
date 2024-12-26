#!/bin/bash

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# 获取项目根目录
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

# 检查 .env 文件是否存在
if [ ! -f "$PROJECT_DIR/.env" ]; then
    echo "错误: .env 文件不存在"
    exit 1
fi

# 检查命令参数
if [ -z "$1" ]; then
    echo "错误: 必须提供操作命令 (init-ssl|start|stop|restart)"
    echo "使用方法: ./docker-prod.sh init-ssl|start|stop|restart"
    echo "init-ssl: 初始化 SSL 证书（仅首次部署需要）"
    echo "start:    启动所有服务"
    echo "stop:     停止所有服务"
    echo "restart:  重启所有服务"
    exit 1
fi

# 切换到项目根目录
cd "$PROJECT_DIR"

# 从 package.json 读取版本号
VERSION=$(grep -o '"version": *"[^"]*"' package.json | grep -o '"[^"]*"$' | tr -d '"')

if [ -z "$VERSION" ]; then
    echo "错误: 无法从 package.json 读取版本号"
    exit 1
fi

# 导出版本号为环境变量
export VERSION

echo "使用版本号: $VERSION"

case "$1" in
    init-ssl)
        echo "开始初始化 SSL 证书..."
        
        # 检查是否已存在证书
        if [ -d "certbot/conf/live/www.unocodex.com" ]; then
            echo "警告: SSL 证书目录已存在，这可能意味着您已经配置过证书。"
            echo "继续操作将尝试重新申请证书。是否继续？[y/N]"
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                echo "操作已取消"
                exit 0
            fi
            
            echo "清理已存在的证书文件..."
            rm -rf certbot
        fi

        # 提示用户需要停止所有服务
        echo "注意：为了使用特殊的 Nginx 配置进行证书申请，需要先停止所有运行中的服务。"
        echo "停止后将仅启动配置了 ACME 验证的 Nginx 服务。是否继续？[y/N]"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo "操作已取消"
            exit 0
        fi

        # 停止所有服务
        echo "停止所有服务..."
        docker compose -f docker-compose.prod.yml down

        # 初始化目录
        echo "初始化目录结构..."
        mkdir -p certbot/conf certbot/www/.well-known/acme-challenge
        chmod -R 755 certbot/www
        chmod -R 755 certbot/conf
        
        # 使用 acme.conf 启动 nginx（不使用 root 用户）
        echo "启动 Nginx 服务（SSL 验证模式）..."
        NGINX_CONF=acme.conf docker compose -f docker-compose.prod.yml up -d nginx
        
        # 等待 Nginx 启动
        echo "等待 Nginx 启动（最多等待 30 秒）..."
        for i in {1..6}; do
            if curl -s -o /dev/null -H "Host: www.unocodex.com" http://localhost/.well-known/acme-challenge/; then
                echo "Nginx 已就绪！"
                break
            fi
            if [ $i -eq 6 ]; then
                echo "错误: Nginx 启动超时"
                docker compose -f docker-compose.prod.yml logs nginx
                exit 1
            fi
            echo "等待 Nginx 启动... (${i}/6)"
            sleep 5
        done
        
        # 申请证书并配置自动续期
        echo "开始申请 SSL 证书..."
        docker run -it --rm \
            -v "$(pwd)/certbot/conf:/etc/letsencrypt" \
            -v "$(pwd)/certbot/www:/var/www/certbot" \
            certbot/certbot certonly \
            --webroot \
            --webroot-path=/var/www/certbot \
            -d www.unocodex.com \
            -d unocodex.com \
            --email yarnb@qq.com \
            --agree-tos
        
        CERT_EXIT_CODE=$?
        
        if [ $CERT_EXIT_CODE -eq 0 ]; then
            echo "✅ SSL 证书申请成功！"
            docker compose -f docker-compose.prod.yml down
            docker compose -f docker-compose.prod.yml up -d
            echo "完成！您的网站现在应该可以通过 HTTPS 访问了。"
        else
            echo "❌ 错误: SSL 证书申请失败 (错误代码: $CERT_EXIT_CODE)"
            echo "请检查以下几点："
            echo "1. 确保域名 www.unocodex.com 已正确解析到服务器 IP"
            echo "2. 确保服务器 80 端口已开放且可从外网访问"
            echo "3. 检查服务器防火墙设置"
            echo "详细错误日志："
            docker compose -f docker-compose.prod.yml logs certbot
            exit 1
        fi
        ;;
    start)
        docker compose -f docker-compose.prod.yml up -d
        ;;
    stop)
        docker compose -f docker-compose.prod.yml down
        ;;
    restart)
        docker compose -f docker-compose.prod.yml down
        docker compose -f docker-compose.prod.yml up -d
        ;;
    *)
        echo "错误: 无效的命令"
        echo "使用方法: ./docker-prod.sh init-ssl|start|stop|restart"
        echo "init-ssl: 初始化 SSL 证书（��首次部署需要）"
        echo "start:    启动所有服务"
        echo "stop:     停止所有服务"
        echo "restart:  重启所有服务"
        exit 1
        ;;
esac 