#!/bin/sh

# 执行数据库迁移
echo "Running database migrations..."
pnpm prisma:deploy

# 启动应用
echo "Starting the application..."
pnpm start 