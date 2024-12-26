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

# 从 package.json 读取版本号
get_package_version() {
    local package_json=$1
    if [[ -f $package_json ]]; then
        grep -o '"version": *"[^"]*"' "$package_json" | grep -o '[0-9]\+\.[0-9]\+\.[0-9]\+'
    fi
}

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

# 获取最近的 tag 或 package.json 中的版本号
get_latest_tag() {
    local latest_tag
    local package_version

    # 首先尝试从 git tag 取最近的标签
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

# 获取并分析提交历史
analyze_commits() {
    local current_version=$1
    local has_breaking_change=false
    local has_feat=false
    local has_fix=false
    local changelog=()
    local commits

    # 获取提交历史
    if git tag -l "v$current_version" | grep -q .; then
        # 如果当前版本存在对应的标签，获取从该标签到现在的提交
        commits=$(git log "v$current_version..HEAD" --format="%H%n%s%n%b" --reverse 2>/dev/null)
    else
        # 如果当前版本没有对应的标签，获取所有提交
        commits=$(git log --format="%H%n%s%n%b" --reverse 2>/dev/null)
    fi

    if [[ -z "$commits" ]]; then
        echo "no_commits"
        return
    fi

    # 分析提交类型
    local has_version_related_commit=false
    while IFS= read -r commit_hash && IFS= read -r subject && IFS= read -r body; do
        if [[ $subject == *"BREAKING CHANGE:"* ]] || [[ $body == *"BREAKING CHANGE:"* ]] || [[ $subject == *"!:"* ]]; then
            has_breaking_change=true
            has_version_related_commit=true
            changelog+=("* $subject ($commit_hash)")
        elif [[ $subject =~ ^feat(\(.+\))?:.+ ]]; then
            has_feat=true
            has_version_related_commit=true
            changelog+=("* $subject ($commit_hash)")
        elif [[ $subject =~ ^fix(\(.+\))?:.+ ]]; then
            has_fix=true
            has_version_related_commit=true
            changelog+=("* $subject ($commit_hash)")
        fi
    done < <(echo "$commits")

    if [[ $has_version_related_commit == false ]]; then
        echo "no_version_commits"
        return
    fi

    # 计算新版本号
    read -r major minor patch < <(parse_version "$current_version")
    if [[ $has_breaking_change == true ]]; then
        major=$((major + 1))
        minor=0
        patch=0
    elif [[ $has_feat == true ]]; then
        minor=$((minor + 1))
        patch=0
    elif [[ $has_fix == true ]]; then
        patch=$((patch + 1))
    fi

    echo "$major.$minor.$patch" "${changelog[@]}"
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

    {
        echo "# $version ($date)"
        echo
        for change in "${changelog[@]}"; do
            echo "$change"
        done
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

    # 获取最近的标签
    print_green "正在获取最近的标签..."
    latest_tag=$(get_latest_tag)
    print_yellow "最近的标签: $latest_tag"

    # 分析提交历史
    print_green "正在分析提交历史..."
    read -r result changelog < <(analyze_commits "$latest_tag")

    case $result in
        "no_commits"|"no_version_commits")
            print_yellow "没有发现版本相关的提交"
            read -rp "是否要手动增加一个版本号？(Y/n) " manual_bump
            if [[ -z "$manual_bump" || ${manual_bump,,} == "y" ]]; then
                read -r major minor patch < <(parse_version "$latest_tag")
                patch=$((patch + 1))
                new_version="$major.$minor.$patch"
                changelog=("* bump: 手动更新版本号到 $new_version")
            else
                print_yellow "操作已取消"
                exit 0
            fi
            ;;
        *)
            new_version=$result
            ;;
    esac

    # 显示变更信息
    print_green "\n将要创建新版本: $new_version"
    if [[ ${#changelog[@]} -gt 0 ]]; then
        print_green "Changelog:"
        for line in "${changelog[@]}"; do
            print_yellow "  $line"
        done
    fi

    # 确认操作
    read -rp "是否继续？(Y/n) " confirmation
    if [[ -z "$confirmation" || ${confirmation,,} == "y" ]]; then
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