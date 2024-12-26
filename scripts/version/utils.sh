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
    local package_content=$1  # package.json 内容
    
    if [[ -n "$package_content" ]]; then
        echo "$package_content" | grep -o '"version": *"[^"]*"' | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+'
    fi
}

# 获取最近的 tag 或 package.json 中的版本号
get_latest_tag() {
    local git_tags=$1  # git tags 列表
    local package_content=$2  # package.json 内容
    local latest_tag
    local package_version

    if [[ -n "$git_tags" ]]; then
        # 如果提供了 tags 列表，从中获取最新的
        latest_tag=$(echo "$git_tags" | grep '^v[0-9]\+\.[0-9]\+\.[0-9]\+$' | sort -V | tail -n 1)
        if [[ -n "$latest_tag" ]]; then
            echo "${latest_tag#v}"
            return
        fi
    fi

    # 如果没有标签，从 package.json 内容获取版本号
    package_version=$(get_package_version "$package_content")
    if [[ $package_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "$package_version"
        return
    fi

    # 如果都没有，返回初始版本号
    echo "0.0.0"
}

# 检查工作区状态
check_working_tree() {
    local git_status=$1  # git status 输出
    [[ -z "$git_status" ]]
}

# 如果直接运行此脚本，则执行测试
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "这是一个工具函数库，不应该直接运行"
    exit 1
fi 