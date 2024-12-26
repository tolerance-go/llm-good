#!/bin/bash

set -e

# 加载工具函数
source "$(dirname "$0")/version/utils.sh"
source "$(dirname "$0")/version/analyze_commits.sh"
source "$(dirname "$0")/version/version_utils.sh"

# 获取 git 提交历史
get_git_commits() {
    local current_version=$1
    local commits=""

    if git rev-parse "v$current_version" >/dev/null 2>&1; then
        echo "找到版本标签 v$current_version，获取从该标签到现在的提交" >&2
        commits=$(git log "v$current_version..HEAD" --format="%H%n%B%n----------" --reverse)
    else
        # 如果找不到指定的版本标签，尝试获取最近的标签
        local latest_tag
        if latest_tag=$(git describe --tags --abbrev=0 2>/dev/null); then
            echo "找到最近的标签 $latest_tag，获取从该标签到现在的提交" >&2
            commits=$(git log "$latest_tag..HEAD" --format="%H%n%B%n----------" --reverse)
            # 更新当前版本为最近的标签版本（去掉 v 前缀）
            current_version=${latest_tag#v}
        else
            echo "未找到任何标签，获取所有提交" >&2
            commits=$(git log --format="%H%n%B%n----------" --reverse)
        fi
    fi

    echo "$commits"
}

# 获取 package.json 内容
get_package_json() {
    local package_json_path
    package_json_path=$(git rev-parse --show-toplevel)/package.json
    if [[ -f "$package_json_path" ]]; then
        cat "$package_json_path"
    fi
}

# 更新 package.json 中的版本号
update_package_version() {
    local version=$1
    local package_json_path
    package_json_path=$(git rev-parse --show-toplevel)/package.json

    # 使用 sed 更新版本号
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/\"version\": *\"[^\"]*\"/\"version\": \"$version\"/" "$package_json_path"
    else
        # Linux 和 Windows
        sed -i "s/\"version\": *\"[^\"]*\"/\"version\": \"$version\"/" "$package_json_path"
    fi
}

# 主流程
main() {
    # 获取环境信息
    local git_status
    git_status=$(git status --porcelain)
    local package_content
    package_content=$(get_package_json)
    local git_tags
    git_tags=$(git tag)

    # 检查工作区状态
    if ! check_working_tree "$git_status"; then
        print_red "错误: 工作区不干净，请先提交或储藏您的更改"
        print_yellow "未提交的更改:"
        git status -s
        exit 1
    fi

    # 获取最近的标签
    print_green "正在获取最近的标签..."
    latest_tag=$(get_latest_tag "$git_tags" "$package_content")
    print_yellow "最近的标签: $latest_tag"

    # 获取提交历史
    print_green "正在获取提交历史..."
    commits=$(get_git_commits "$latest_tag")

    # 分析提交历史
    print_green "正在分析提交历史..."
    readarray -t output < <(analyze_commits "$latest_tag" "$commits")
    
    # 解析提交输出
    local new_version
    local -a changelog
    if [[ ${#output[@]} -eq 0 ]] || [[ "${output[0]}" == "no_version_commits" ]]; then
        print_yellow "没有发现版本相关的提交"
        # 先计算新版本号和 changelog
        readarray -t bump_output < <(bump_version "$latest_tag")
        new_version="${bump_output[0]}"
        changelog=("${bump_output[@]:1}")

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

        # 询问是否继续
        read -rp "是否要手动增加一个版本号？(Y/n) " manual_bump
        if [[ -z "$manual_bump" || ${manual_bump,,} == "y" ]]; then
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
        else
            print_yellow "操作已取消"
            exit 0
        fi
    else
        readarray -t parsed_output < <(parse_commits_output "$latest_tag" "${output[@]}")
        new_version="${parsed_output[0]}"
        changelog=("${parsed_output[@]:1}")

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
    fi
}

main "$@" 