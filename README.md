# LLM Good

一个基于微服务架构的 Web 应用项目。

## 项目结构

```
apps/
  ├── backend/      # 后端服务
  ├── frontend/     # 前端应用
  ├── website/      # 官网
  └── game-hub/     # 游戏中心
nginx/              # Nginx 配置
scripts/            # 部署脚本
```

## 开发环境

### 环境要求

- Node.js 16+
- pnpm 8+
- Docker
- Docker Compose

### 本地开发

1. 安装依赖：
```bash
pnpm install
```

2. 启动数据库：
```bash
pnpm db:up
```

3. 启动开发服务：
```bash
pnpm dev
```

### Docker 开发环境

1. 构建镜像：
```bash
pnpm docker:build
```

2. 启动所有服务：
```bash
pnpm docker:start
```

3. 停止服务：
```bash
pnpm docker:stop
```

4. 重启服务：
```bash
pnpm docker:restart
```

## 生产环境部署

### 环境要求

- Docker
- Docker Compose

### 部署步骤

1. 克隆代码到服务器：
```bash
git clone <repository_url>
cd llm-good
```

2. 切换到需要部署的版本：
```bash
git checkout <tag_or_branch>
```

3. 使用部署脚本管理服务：

启动服务：
```bash
./scripts/docker-prod.sh start
```

停止服务：
```bash
./scripts/docker-prod.sh stop
```

重启服务：
```bash
./scripts/docker-prod.sh restart
```

> 注意：部署脚本会自动从 package.json 中读取版本号，并使用对应版本的 Docker 镜像。

### 环境变量

生产环境需要配置以下环境变量：

- `NODE_ENV`: 运行环境，生产环境设置为 `production`
- `BACKEND_PORT`: 后端服务端口
- `DATABASE_URL`: 数据库连接 URL
- `MYSQL_ROOT_PASSWORD`: MySQL root 密码
- `MYSQL_DATABASE`: 数据库名称
- `MYSQL_USER`: 数据库用户名
- `MYSQL_PASSWORD`: 数据库密码

## 镜像仓库

项目使用阿里云容器镜像服务：

- Website: `registry.cn-heyuan.aliyuncs.com/llm-good/website`
- Frontend: `registry.cn-heyuan.aliyuncs.com/llm-good/frontend`
- Backend: `registry.cn-heyuan.aliyuncs.com/llm-good/backend`
- Game Hub: `registry.cn-heyuan.aliyuncs.com/llm-good/game-hub`
- Nginx: `registry.cn-heyuan.aliyuncs.com/llm-good/nginx`
- Database: `registry.cn-heyuan.aliyuncs.com/llm-good/db` 