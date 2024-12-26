#!/bin/sh

# 定义日志输出函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# 输出环境信息
log "=== 环境信息 ==="
log "Node 版本: $(node -v)"
log "NPM 版本: $(npm -v)"
log "当前工作目录: $(pwd)"
log "系统信息: $(uname -a)"
log "环境变量: NODE_ENV=$NODE_ENV"

# 执行数据库迁移
log "=== 开始数据库迁移流程 ==="
log "执行命令: pnpm prisma:deploy"

pnpm prisma:deploy
MIGRATION_EXIT_CODE=$?

if [ $MIGRATION_EXIT_CODE -eq 0 ]; then
    log "✅ 数据库迁移成功完成"
else
    log "❌ 数据库迁移失败 (错误码: $MIGRATION_EXIT_CODE)"
    log "请检查数据库连接和迁移脚本"
fi

# 启动应用
log "=== 开始启动应用服务 ==="
log "执行命令: pnpm start"
exec pnpm start 