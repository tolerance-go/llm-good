FROM node:20-alpine as builder

# 设置工作目录为项目根目录
WORKDIR /workspace

# 全局安装 pnpm
RUN npm install -g pnpm

# 复制整个工作区配置
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# 复制所有 package.json 文件
COPY apps/frontend/package.json ./apps/frontend/

# 安装工作区依赖
RUN pnpm install

# 复制源代码
COPY apps/frontend ./apps/frontend

# 进入 frontend 目录
WORKDIR /workspace/apps/frontend

# 安装本地依赖
RUN pnpm install

# 构建静态文件
RUN pnpm build

# 使用 nginx 镜像作为基础镜像
FROM nginx:1.24-alpine

# 从构建阶段复制构建后的文件
COPY --from=builder /workspace/apps/frontend/dist/ /usr/share/nginx/html/

# 添加 nginx 配置
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]