# Commitlint 配置说明

本项目使用 commitlint 来规范化 Git 提交信息。以下是相关配置和使用说明。

## 相关依赖包及其协作关系

### 核心包说明

```json
{
  "@commitlint/cli": "^19.6.1",        // commitlint 的命令行工具
  "@commitlint/config-conventional": "^19.6.0",  // 约定式提交规范的配置
  "@commitlint/cz-commitlint": "^19.2.0",  // commitizen 适配器，用于交互式提交
  "commitizen": "^4.3.0",              // 交互式提交工具
  "husky": "^9.0.11"                   // Git hooks 管理工具
}
```

### 包的职责和协作关系

1. **@commitlint/cli**
   - 主要职责：提供命令行工具，用于验证 commit 信息
   - 功能：
     - 解析 commit 信息
     - 根据规则验证 commit 信息
     - 提供验证结果和错误提示
   - 配合方式：
     - 与 `@commitlint/config-conventional` 配合获取验证规则
     - 与 `husky` 配合在 git commit 时自动运行验证

2. **@commitlint/config-conventional**
   - 主要职责：提供标准的 commit 信息格式规则
   - 功能：
     - 定义允许的 commit 类型（feat, fix 等）
     - 定义 commit 信息的格式要求
     - 提供基础的验证规则
   - 配合方式：
     - 被 `@commitlint/cli` 引用作为验证规则
     - 被 `@commitlint/cz-commitlint` 用作交互式提交的选项

3. **commitizen**
   - 主要职责：提供交互式命令行界面
   - 功能：
     - 提供 `git cz` 或 `pnpm commit` 命令
     - 管理命令行交互流程
     - 收集用户输入并生成 commit 信息
   - 配合方式：
     - 通过 `@commitlint/cz-commitlint` 适配器与 commitlint 规则集成
     - 生成的 commit 信息会被 `@commitlint/cli` 验证

4. **@commitlint/cz-commitlint**
   - 主要职责：连接 commitizen 和 commitlint
   - 功能：
     - 将 commitlint 的规则转换为交互式问题
     - 确保生成的 commit 信息符合 commitlint 规则
   - 配合方式：
     - 作为 commitizen 的适配器使用
     - 使用 `@commitlint/config-conventional` 的规则
     - 生成的信息会被 `@commitlint/cli` 验证

5. **husky**
   - 主要职责：管理 Git hooks
   - 功能：
     - 在 git commit 前自动运行验证
     - 管理和维护 Git hooks 脚本
   - 配合方式：
     - 在 commit-msg hook 中调用 `@commitlint/cli`
     - 确保每次提交都经过验证

### 工作流程

1. 当开发者执行 `pnpm commit`：
   - `commitizen` 启动交互式界面
   - `@commitlint/cz-commitlint` 提供符合规范的选项
   - 用户完成交互后生成 commit 信息

2. 当执行 `git commit`：
   - `husky` 触发 commit-msg hook
   - hook 调用 `@commitlint/cli` 进行验证
   - `@commitlint/cli` 使用 `@commitlint/config-conventional` 的规则
   - 验证通过则提交成功，否则提交被拒绝

## 提交规范

提交信息必须符合以下格式：
```
type(scope?): subject
```

### 类型（type）

- `feat`: 新功能
- `fix`: 修复 Bug
- `docs`: 文档更新
- `style`: 代码格式调整，不影响代码含义
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 添加或修改测试
- `build`: 构建系统或外部依赖项的更改
- `ci`: CI 配置文件和脚本的更改
- `chore`: 其他不修改源代码与测试的更改
- `revert`: 回滚之前的提交

### 作用域（scope）

作用域是可选的，用于说明提交影响的范围：
- `frontend`
- `backend`
- `database`
- `auth`
等

### 主题（subject）

- 简短描述变更内容
- 使用现在时态（"change" 而不是 "changed" 或 "changes"）
- 不要首字母大写
- 结尾不要加句号

## 使用方法

### 1. 常规提交

```bash
git commit -m "feat(auth): add google oauth login"
```

### 2. 交互式提交（推荐）

使用项目配置的交互式提交命令：
```bash
pnpm commit
```

这将启动交互式提交向导，引导你完成：
1. 选择提交类型
2. 输入作用域（可选）
3. 输入简短描述
4. 输入详细描述（可选）
5. 是否有破坏性变更（可选）
6. 是否关联 issue（可选）

### 3. 验证提交信��

提交时会自动验证信息格式，如果不符合规范会被拒绝。
手动验证最后一次提交：
```bash
pnpm commitlint --edit
```

## 配置文件

项目使用了以下配置文件：

1. `commitlint.config.js` - commitlint 配置
2. `.husky/commit-msg` - Git hook 配置
3. `package.json` 中的 commitizen 配置：
```json
{
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

## 常见问题

1. 提交被拒绝
   - 检查提交信息格式是否符合规范
   - 确保类型（type）是允许的值
   - 确保有简短描述

2. 交互式提交不工作
   - 确保已安装所有依赖：`pnpm install`
   - 确保 husky 已正确安装：`pnpm prepare`

## 最佳实践

1. 优先使用 `pnpm commit` 进行交互式提交
2. 保持提交信息简洁明了
3. 一次提交只做一件事
4. 在作用域中指明改动的模块
5. 在详细描述中说明改动原因 