#!/bin/bash

# 加载环境变量
if [ -f .env ]; then
    source .env
else
    echo "错误: .env 文件不存在"
    exit 1
fi

# 检查必要的环境变量是否存在
if [ -z "$PROD_SERVER_HOST" ] || [ -z "$PROD_SERVER_USER" ] || [ -z "$PROD_SERVER_PATH" ]; then
    echo "错误: 缺少必要的环境变量 (PROD_SERVER_HOST, PROD_SERVER_USER, PROD_SERVER_PATH)"
    exit 1
fi

# 定义要推送的文件数组
declare -A files_to_push=(
    [".env.prod"]="$PROD_SERVER_PATH/.env"
    ["apps/backend/.env.prod"]="$PROD_SERVER_PATH/apps/backend/.env"
)

# 推送文件函数
push_file() {
    local local_file=$1
    local remote_file=$2

    if [ ! -f "$local_file" ]; then
        echo "警告: 本地文件 $local_file 不存在，跳过"
        return
    fi

    echo "正在推送 $local_file 到 $remote_file"
    
    # 确保远程目录存在
    ssh "$PROD_SERVER_USER@$PROD_SERVER_HOST" "mkdir -p $(dirname "$remote_file")"
    
    # 使用 scp 推送文件
    scp "$local_file" "$PROD_SERVER_USER@$PROD_SERVER_HOST:$remote_file"
    
    if [ $? -eq 0 ]; then
        echo "✅ $local_file 推送成功"
    else
        echo "❌ $local_file 推送失败"
        exit 1
    fi
}

# 主函数
main() {
    echo "正在连接到服务器 $PROD_SERVER_HOST..."
    
    # 检查 SSH 连接
    if ! ssh -q "$PROD_SERVER_USER@$PROD_SERVER_HOST" exit; then
        echo "错误: 无法连接到服务器"
        exit 1
    fi

    # 遍历并推送所有文件
    for local_file in "${!files_to_push[@]}"; do
        remote_file="${files_to_push[$local_file]}"
        push_file "$local_file" "$remote_file"
    done

    echo "所有环境文件推送完成！"
}

# 执行主函数
main 