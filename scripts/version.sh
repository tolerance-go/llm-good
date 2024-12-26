#!/bin/bash

set -e

# 加载工具函数
source "$(dirname "$0")/version/utils.sh"
source "$(dirname "$0")/version/analyze_commits.sh"

# 更新 package.json 中的版本号
update_package_version() {
    local version=$1
    local package_json
    package_json=$(git rev-parse --show-toplevel)/package.json

    # 使用 sed 更新版本号
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/\"version\": *\"[^\"]*\"/\"version\": \"$version\"/" "$package_json"
    else
        # Linux 和 Windows
        sed -i "s/\"version\": *\"[^\"]*\"/\"version\": \"$version\"/" "$package_json"
    fi
}

# 主流程
main() {
    # 检查工作区状态
    if ! check_working_tree; then
        print_red "错误: 工作区不干净，请先提交或储藏您的更改"
        print_yellow "未提交的更改:"
        git status -s
        exit 1
    fi

    # 获取最近的标签
    print_green "正在获取最近的标签..."
    latest_tag=$(get_latest_tag)
    print_yellow "最近的标签: $latest_tag"

    # 分析提交历史
    print_green "正在分析提交历史..."
    # 使用独立的 analyze_commits.sh 脚本
    readarray -t output < <(analyze_commits "$latest_tag")
    
    if [[ ${#output[@]} -eq 0 ]]; then
        print_yellow "没有发现版本相关的提交"
        read -rp "是否要手动增加一个版本号？(Y/n) " manual_bump
        if [[ -z "$manual_bump" || ${manual_bump,,} == "y" ]]; then
            readarray -t version_parts < <(parse_version "$latest_tag")
            local major="${version_parts[0]}"
            local minor="${version_parts[1]}"
            local patch="${version_parts[2]}"
            patch=$((patch + 1))
            new_version=$(format_version "$major" "$minor" "$patch")
            changelog=("* bump: 手动更新版本号到 $new_version")
        else
            print_yellow "操作已取消"
            exit 0
        fi
    else
        # 第一个元素是新版本号
        new_version="${output[0]}"
        # 其余元素是 changelog
        changelog=("${output[@]:1}")
    fi

    # 显示变更信息
    print_green "\n将要创建新版本: $new_version"
    if [[ ${#changelog[@]} -gt 0 ]]; then
        print_green "Changelog:"
        for line in "${changelog[@]}"; do
            print_yellow "  $line"
        done
    fi

    # 预览 changelog
    print_green "\n预览 changelog 内容:"
    bash "$(dirname "$0")/version/update_changelog.sh" --preview "$new_version" "${changelog[@]}" | while IFS= read -r line; do
        print_yellow "  $line"
    done

    # 确认操作
    read -rp "是否继续？(Y/n) " confirmation
    if [[ -z "$confirmation" || ${confirmation,,} == "y" ]]; then
        # 更新文件
        print_green "\n更新 package.json..."
        update_package_version "$new_version"

        print_green "更新 CHANGELOG.md..."
        bash "$(dirname "$0")/version/update_changelog.sh" "$new_version" "${changelog[@]}"

        # 提交更改
        print_green "提交更改..."
        git add package.json CHANGELOG.md
        git commit -m "release: v$new_version"

        # 创建标签
        print_green "创建标签..."
        git tag -a "v$new_version" -m "Release v$new_version"

        # 推送更改
        print_green "\n推送更改到远程仓库..."
        git push && git push --tags

        print_green "\n✨ 完成！新版本 v$new_version 已创建并推送"
    else
        print_yellow "操作已取消"
        exit 0
    fi
}

main "$@" 