#!/bin/bash

# 解析提交输出并生成新版本号和变更日志
parse_commits_output() {
    local latest_tag=$1
    local -a output=("${@:2}")  # 从第二个参数开始的所有参数作为数组
    local new_version
    local -a changelog

    if [[ ${#output[@]} -eq 0 ]]; then
        echo "没有发现版本相关的提交" >&2
        echo "no_commits"
        return 1
    fi

    # 第一个元素是新版本号
    new_version="${output[0]}"
    # 其余元素是 changelog
    changelog=("${output[@]:1}")

    # 输出结果
    echo "$new_version"
    printf "%s\n" "${changelog[@]}"
}

# 手动更新版本号
bump_version() {
    local current_version=$1
    local -a version_parts
    readarray -t version_parts < <(parse_version "$current_version")
    local major="${version_parts[0]}"
    local minor="${version_parts[1]}"
    local patch="${version_parts[2]}"
    patch=$((patch + 1))
    local new_version
    new_version=$(format_version "$major" "$minor" "$patch")
    echo "$new_version"
    echo "* bump to $new_version"
}

# 如果直接运��此脚本，则执行测试
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    echo "这是一个工具函数库，不应该直接运行"
    exit 1
fi 