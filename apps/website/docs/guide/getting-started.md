# 快速开始

## 安装

使用你喜欢的包管理器安装：

```bash
# 使用 pnpm
pnpm add your-package-name

# 使用 npm
npm install your-package-name

# 使用 yarn
yarn add your-package-name
```

## 基本使用

```typescript
import { yourFunction } from 'your-package-name'

// 使用示例
const result = yourFunction()
console.log(result)
```

## 配置选项

你可以通过以下选项来自定义配置：

```typescript
interface Config {
  // 在这里定义配置选项
  theme: 'light' | 'dark'
  language: string
  // ...更多选项
}
``` 