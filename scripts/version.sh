#!/bin/bash

set -e

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

# 获取最近的 tag 或 package.json 中的版本号
get_latest_tag() {
    local latest_tag
    local package_version

    # 首先尝试从 package.json 获取版本号
    package_version=$(jq -r '.version' "$(git rev-parse --show-toplevel)/package.json")
    if [[ $package_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo "$package_version"
        return
    fi

    # 如果 package.json 中没有有效的版本号，尝试获取最近的 tag
    if ! latest_tag=$(git describe --tags --abbrev=0 2>/dev/null); then
        echo "无"
        return
    fi
    echo "$latest_tag" | sed 's/^v//'
}

# 解析版本号
parse_version() {
    local version=$1
    if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        echo "${BASH_REMATCH[1]} ${BASH_REMATCH[2]} ${BASH_REMATCH[3]}"
    else
        print_red "无效的版本号格式: $version"
        exit 1
    fi
}

# 计算��版本号
calculate_new_version() {
    local current_version=$1
    local has_breaking_change=false
    local has_feat=false
    local has_fix=false
    local changelog=()

    # 如果当前版本是"无"，则从 package.json 中获取版本号
    if [[ $current_version == "无" ]]; then
        current_version=$(jq -r '.version' "$(git rev-parse --show-toplevel)/package.json")
        if [[ ! $current_version =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
            current_version="0.0.0"
        fi
    fi

    # 读取从最近 tag 到现在的所有提交
    local git_log_range="HEAD"
    if [[ $current_version != "0.0.0" ]]; then
        git_log_range="v$current_version..HEAD"
    fi

    while IFS= read -r commit_hash && IFS= read -r subject && IFS= read -r body; do
        # 检查是否有破坏性变更
        if [[ $subject == *"BREAKING CHANGE:"* ]] || [[ $body == *"BREAKING CHANGE:"* ]] || [[ $subject == *"!:"* ]]; then
            has_breaking_change=true
        fi

        # 检查提交类型
        if [[ $subject =~ ^feat(\(.+\))?:.+ ]]; then
            has_feat=true
            changelog+=("* $subject ($commit_hash)")
        elif [[ $subject =~ ^fix(\(.+\))?:.+ ]]; then
            has_fix=true
            changelog+=("* $subject ($commit_hash)")
        fi
    done < <(git log "$git_log_range" --format="%H%n%s%n%b" --reverse)

    # 解析当前版本号
    read -r major minor patch < <(parse_version "$current_version")

    # 根据提交类型计算新版本号
    if [[ $has_breaking_change == true ]]; then
        print_yellow "检测到 BREAKING CHANGE，将增加主版本号(major)"
        major=$((major + 1))
        minor=0
        patch=0
    elif [[ $has_feat == true ]]; then
        minor=$((minor + 1))
        patch=0
    elif [[ $has_fix == true ]]; then
        patch=$((patch + 1))
    else
        print_yellow "没有发现版本相关的提交类型 (feat/fix)"
        read -rp "是否要手动更新版本号？(y/N) " manual_bump
        if [[ ${manual_bump,,} == "y" ]]; then
            patch=$((patch + 1))
            new_version="$major.$minor.$patch"
            
            # 创建 changelog
            changelog+=("* bump: 手动更新版本号到 $new_version")
            
            # 更新 package.json
            update_package_version "$new_version"
            
            # 更新 changelog 文件
            update_changelog "$new_version" "${changelog[@]}"
            
            # 提交更改
            git add package.json CHANGELOG.md
            git commit -m "bump: 手动更新版本号到 $new_version"
            
            # 创建 tag
            git tag -a "v$new_version" -m "Release v$new_version"
            
            print_green "\n✨ 完成！新版本 v$new_version 已创建"
            print_green "请使用 'git push && git push --tags' 推送更改"
            exit 0
        else
            print_yellow "操作已取消"
            exit 0
        fi
    fi

    echo "$major.$minor.$patch" "${changelog[@]}"
}

# 更新 package.json 中的版本号
update_package_version() {
    local version=$1
    local package_json
    package_json=$(git rev-parse --show-toplevel)/package.json

    # 使用临时文件来更新 package.json
    local temp_file
    temp_file=$(mktemp)
    jq ".version = \"$version\"" "$package_json" > "$temp_file"
    mv "$temp_file" "$package_json"
}

# 更新 changelog
update_changelog() {
    local version=$1
    shift
    local changelog=("$@")
    local changelog_file
    changelog_file=$(git rev-parse --show-toplevel)/CHANGELOG.md
    local date
    date=$(date +%Y-%m-%d)
    local temp_file
    temp_file=$(mktemp)

    # 生成新的 changelog 内容
    {
        echo "# $version ($date)"
        echo
        printf "%s\n" "${changelog[@]}"
        echo
        if [[ -f $changelog_file ]]; then
            cat "$changelog_file"
        fi
    } > "$temp_file"

    mv "$temp_file" "$changelog_file"
}

# 检查工作区状态
check_working_tree() {
    if ! git diff --quiet HEAD; then
        print_red "错误: 工作区不干净，请先提交或储藏您的更改"
        print_yellow "未提交的更改:"
        git status -s
        exit 1
    fi
}

# 主流程
main() {
    # 检查工作区状态
    check_working_tree

    # 获取最近的 tag
    print_green "正在获取最近的标签..."
    latest_tag=$(get_latest_tag)
    print_yellow "最近的标签: $latest_tag"

    # 计算新版本号
    print_green "正在分析 commit 历史..."
    read -r new_version changelog < <(calculate_new_version "$latest_tag")

    # 显示变更信息
    print_green "\n将要创建新版本: $new_version"
    print_green "Changelog:"
    for line in "${changelog[@]}"; do
        print_yellow "  $line"
    done

    # 确认操作
    read -rp "是否继续？(y/N) " confirmation
    if [[ ${confirmation,,} != "y" ]]; then
        print_yellow "操作已取消"
        exit 0
    fi

    # 更新文件
    print_green "\n更新 package.json..."
    update_package_version "$new_version"

    print_green "更新 CHANGELOG.md..."
    update_changelog "$new_version" "${changelog[@]}"

    # 提交更改
    print_green "提交更改..."
    git add package.json CHANGELOG.md
    git commit -m "release: v$new_version"

    # 创建标签
    print_green "创建标签..."
    git tag -a "v$new_version" -m "Release v$new_version"

    print_green "\n✨ 完成！新版本 v$new_version 已创建"
    print_green "请使用 'git push && git push --tags' 推送更改"
}

main "$@" 