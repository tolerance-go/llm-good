FROM node:20-alpine AS builder

# 设置工作目录为项目根目录
WORKDIR /workspace

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# 复制整个工作区配置
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# 复制所有 package.json 文件
COPY apps/game-hub/package.json ./apps/game-hub/

# 安装依赖
RUN pnpm install

# 复制源代码
COPY apps/game-hub ./apps/game-hub

# 进入 game-hub 目录
WORKDIR /workspace/apps/game-hub

# 安装本地依赖
RUN pnpm install

# 构建应用
RUN pnpm build

# 生产环境
FROM nginx:1.24-alpine

# 复制 nginx 配置
COPY apps/game-hub/nginx.conf /etc/nginx/conf.d/default.conf

# 复制构建产物
COPY --from=builder /workspace/apps/game-hub/dist /usr/share/nginx/html/game-hub

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 