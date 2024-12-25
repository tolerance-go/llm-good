#!/bin/bash

# 检查命令参数
if [ -z "$1" ]; then
    echo "错误: 必须提供操作命令 (start|stop|restart)"
    echo "使用方法: ./docker-prod.sh start|stop|restart"
    exit 1
fi

# 获取脚本所在目录的绝对路径
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# 获取项目根目录
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

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

# 检查必要的环境变量
if [ -z "$MYSQL_ROOT_PASSWORD" ] || [ -z "$MYSQL_DATABASE" ] || [ -z "$MYSQL_USER" ] || [ -z "$MYSQL_PASSWORD" ] || [ -z "$DATABASE_URL" ]; then
    echo "错误: 缺少必要的环境变量"
    echo "请确保以下环境变量已设置："
    echo "- MYSQL_ROOT_PASSWORD"
    echo "- MYSQL_DATABASE"
    echo "- MYSQL_USER"
    echo "- MYSQL_PASSWORD"
    echo "- DATABASE_URL"
    exit 1
fi

case "$1" in
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
        echo "使用方法: ./docker-prod.sh start|stop|restart"
        exit 1
        ;;
esac 