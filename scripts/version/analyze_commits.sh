#!/bin/bash

# 解析版本号，返回数组
parse_version() {
    local version=$1
    if [[ $version =~ ^([0-9]+)\.([0-9]+)\.([0-9]+)$ ]]; then
        local major="${BASH_REMATCH[1]}"
        local minor="${BASH_REMATCH[2]}"
        local patch="${BASH_REMATCH[3]}"
        
        if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
            # 如果是直接运行脚本，输出友好格式
            echo "$major $minor $patch"
        else
            # 如果是被其他脚本调用，输出数组格式
            echo "$major"
            echo "$minor"
            echo "$patch"
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
    echo "$major.$minor.$patch"
}

# 分析提交历史
analyze_commits() {
    local current_version=$1
    local commits=$2  # 提交历史内容
    local has_breaking_change=false
    local has_feat=false
    local has_fix=false
    local has_optimize=false
    local changelog=()

    echo "开始分析提交历史..." >&2
    echo "当前版本: $current_version" >&2

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
            elif [[ $commit_msg =~ ^optimize(\(.+\))?:.+ ]]; then
                echo "发现优化" >&2
                has_optimize=true
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
    local major="${version_parts[0]}"
    local minor="${version_parts[1]}"
    local patch="${version_parts[2]}"

    if [[ $has_breaking_change == true ]]; then
        major=$((major + 1))
        minor=0
        patch=0
        echo "版本更新: 主版本号递增" >&2
    elif [[ $has_feat == true ]] || [[ $has_optimize == true ]]; then
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
        commits=${2:-""}
        analyze_commits "$current_version" "$commits"
    fi
fi 