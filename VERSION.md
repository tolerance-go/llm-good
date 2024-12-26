# 版本管理脚本使用指南

本项目使用 `scripts/version.ps1` 脚本来管理版本号。该脚本遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范，自动根据 commit 历史计算新版本号并生成 changelog。

## 使用方法

```powershell
./scripts/version.ps1
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

3. 如果有 bug 修复或其他更新：
   - commit message 以 `fix:` 开头
   - commit message 以 `bump:` 开头
   → 增加修订号（patch）

4. 如果没有上述任何类型的提交：
   → 显示警告并终止执行，不更新版本号

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
- `bump`: 工程化相关更新（增加修订号）
- `chore`: 日常维护性提交（不影响版本号，不记录到 changelog）

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

3. 新组或模块：
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
   fix(perf): 优化大数据列表渲染
   fix(performance): 解决内存泄漏问题
   fix(speed): 改善页面加载速度
   ```

4. 兼容性问题：
   ```
   fix(compat): 修复 IE11 兼容性问题
   fix(safari): 解决 Safari 下的显示异常
   fix(mobile): 修复移动端触摸事件异常
   ```

### bump 类型的使用场景

`bump` 类型主要用于以下场景：

1. 依赖包更新：
   ```
   bump(deps): 升级 vue 到 3.4.0
   bump(dependencies): 更新开发依赖包版本
   bump: 更新所有依赖到最新版本
   ```

2. 配置更新：
   ```
   bump(config): 调整 eslint 规则
   bump(docker): 更新 nginx 配置
   bump: 更新 tsconfig 配置
   ```

3. 工程化调整：
   ```
   bump(ci): 优化 CI/CD 配置
   bump(build): 调整打包配置
   bump: 更新构建脚本
   ```

4. 版本发布：
   ```
   bump: 发布新版本
   bump(release): 准备发布 1.0.0
   bump: 同步所有子包版本
   ```

### chore 类型的使用场景

`chore` 类型用于标记日常维护性的提交，这类提交不会影响版本号，也不会记录到 changelog 中。主要用于：

1. 文档维护：
   ```
   chore: 更新 README 文档
   chore(docs): 修正文档中的错别字
   chore: 添加代码示例
   ```

2. 代码格式：
   ```
   chore: 调整代码缩进
   chore(style): 删除多余空行
   chore: 统一代码风格
   ```

3. 注释相关：
   ```
   chore: 添加函数注释
   chore: 更新过时的注释
   chore: 删除无用注释
   ```

4. 其他维护：
   ```
   chore: 整理文件结构
   chore: 删除废弃文件
   chore: 合并重复代码
   ```

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

# 工程化更新
bump(deps): 升级 vue 到 3.4.0
bump(build): 优化打包配置
bump(docker): 更新 nginx 配置

# 破坏性变更
feat!: 重构 API 接口
BREAKING CHANGE: 用户认证方式从 JWT 改为 OAuth2
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
   ```powershell
   git push && git push --tags
   ```
   来推送更改和新标签到远程仓库 

### Changelog 示例

脚本会自动生成 CHANGELOG.md 文件，格式如下：

```markdown
# 2.0.0 (2023-12-26)

BREAKING CHANGE: 用户认证方式从 JWT 改为 OAuth2
* feat!: 重构 API 接口 (a1b2c3d)
* feat(auth): 添加谷歌账号登录支持 (e4f5g6h)
* fix(ui): 修复移动端布局问题 (i7j8k9l)
* bump(deps): 升级 vue 到 3.4.0 (m0n1o2p)

# 1.1.0 (2023-12-25)

* feat(ui): 实现暗色主题切换 (q3r4s5t)
* feat(api): 新增数据导出接口 (u6v7w8x)
* fix(perf): 优化大数据列表渲染 (y9z0a1b)
* bump(build): 优化打包配置 (c2d3e4f)

# 1.0.1 (2023-12-24)

* fix(style): 修复按钮样式异常 (g5h6i7j)
* fix(compat): 修复 IE11 兼容性问题 (k8l9m0n)
* bump(docker): 更新 nginx 配置 (o1p2q3r)

# 1.0.0 (2023-12-23)

* feat(core): 初始版本发布 (s4t5u6v)
* feat(auth): 实现用户登录功能 (w7x8y9z)
* feat(api): 基础 API 实现 (a0b1c2d)
```

每个版本的 changelog 包含：
1. 版本号和发布日期
2. 破坏性变更说明（如果有）
3. 所有相关提交的简要说明
4. 每个提交的简短 hash 值

### Release Commit 和 Tag 示例

当执行版本发布脚本时，会自动创建一个新的 commit 和 tag：

1. **Release Commit 示例**：
   ```
   release: v2.0.0
   ```

2. **Tag 示例**：
   ```
   v2.0.0
   ```
   Tag message:
   ```
   Release v2.0.0
   ```

完整的发布流程示例：

```bash
# 当前���本是 1.1.0，有以下新的提交：
feat!: 重构 API 接口
BREAKING CHANGE: 用户认证方式从 JWT 改为 OAuth2

feat(auth): 添加谷歌账号登录支持

fix(ui): 修复移动端布局问题

bump(deps): 升级 vue 到 3.4.0

# 执行版本发布脚本
./scripts/version.ps1

# 脚本会：
1. 检测到破坏性变更，计算新版本号为 2.0.0
2. 更新 package.json 中的 version 字段为 "2.0.0"
3. 更新 CHANGELOG.md，在文件头部添加新版本的变更记录
4. 创建 release commit：
   git add package.json CHANGELOG.md
   git commit -m "release: v2.0.0"
5. 创建新的 tag：
   git tag -a "v2.0.0" -m "Release v2.0.0"

# 最后需要手动执行：
git push && git push --tags
```