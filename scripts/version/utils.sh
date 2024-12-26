#!/bin/bash

# 颜色输出函数
print_green() {
    echo -e "\033[32m$1\033[0m"
}

print_yellow() {
    echo -e "\033[33m$1\033[0m"
}

print_red() {
    echo -e "\033[31m$1\033[0m"
}

# 从 package.json 读取版本号
get_package_version() {
    local package_json=$1
    if [[ -f $package_json ]]; then
        grep -o '"version": *"[^"]*"' "$package_json" | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+'
    fi
}

# 获取最近的 tag 或 package.json 中的版本号
get_latest_tag() {
    local latest_tag
    local package_version

    # 首先尝试从 git tag 获取最近的标签
    if latest_tag=$(git describe --tags --abbrev=0 2>/dev/null); then
        echo "$latest_tag" | sed 's/^v//'
        return
    fi

    # 如果没有标签，从 package.json 获取版本号
    package_version=$(get_package_version "$(git rev-parse --show-toplevel)/package.json")
    if [[ $package_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "$package_version"
        return
    fi

    # 如果都没有，返回初始版本号
    echo "0.0.0"
}

# 检查工作区状态
check_working_tree() {
    if ! git diff --quiet HEAD; then
        return 1
    fi
    return 0
}

# 如果直接运行此脚本，则执行测试
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "这是一个工具函数库，不应该直接运行"
    exit 1
fi 