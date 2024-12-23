FROM node:18-alpine

# 设置工作目录为项目根目录
WORKDIR /workspace

# 全局安装 pnpm
RUN npm install -g pnpm

# 复制整个工作区配置
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# 复制所有 package.json 文件
COPY apps/backend/package.json ./apps/backend/

# 安装工作区依赖
RUN pnpm install

# 复制源代码
COPY apps/backend ./apps/backend

# 进入 backend 目录
WORKDIR /workspace/apps/backend

# 安装本地依赖
RUN pnpm install

# 生成 Prisma 客户端
RUN pnpm prisma generate

# 构建应用
RUN pnpm build

EXPOSE ${BACKEND_PORT}

CMD ["pnpm", "start"]