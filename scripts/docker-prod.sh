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
    echo "错误: 必须提供操作命令 (start|stop|restart)"
    echo "使用方法: ./docker-prod.sh start|stop|restart"
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