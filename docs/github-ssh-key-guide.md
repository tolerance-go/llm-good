# GitHub SSH Key 配置指南

本教程将指导你如何在服务器上生成 SSH key 并配置到 GitHub，以实现免密码拉取代码。

## 1. 检查现有 SSH key

首先，检查是否已经存在 SSH key：

```bash
ls -al ~/.ssh
```

如果存在，你会看到以下文件之一：
- id_rsa.pub
- id_ecdsa.pub
- id_ed25519.pub

如果已经存在，可以直接使用现有的 key，跳到第 3 步。

## 2. 生成新的 SSH key

如果没有现有的 SSH key，使用以下命令生成新的 key：

```bash
# 使用 Ed25519 算法（推荐）
ssh-keygen -t ed25519 -C "your_email@example.com"

# 或者使用 RSA 算法（如果系统不支持 Ed25519）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

在生成过程中：
1. 当询问保存位置时，直接按回车使用默认位置
2. 当询问是否设置密码时，可以直接按回车（不设置密码）或设置一个密码

## 3. 复制 SSH 公钥

查看并复制公钥内容：

```bash
# 如果使用 Ed25519
cat ~/.ssh/id_ed25519.pub

# 如果使用 RSA
cat ~/.ssh/id_rsa.pub
```

## 4. 添加 SSH key 到 GitHub

1. 登录 GitHub
2. 点击右上角头像 -> Settings
3. 在左侧边栏点击 "SSH and GPG keys"
4. 点击 "New SSH key" 或 "Add SSH key"
5. 在 "Title" 字段中，为你的 key 添加一个描述性的标题（例如："我的服务器"）
6. 将第 3 步复制的公钥内容粘贴到 "Key" 字段
7. 点击 "Add SSH key"

## 5. 测试连接

测试 SSH 连接是否成功：

```bash
ssh -T git@github.com
```

如果看到类似以下消息，说明配置成功：
```
Hi username! You've successfully authenticated, but GitHub does not provide shell access.
```

## 6. 使用 SSH 地址克隆/更新仓库

现在你可以使用 SSH 地址来克隆仓库：

```bash
# 克隆新仓库
git clone git@github.com:username/repository.git

# 或修改现有仓库的远程地址
git remote set-url origin git@github.com:username/repository.git
```

## 注意事项

1. 确保将 `your_email@example.com` 替换为你的 GitHub 邮箱
2. SSH key 是私密信息，不要分享你的私钥（id_ed25519 或 id_rsa）
3. 如果设置了密码，每次使用时需要输入密码
4. 一个 SSH key 可以用于多个仓库
5. 如果遇到权限问题，确保公钥已正确添加到 GitHub 