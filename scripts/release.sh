#!/bin/bash

set -e

# 加载工具函数
source "$(dirname "$0")/version/utils.sh"

echo "🚀 开始发布流程..."
echo

# 1. 执行版本更新脚本
print_green "📦 步骤 1/4: 更新版本号..."
bash "$(dirname "$0")/version.sh"
print_green "✅ 版本更新完成"
echo

# 2. 构建 Docker 镜像
print_green "🏗️  步骤 2/4: 构建 Docker 镜像..."
pnpm run docker:build
print_green "✅ Docker 镜像构建完成"
echo

# 3. 推送 Docker 镜像
print_green "⬆️  步骤 3/4: 推送 Docker 镜像..."
pnpm run docker:deploy
print_green "✅ Docker 镜像推送完成"
echo

# 4. 部署到生产环境
print_green "🚀 步骤 4/4: 部署到生产环境..."
pnpm run deploy:prod
print_green "✅ 部署完成"
echo

print_green "🎉 发布流程全部完成！" 