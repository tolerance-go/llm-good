# Lerna 使用指南

本项目使用 Lerna 进行多包管理和版本控制。以下是相关命令的使用说明。

## 日常开发命令

### 查看包变更
```bash
pnpm changed
```
此命令会显示自上次发布以来有哪些包发生了变更。

### 查看详细变更
```bash
pnpm diff
```
此命令会显示具体的代码变更内容。

## 版本发布流程

### 1. 更新版本
```bash
pnpm version
```
此命令会：
- 自动更新所有包的版本号
- 生成/更新 CHANGELOG.md
- 创建 git tag
- 提交相关改动

支持的选项：
- `pnpm version major` - 主版本升级 (1.0.0 -> 2.0.0)
- `pnpm version minor` - 次版本升级 (1.0.0 -> 1.1.0)
- `pnpm version patch` - 补丁版本升级 (1.0.0 -> 1.0.1)

### 2. 发布包
```bash
pnpm publish
```
此命令会将包发布到 npm 仓库。

## Changelog 相关命令

### 首次生成 Changelog
```bash
pnpm changelog:first
```
用于项目首次生成完整的 changelog。

### 更新 Changelog
```bash
pnpm changelog
```
用于手动更新 changelog（通常不需要手动执行，`version` 命令会自动处理）。

## Git 提交规范

项目使用 commitlint 强制执行提交信息规范。`commitlint.config.js` 文件定义了提交信息的检查规则：

### 配置文件说明
```js
// commitlint.config.js
module.exports = {
  // 继承 @commitlint/config-conventional 的规则
  extends: ['@commitlint/config-conventional'],
  // 自定义规则
  rules: {
    // 定义允许的提交类型
    'type-enum': [
      2,                    // 级别为 2 表示错误
      'always',            // 始终检查
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档变更
        'style',    // 代码格式
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 增加测试
        'chore',    // 构建过程或辅助工具的变动
        'revert',   // 回退
        'build',    // 打包
        'ci'        // CI/CD相关
      ]
    ],
    // 类型必须小写
    'type-case': [2, 'always', 'lower-case'],
    // 主题可以使用任意格式
    'subject-case': [0]
  }
};
```

### 提交格式
```bash
<type>(<scope>): <subject>
```

### 类型说明
- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不是新增功能，也不是修改 bug 的代码变动）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动
- `revert`: 回退
- `build`: 打包
- `ci`: CI/CD 相关

### 示例
```bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复登录验证码不显示的问题"
git commit -m "docs: 更新 API 文档"
```

### 工作流程
1. 当你执行 `git commit` 时，husky 会自动触发 commit-msg 钩子
2. commit-msg 钩子会调用 commitlint 检查提交信息
3. commitlint 使用 `commitlint.config.js` 中的规则进行检查
4. 如果提交信息不符合规范，提交会被拒绝并显示错误信息
5. 你需要修改提交信息直到符合规范为止

## 版本发布流程示例

1. 确保所有改动已提交
```bash
git status
```

2. 查看有哪些包发生了变更
```bash
pnpm changed
```

3. 查看具体变更内容
```bash
pnpm diff
```

4. 更新版本并生成 changelog
```bash
pnpm version
```

5. 发布包
```bash
pnpm publish
```

## 注意事项

1. 所有包共用同一个版本号，采用固定模式（Fixed mode）
2. 提交信息必须符合规范，否则会提交失败
3. 更新版本时会自动生成 changelog，无需手动维护
4. 以下文件的变更不会触发版本更新：
   - Markdown 文件（`*.md`）
   - 测试文件（`*.test.ts`, `*.test.tsx`, `*.spec.ts`, `*.spec.tsx`） 