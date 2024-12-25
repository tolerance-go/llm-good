#!/bin/bash

# 设置错误时立即退出
set -e

# 检查命令是否存在的函数
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查服务是否存在的函数
service_exists() {
    systemctl list-unit-files | grep -q "^$1"
}

# 错误处理函数
handle_error() {
    echo "错误: $1"
    exit 1
}

echo "开始环境检查和安装..."

# 更新系统包
echo "正在更新系统包..."
sudo yum update -y || handle_error "系统更新失败"

# 检查并安装Git
if command_exists git; then
    echo "Git 已安装，当前版本："
    git --version
else
    echo "正在安装Git..."
    sudo yum install -y git || handle_error "Git 安装失败"
fi

# 检查并安装Docker
if command_exists docker && service_exists docker; then
    echo "Docker 已安装，当前版本："
    docker --version
else
    echo "正在安装Docker..."
    # 删除旧版本（如果存在）
    sudo yum remove -y docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine || true
    
    # 安装必要的依赖
    echo "正在安装依赖..."
    sudo yum install -y yum-utils device-mapper-persistent-data lvm2 || handle_error "Docker依赖安装失败"

    # 添加Docker仓库
    echo "正在添加Docker仓库..."
    sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo || handle_error "Docker仓库添加失败"
    
    # 替换仓库地址为阿里云镜像
    sudo sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo

    # 安装Docker
    sudo yum install -y docker-ce docker-ce-cli containerd.io || handle_error "Docker安装失败"

    # 启动Docker服务
    echo "正在启动Docker服务..."
    sudo systemctl start docker || handle_error "Docker服务启动失败"
    sudo systemctl enable docker || handle_error "Docker服务启用失败"
fi

# 检查Docker是否正常运行
sudo docker run hello-world || handle_error "Docker测试运行失败"

# 检查Docker镜像加速器配置
if [ -f "/etc/docker/daemon.json" ]; then
    echo "Docker镜像加速器配置已存在，跳过配置..."
else
    echo "正在配置Docker镜像加速器..."
    sudo mkdir -p /etc/docker
    sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://ozvvtlky.mirror.aliyuncs.com"]
}
EOF
    # 重启Docker服务
    echo "正在重启Docker服务..."
    sudo systemctl daemon-reload || handle_error "Docker守护进程重载失败"
    sudo systemctl restart docker || handle_error "Docker服务重启失败"
fi

# 检查并安装Docker Compose
if command_exists docker-compose; then
    echo "Docker Compose 已安装，当前版本："
    docker-compose --version
else
    echo "正在安装Docker Compose..."
    # 获取系统架构信息
    OS_TYPE=$(uname -s | tr '[:upper:]' '[:lower:]')
    ARCH=$(uname -m)
    
    # 根据架构选择正确的文件名
    case "${ARCH}" in
        x86_64) ARCH_NAME="x86_64" ;;
        aarch64) ARCH_NAME="aarch64" ;;
        armv7l) ARCH_NAME="armhf" ;;
        *) handle_error "不支持的系统架构: ${ARCH}" ;;
    esac
    
    # 使用阿里云镜像源下载对应版本
    DOWNLOAD_URL="https://mirrors.aliyun.com/docker-toolbox/linux/compose/1.29.2/docker-compose-${OS_TYPE}-${ARCH_NAME}"
    echo "系统架构: ${OS_TYPE}-${ARCH_NAME}"
    echo "正在从阿里云镜像源下载 Docker Compose..."
    sudo curl -L "$DOWNLOAD_URL" -o /usr/local/bin/docker-compose || handle_error "Docker Compose下载失败"
    sudo chmod +x /usr/local/bin/docker-compose || handle_error "Docker Compose权限设置失败"
fi

# 验证所有安装
echo "环境检查完成，当前版本信息："
echo "Git 版本："
git --version || handle_error "Git版本检查失败"
echo "Docker 版本："
docker --version || handle_error "Docker版本检查失败"
echo "Docker Compose 版本："
docker-compose --version || handle_error "Docker Compose版本检查失败"

echo "环境初始化完成！" 