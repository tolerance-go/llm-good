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
        
        # 初始化目录
        echo "初始化目录结构..."
        rm -rf certbot/conf/* certbot/www/*
        mkdir -p certbot/conf certbot/www/.well-known/acme-challenge
        chmod -R 755 certbot/www
        
        # 停止现有服务
        echo "停止现有服务..."
        docker compose -f docker-compose.prod.yml down
        
        # 使用 acme.conf 启动 nginx
        echo "启动 Nginx 服务（SSL 验证模式）..."
        NGINX_CONF=acme.conf docker compose -f docker-compose.prod.yml up -d nginx
        
        # 等待 Nginx 启动并测试连接
        echo "等待 Nginx 启动并测试连接（最多等待 30 秒）..."
        for i in {1..6}; do
            if curl -s -o /dev/null -H "Host: www.unocodex.com" http://localhost/.well-known/acme-challenge/; then
                echo "Nginx 已就绪！"
                break
            fi
            if [ $i -eq 6 ]; then
                echo "错误: Nginx 启动超时"
                echo "诊断信息："
                echo "1. Nginx 容器状态："
                docker compose -f docker-compose.prod.yml ps nginx
                echo "2. Nginx 错误日志："
                docker compose -f docker-compose.prod.yml logs nginx
                echo "3. 端口监听状态："
                netstat -tlnp | grep :80 || ss -tlnp | grep :80
                exit 1
            fi
            echo "等待 Nginx 启动... (${i}/6)"
            sleep 5
        done
        
        # 预检查 ACME 挑战路径是否可访问
        echo "预检查: 验证 ACME 挑战路径是否已正确配置..."
        ACME_TEST=$(curl -s -I -H "Host: www.unocodex.com" http://localhost/.well-known/acme-challenge/)
        if ! echo "$ACME_TEST" | grep -q "200 OK"; then
            echo "错误: ACME 挑战路径配置检查失败"
            echo "这意味着 Let's Encrypt 可能无法进行域名所有权验证"
            echo "实际响应："
            echo "$ACME_TEST"
            echo "请检查："
            echo "1. Nginx 配置中的 /.well-known/acme-challenge/ 路径配置"
            echo "2. certbot/www 目录的权限"
            echo "3. Nginx 容器是否能正确访问 /var/www/certbot 目录"
            exit 1
        fi
        echo "预检查通过：ACME 挑战路径配置正确"
        
        # 开始申请证书
        echo "开始申请 SSL 证书..."
        echo "注意：接下来 Let's Encrypt 将进行真正的域名验证..."
        
        docker compose -f docker-compose.prod.yml run --rm certbot \
            certbot certonly \
            --webroot \
            -w /var/www/certbot \
            -d www.unocodex.com \
            --email yarnb@qq.com \
            --agree-tos \
            --no-eff-email \
            --force-renewal \
            --verbose \
            --debug
        
        CERT_EXIT_CODE=$?
        
        if [ $CERT_EXIT_CODE -eq 0 ]; then
            echo "SSL 证书申请成功！"
            echo "切换到生产配置并启动所有服务..."
            docker compose -f docker-compose.prod.yml down
            docker compose -f docker-compose.prod.yml up -d
            echo "完成！您的网站现在应该可以通过 HTTPS 访问了。"
            
            # 验证证书
            echo "验证证书信息："
            if docker compose -f docker-compose.prod.yml exec nginx [ -d "/etc/letsencrypt/live/www.unocodex.com" ]; then
                echo "证书文件已成功安装！"
                docker compose -f docker-compose.prod.yml exec nginx ls -l /etc/letsencrypt/live/www.unocodex.com/
            else
                echo "警告：证书目录未找到，请手动检查 /etc/letsencrypt/live/www.unocodex.com/"
            fi
        else
            echo "错误: SSL 证书申请失败 (错误代码: $CERT_EXIT_CODE)"
            echo "诊断信息："
            echo "1. DNS 解析检查："
            echo "   执行: dig www.unocodex.com +short 或 nslookup www.unocodex.com"
            echo "2. 端口检查："
            echo "   执行: curl -v http://www.unocodex.com/.well-known/acme-challenge/"
            echo "3. 查看详细日志："
            docker compose -f docker-compose.prod.yml logs certbot
            docker compose -f docker-compose.prod.yml logs nginx
            echo "4. 常见解决方案："
            echo "   - 确保域名已正确解析到服务器 IP"
            echo "   - 确保 80 端口已开放且可从外网访问"
            echo "   - 检查服务器防火墙设置"
            echo "   - 尝试手动访问 http://www.unocodex.com/.well-known/acme-challenge/"
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