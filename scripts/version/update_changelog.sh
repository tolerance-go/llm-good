#!/bin/bash

# 生成 changelog 内容
generate_changelog() {
    local version=$1
    shift
    local changelog=("$@")
    local date
    date=$(date +%Y-%m-%d)

    echo "# $version ($date)"
    echo
    for change in "${changelog[@]}"; do
        echo "$change"
        echo
    done
}

# 更新 changelog（实际修改文件的函数）
update_changelog() {
    local version=$1
    shift
    local changelog=("$@")
    local changelog_file
    changelog_file=$(git rev-parse --show-toplevel)/CHANGELOG.md
    local temp_file
    temp_file=$(mktemp)

    echo "更新 changelog..." >&2
    echo "版本: $version" >&2
    echo "日期: $(date +%Y-%m-%d)" >&2
    echo "变更日志条目数: ${#changelog[@]}" >&2

    {
        # 生成新的变更日志内容
        generate_changelog "$version" "${changelog[@]}"
        
        # 添加已有的变更日志内容
        if [[ -f $changelog_file ]]; then
            echo "添加已有的 changelog 内容" >&2
            cat "$changelog_file"
        else
            echo "没有找到已有的 changelog 文件" >&2
        fi
    } > "$temp_file"

    echo "将临时文件移动到 changelog 文件" >&2
    mv "$temp_file" "$changelog_file"
    echo "完成更新 changelog" >&2
}

# 如果直接运行此脚本，则执行测试
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $1 == "--preview" ]]; then
        shift
        version=$1
        shift
        generate_changelog "$version" "$@"
    else
        version=$1
        shift
        update_changelog "$version" "$@"
    fi
fi 