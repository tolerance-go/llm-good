---
title: Docker Compose 和 Prisma ORM 使用指南
date: 2024-01-09
tags: [Docker Compose, Prisma, ORM, 数据库]
---

# Docker Compose 和 Prisma ORM 使用指南

本文档详细说明项目中使用的 Docker Compose 命令和 Prisma ORM 的相关操作。

## Docker Compose 命令说明

### 数据库操作
```bash
# 启动数据库容器
pnpm db:up

# 停止数据库容器
pnpm db:down

# 重启数据库容器
pnpm db:restart

# 清理数据库数据（包括数据卷）
pnpm db:clean
```

### Docker 服务操作
```bash
# 构建并启动所有服务
pnpm docker:start

# 停止所有服务
pnpm docker:stop

# 重启所有服务
pnpm docker:restart
```

## Prisma ORM 操作指南

### 基础命令
```bash
# 生成 Prisma Client
pnpm prisma:generate

# 创建新的迁移
pnpm prisma:migrate

# 部署迁移到生产环境
pnpm prisma:deploy

# 启动 Prisma Studio（数据库可视化工具）
pnpm prisma:studio

# 格式化 schema 文件
pnpm prisma:format
```

### 数据库管理命令
```bash
# 重置数据库（危险操作，会清除所有数据）
pnpm prisma:reset

# 填充种子��据
pnpm prisma:seed

# 将 schema 更改推送到数据库（开发环境使用）
pnpm prisma:push

# 从现有数据库拉取 schema
pnpm prisma:pull
```

## 开发流程建议

### 1. 数据库模型变更流程
1. 修改 `prisma/schema.prisma` 文件
2. 运行 `pnpm prisma:generate` 更新 Prisma Client
3. 运行 `pnpm prisma:migrate` 创建新的迁移
4. 运行 `pnpm prisma:deploy` 应用迁移

### 2. 开发环境设置
1. 启动数据库：`pnpm db:up`
2. 确保 schema 最新：`pnpm prisma:generate`
3. 应用迁移：`pnpm prisma:migrate`
4. （可选）填充测试数据：`pnpm prisma:seed`

### 3. 生产环境部署
1. 构建镜像：`pnpm docker:start`
2. 应用迁移：`pnpm prisma:deploy`
3. 验证服务状态

## 注意事项

1. **数据安全**
   - 执行 `db:clean` 和 `prisma:reset` 时要特别小心，这些操作会清除所有数据
   - 生产环境建议只使用 `prisma:deploy`，避免使用 `prisma:push`
   - 定期备份数据库

2. **开发建议**
   - 使用 Prisma Studio 可以方便地查看和修改数据
   - 开发新功能时先在本地测试所有数据库操作
   - 保持 schema 文件的整洁和注释完善

3. **性能优化**
   - 合理使用 Prisma 的关系查询
   - 注意监控查询性能
   - 适当使用索引优化查询速度

4. **故障排查**
   - 检查数据库连接状态
   - 查看 Docker 容器日志
   - 使用 Prisma Studio 验证数据状态

## 常见问题解决

1. **数据库连接失败**
   ```bash
   # 检查数据库容器状态
   docker ps
   # 查看数据库日志
   docker logs <container_id>
   ```

2. **迁移冲突**
   ```bash
   # 重置迁移历史（开发环境）
   pnpm prisma:reset
   # 重新应用迁移
   pnpm prisma:migrate
   ```

3. **Schema 同步问题**
   ```bash
   # 确保 Prisma Client 是最新的
   pnpm prisma:generate
   # 验证数据库结构
   pnpm prisma:studio
   ``` 