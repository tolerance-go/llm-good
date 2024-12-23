FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 如果需要构建 TypeScript
RUN pnpm build

# 暴露端口
EXPOSE 8000

# 启动命令
CMD ["pnpm", "start"] 