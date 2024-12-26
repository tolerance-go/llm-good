#!/bin/bash

# 解析版本号，返回数组
parse_version() {
    local version=$1
    if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
            # 如果是直接运行脚本，输出友好格式
            printf "%d %d %d\n" "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}"
        else
            # 如果是被其他脚本调用，输出数组格式
            printf "%d\n%d\n%d\n" "${BASH_REMATCH[1]}" "${BASH_REMATCH[2]}" "${BASH_REMATCH[3]}"
        fi
    else
        echo "无效的版本号格式: $version" >&2
        exit 1
    fi
}

# 格式化版本号
format_version() {
    local major=$1
    local minor=$2
    local patch=$3
    printf "%d.%d.%d" "$major" "$minor" "$patch"
}

# 分析提交历史
analyze_commits() {
    local current_version=$1
    local has_breaking_change=false
    local has_feat=false
    local has_fix=false
    local changelog=()
    local commits

    echo "开始分析提交历史..." >&2
    echo "当前版本: $current_version" >&2

    # 获取提交历史，使用 %B 获取完整的提交信息
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

    if [[ -z "$commits" ]]; then
        echo "没有找到任何提交" >&2
        echo "no_commits"
        return
    fi

    # 分析提交类型
    local has_version_related_commit=false
    local commit_hash=""
    local commit_msg=""
    local IFS=$'\n'
    
    # 读取并处理每个提交
    while read -r line; do
        if [[ -z "$commit_hash" ]]; then
            # 第一行是 commit hash
            commit_hash=${line:0:8}
            continue
        fi
        
        if [[ "$line" == "----------" ]]; then
            # 处理收集到的提交信息
            echo "分析提交: $commit_hash" >&2
            echo "提交信息: $commit_msg" >&2
            echo "---" >&2
            
            if [[ $commit_msg == *"BREAKING CHANGE:"* ]] || [[ $commit_msg == *"!:"* ]]; then
                echo "发现破坏性变更" >&2
                has_breaking_change=true
                has_version_related_commit=true
                changelog+=("* $commit_msg ($commit_hash)")
            elif [[ $commit_msg =~ ^feat(\(.+\))?:.+ ]]; then
                echo "发现新功能" >&2
                has_feat=true
                has_version_related_commit=true
                changelog+=("* $commit_msg ($commit_hash)")
            elif [[ $commit_msg =~ ^fix(\(.+\))?:.+ ]]; then
                echo "发现修复" >&2
                has_fix=true
                has_version_related_commit=true
                changelog+=("* $commit_msg ($commit_hash)")
            fi
            
            # 重置变量，准备处理下一个提交
            commit_hash=""
            commit_msg=""
            continue
        fi
        
        # 收集提交信息
        if [[ -n "$commit_msg" ]]; then
            commit_msg+=" "
        fi
        commit_msg+="$line"
    done < <(echo "$commits")

    if [[ $has_version_related_commit == false ]]; then
        echo "没有发现版本相关的提交" >&2
        echo "no_version_commits"
        return
    fi

    # 计算新版本号
    local -a version_parts
    readarray -t version_parts < <(parse_version "$current_version")
    local major=${version_parts[0]}
    local minor=${version_parts[1]}
    local patch=${version_parts[2]}

    if [[ $has_breaking_change == true ]]; then
        major=$((major + 1))
        minor=0
        patch=0
        echo "版本更新: 主版本号递增" >&2
    elif [[ $has_feat == true ]]; then
        minor=$((minor + 1))
        patch=0
        echo "版本更新: 次版本号递增" >&2
    elif [[ $has_fix == true ]]; then
        patch=$((patch + 1))
        echo "版本更新: 修订号递增" >&2
    fi

    local new_version
    new_version=$(format_version "$major" "$minor" "$patch")

    # 输出新版本号和变更日志
    echo "新版本号: $new_version" >&2
    echo "变更日志条目数: ${#changelog[@]}" >&2

    echo "$new_version"
    printf "%s\n" "${changelog[@]}"
}

# 如果直接运行此脚本，则执行测试
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    if [[ $1 == "parse_version" ]]; then
        shift
        parse_version "$@"
    else
        current_version=${1:-"0.0.0"}
        analyze_commits "$current_version"
    fi
fi 