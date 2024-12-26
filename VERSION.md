# 版本管理脚本使用指南

## 查看版本标签

1. 列出所有标签：
   ```bash
   git tag
   ```

2. 按照版本号排序（从新到旧）：
   ```bash
   git tag --sort=-v:refname
   ```

3. 查看最新的标签：
   ```bash
   git describe --tags --abbrev=0
   ```

4. 查看标签详细信息：
   ```bash
   # 查看指定标签的详细信息
   git show v1.0.0

   # 查看所有标签及其对应的提交信息
   git log --tags --simplify-by-decoration --pretty="format:%ai %d"
   ```

5. 按照模式匹配标签：
   ```bash
   # 查看所有 1.0.x 版本的标签
   git tag -l "v1.0.*"
   ```

本项目使用 `scripts/version.sh` 脚本来管理版本号。该脚本遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，自动根据 commit 历史计算新版本号并生成 changelog。

## 使用方法

```bash
./scripts/version.sh
```

## 版本号计算规则

版本号格式为：`major.minor.patch`

脚本会分析从最近的 tag 到当前 HEAD 之间的所有 commit，根据以下规则计算新版本号：

1. 如果存在破坏性变更（以下任意一种情况）：
   - commit message 或 body 中包含 `BREAKING CHANGE:`
   - commit message 中使用感叹号语法（如 `feat!:`）
   → 增加主版本号（major），次版本号和修订号归零

2. 如果有新功能：
   - commit message 以 `feat:` 开头
   → 增加次版本号（minor），修订号归零

3. 如果有 bug 修复：
   - commit message 以 `fix:` 开头
   → 增加修订号（patch）

4. 如果没有上述任何类型的提交：
   → 询问是否要手动创建版本更新
   - 如果确认，将创建一个 `bump` 类型的空提交并增加修订号
   - 如果取消，则终止执行

## Commit Message 规范

为了正确计算版本号，commit message 需要遵循以下格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

支持的 type：
- `feat`: 新功能（增加次版本号）
- `fix`: bug 修复（增加修订号）

### feat 类型的使用场景

`feat` 类型用于标记新功能的添加，包括：

1. 新功能或特性：
   ```
   feat: 添加用户登录功能
   feat: 支持暗色主题切换
   feat: 实现文件上传功能
   ```

2. 功能增强：
   ```
   feat(auth): 支持谷歌账号登录
   feat(ui): 优化表单验证交互
   feat(api): 添加数据导出接口
   ```

3. 新组件或模块：
   ```
   feat(components): 添加日期选择器组件
   feat(modules): 新增支付模块
   feat(core): 添加缓存管理模块
   ```

4. API 相关：
   ```
   feat(api): 新增用户管理接口
   feat(graphql): 添加订单查询接口
   feat(websocket): 实现实时消息推送
   ```

### fix 类型的使用场景

`fix` 类型用于标记问题修复，包括：

1. Bug 修复：
   ```
   fix: 修复登录按钮点击无响应
   fix: 解决数据加载失败问题
   fix: 修复表单提交时的验证错误
   ```

2. 样式修复：
   ```
   fix(ui): 修复移动端布局错乱
   fix(style): 修复按钮样式异常
   fix(css): 解决暗色模式下文字不清晰
   ```

3. 性能问题：
   ```
   fix(perf): 优化大数据列���渲染
   fix(performance): 解决内存泄漏问题
   fix(speed): 改善页面加载速度
   ```

4. 兼容性问题：
   ```
   fix(compat): 修复 IE11 兼容性问题
   fix(safari): 解决 Safari 下的显示异常
   fix(mobile): 修复移动端触摸事件异常
   ```

### 手动版本更新

当没有版本相关的提交（feat 或 fix）时，脚本会询问是否要手动创建一个版本更新。如果确认，会：

1. 增加修订号（patch）
2. 创建一个空的 commit：
   ```
   bump: 手动更新版本号到 x.y.z
   ```
3. 在 changelog 中记录这个手动更新

### 破坏性变更的标记方式

1. 在 commit message body 中添加 `BREAKING CHANGE:` 说明
2. 在 type 后添加感叹号，如：`feat!:`

示例：
```
# 新功能
feat(auth): 添加用户登录功能
feat(ui): 实现暗色主题切换
feat(api): 新增数据导出接口

# Bug 修复
fix(ui): 修复登录按钮点击无响应
fix(style): 解决移动端布局问题
fix(perf): 优化大数据列表渲染

# 手动版本更新
bump: 手动更新版本号到 1.2.4

# 破坏性变更
feat!: 重构 API 接口
BREAKING CHANGE: 用户认证方式从 JWT 改为 OAuth2
```

### Changelog 示例

脚本会自动生成 CHANGELOG.md 文件，格式如下：

```markdown
# 2.0.0 (2023-12-26)

BREAKING CHANGE: 用户认证方式从 JWT 改为 OAuth2
* feat!: 重构 API 接口 (a1b2c3d)
* feat(auth): 添加谷歌账号登录支持 (e4f5g6h)
* fix(ui): 修复移动端布局问题 (i7j8k9l)

# 1.1.0 (2023-12-25)

* feat(ui): 实现暗色主题切换 (q3r4s5t)
* feat(api): 新增数据导出接口 (u6v7w8x)
* fix(perf): 优化大数据列表渲染 (y9z0a1b)

# 1.0.1 (2023-12-24)

* fix(style): 修复按钮样式异常 (g5h6i7j)
* fix(compat): 修复 IE11 兼容性问题 (k8l9m0n)
* bump: 手动更新版本号到 1.0.1 (o1p2q3r)
```

## 脚本功能

1. 自动检测最近的 tag
2. 分析 commit 历史
3. 根据提交类型自动计算新版本号
4. 生成 changelog（记录所有版本相关的提交）
5. 更新 `package.json` 中的版本号
6. 创建新的 release commit
7. 创建新的 git tag

## 注意事项

1. 执行脚本前请确保：
   - 所有更改已提交
   - 当前分支是你想要发布的分支

2. 脚本执行过程中会：
   - 修改 `package.json` 文件
   - 创建或更新 `CHANGELOG.md` 文件
   - 创建新的 commit 和 tag

3. 脚本执行完成后需要手动：
   ```bash
   git push && git push --tags
   ```
   来推送更改和新标签到远程仓库