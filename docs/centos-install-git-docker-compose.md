---
title: CentOS 阿里云服务器安装 Git 和 Docker Compose
date: 2024-01-09
tags: [CentOS, Git, Docker, Docker Compose, 阿里云]
---

# CentOS 阿里云服务器安装 Git 和 Docker Compose

本文将介绍如何在阿里云 CentOS 服务器上安装 Git 和 Docker Compose。

## 安装 Git

1. 首先更新系统包
```bash
sudo yum update -y
```

2. 安装 Git
```bash
sudo yum install -y git
```

3. 验证安装
```bash
git --version
```

## 安装 Docker

1. 首先卸载旧版本（如果有的话）
```bash
sudo yum remove docker \
    docker-client \
    docker-client-latest \
    docker-common \
    docker-latest \
    docker-latest-logrotate \
    docker-logrotate \
    docker-engine
```

2. 安装必要的系统工具
```bash
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

3. 设置 Docker 的阿里云 yum 源
```bash
sudo yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

4. 更新 yum 软件源缓存
```bash
sudo yum makecache fast
```

5. 安装 Docker CE
```bash
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

6. 启动并设置开机自启动
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

7. 验证安装
```bash
docker version
```

8. 运行 hello-world 镜像测试
```bash
sudo docker run hello-world
```

## 安装 Docker Compose

1. 下载 Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2. 添加可执行权限
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

3. 验证安装
```bash
docker-compose --version
```

## 配置阿里云镜像加速

为了提高 Docker 镜像下载速度，建议配置阿里云镜像加速器：

1. 登录阿里云控制台，在容器镜像服务中找到镜像加速器地址

2. 创建 Docker 配置文件
```bash
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["你的阿里云镜像加速器地址"]
}
EOF
```

3. 重启 Docker 服务
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 配置 Docker 用户组（可选）

如果要以非 root 用户使用 Docker，需要将用户添加到 docker 用户组：

```bash
# 创建 docker 用户组
sudo groupadd docker

# 将当前用户添加到 docker 用户组
sudo usermod -aG docker $USER

# 重新登录以使更改生效
# 或者运行以下命令立即生效
newgrp docker
```

## 常见问题

1. 如果遇到 `Permission denied` 错误，可以尝试使用 `sudo` 命令或将用户添加到 docker 用户组
2. 如果 Docker Compose 下载速度慢，可以尝试使用国内镜像源
3. 确保服务器的安全组规则允许相关端口访问
4. 如果安装过程中出现 GPG key 错误，可以尝试手动导入密钥：
```bash
sudo yum install -y gpg
sudo gpg --fetch-keys https://download.docker.com/linux/centos/gpg
```

## 参考链接

- [Git 官方文档](https://git-scm.com/doc)
- [Docker 官方文档](https://docs.docker.com/)
- [Docker Compose 官方文档](https://docs.docker.com/compose/)
- [阿里云镜像加速器](https://cr.console.aliyun.com/) 