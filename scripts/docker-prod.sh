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
            echo "警告: SSL 证书目录已存在，是否继续？[y/N]"
            read -r response
            if [[ ! "$response" =~ ^[Yy]$ ]]; then
                echo "操作已取消"
                exit 0
            fi
        fi
        
        # 创建 certbot 所需目录
        echo "创建证书目录..."
        mkdir -p certbot/conf certbot/www
        
        # 停止现有服务
        echo "停止现有服务..."
        docker compose -f docker-compose.prod.yml down
        
        # 使用 acme.conf 启动 nginx
        echo "启动 Nginx 服务（SSL 验证模式）..."
        NGINX_CONF=acme.conf docker compose -f docker-compose.prod.yml up -d nginx
        
        # 等待 nginx 启动并测试连接
        echo "等待 Nginx 启动并测试连接..."
        sleep 5
        
        # 测试 Nginx 是否正常运行
        echo "测试 Nginx 状态..."
        if ! curl -s -o /dev/null -H "Host: www.unocodex.com" http://localhost/.well-known/acme-challenge/; then
            echo "错误: Nginx 未正常响应 /.well-known/acme-challenge/ 路径"
            echo "请检查："
            echo "1. Nginx 配置是否正确"
            echo "2. 80 端口是否已开放"
            docker compose -f docker-compose.prod.yml logs nginx
            exit 1
        fi
        
        # 清理可能存在的旧的验证文件
        echo "清理旧的验证文件..."
        rm -rf certbot/www/.well-known/acme-challenge/*
        
        # 申请 SSL 证书
        echo "申请 SSL 证书..."
        echo "注意：如果域名未正确解析到服务器，此步骤可能会失败"
        
        docker compose -f docker-compose.prod.yml run --rm certbot \
            certbot certonly \
            --webroot \
            -w /var/www/certbot \
            -d www.unocodex.com \
            --email yarnb@qq.com \
            --agree-tos \
            --no-eff-email \
            --force-renewal \
            --verbose
        
        CERT_EXIT_CODE=$?
        
        if [ $CERT_EXIT_CODE -eq 0 ]; then
            echo "SSL 证书申请成功！"
            echo "切换到生产配置并启动所有服务..."
            docker compose -f docker-compose.prod.yml down
            docker compose -f docker-compose.prod.yml up -d
            echo "完成！您的网站现在应该可以通过 HTTPS 访问了。"
            echo "可以通过以下命令查看证书信息："
            echo "docker compose -f docker-compose.prod.yml exec nginx ls -la /etc/letsencrypt/live/www.unocodex.com/"
        else
            echo "错误: SSL 证书申请失败 (错误代码: $CERT_EXIT_CODE)"
            echo "请检查："
            echo "1. 域名 www.unocodex.com 是否正确解析到服务器"
            echo "2. 80 端口是否已开放"
            echo "3. 是否可以从外网访问 http://www.unocodex.com/.well-known/acme-challenge/"
            echo "4. 查看详细日志："
            docker compose -f docker-compose.prod.yml logs certbot
            docker compose -f docker-compose.prod.yml logs nginx
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
        echo "init-ssl: 初始化 SSL 证书（仅首次部署需要）"
        echo "start:    启动所有服务"
        echo "stop:     停止所有服务"
        echo "restart:  重启所有服务"
        exit 1
        ;;
esac 