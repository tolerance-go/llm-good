#!/bin/bash

# 检查命令是否存在的函数
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查服务是否存在的函数
service_exists() {
    systemctl list-unit-files | grep -q "^$1"
}

echo "开始环境检查和安装..."

# 更新系统包
echo "正在更新系统包..."
sudo yum update -y

# 检查并安装Git
if command_exists git; then
    echo "Git 已安装，当前版本："
    git --version
else
    echo "正在安装Git..."
    sudo yum install -y git
fi

# 检查并安装Docker
if command_exists docker && service_exists docker; then
    echo "Docker 已安装，当前版本："
    docker --version
else
    echo "正在安装Docker..."
    # 安装必要的依赖
    echo "正在安装依赖..."
    sudo yum install -y yum-utils device-mapper-persistent-data lvm2

    # 添加Docker仓库
    echo "正在添加Docker仓库..."
    sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

    # 安装Docker
    sudo yum install -y docker-ce docker-ce-cli containerd.io

    # 启动Docker服务
    echo "正在启动Docker服务..."
    sudo systemctl start docker
    sudo systemctl enable docker
fi

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
    sudo systemctl daemon-reload
    sudo systemctl restart docker
fi

# 检查并安装Docker Compose
if command_exists docker-compose; then
    echo "Docker Compose 已安装，当前版本："
    docker-compose --version
else
    echo "正在安装Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 验证所有安装
echo "环境检查完成，当前版本信息："
echo "Git 版本："
git --version
echo "Docker 版本："
docker --version
echo "Docker Compose 版本："
docker-compose --version

echo "环境初始化完成！" 