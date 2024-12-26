#!/bin/bash

# 设置错误时退出
set -e

# 加载工具函数
source ./scripts/version/utils.sh

# 测试颜色输出函数
echo "=== 测试颜色输出函数 ==="
print_green "这是绿色文本"
print_yellow "这是黄色文本"
print_red "这是红色文本"
echo "---"

# 测试版本号获取函数
echo "=== 测试版本号获取函数 ==="
echo "package.json 版本号: $(get_package_version "package.json")"
echo "最新标签版本号: $(get_latest_tag)"
echo "---"

# 测试工作区状态检查
echo "=== 测试工作区状态检查 ==="
if check_working_tree; then
    echo "工作区干净"
else
    echo "工作区有未提交的更改"
fi
echo "---"

# 测试 parse_version 函数
echo "=== 测试 parse_version 函数 ==="
source ./scripts/version/analyze_commits.sh
parse_version "1.2.3"
echo "---"

# 测试 analyze_commits 函数
echo "=== 测试 analyze_commits 函数 ==="
analyze_commits "$(get_latest_tag)"
echo "---"

# 测试 changelog 生成
echo "=== 测试 changelog 生成 ==="
# 使用 --preview 选项只预览 changelog 内容而不修改文件
bash ./scripts/version/update_changelog.sh --preview "1.0.0" "* test: 测试更新 (abcd123)" "* fix: 修复问题 (efgh456)"
echo "---" 