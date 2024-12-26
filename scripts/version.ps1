#!/usr/bin/env pwsh

# 设置错误操作
$ErrorActionPreference = "Stop"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Get-LatestTag {
    $latestTag = git describe --tags --abbrev=0 2>$null
    if ($LASTEXITCODE -ne 0) {
        return "0.0.0"
    }
    return $latestTag
}

function Get-CommitsSinceTag($tag) {
    if ($tag -eq "0.0.0") {
        return git log --format="%H%n%s%n%b" --reverse
    }
    return git log "${tag}..HEAD" --format="%H%n%s%n%b" --reverse
}

function ConvertTo-Version($version) {
    if ($version -match '(\d+)\.(\d+)\.(\d+)') {
        return @{
            Major = [int]$Matches[1]
            Minor = [int]$Matches[2]
            Patch = [int]$Matches[3]
        }
    }
    throw "Invalid version format: $version"
}

function Get-NewVersion($commits, $currentVersion) {
    $version = ConvertTo-Version $currentVersion
    $commitTypes = @{
        HasBreakingChange = $false
        HasFeat = $false
        HasFix = $false
        HasBump = $false
    }
    $changelog = @()

    # 分析所有提交
    $commits | ForEach-Object {
        $commitHash, $subject, $body = $_ -split "`n"
        
        # 检查是否有破坏性变更
        if ($subject -match 'BREAKING CHANGE:' -or $body -match 'BREAKING CHANGE:' -or $subject -match '!:') {
            $commitTypes.HasBreakingChange = $true
        }
        
        # 检查提交类型并更新日志
        switch -Regex ($subject) {
            '^feat(\(.+\))?:' {
                $commitTypes.HasFeat = $true
                $changelog += "* $subject ($commitHash)"
            }
            '^fix(\(.+\))?:' {
                $commitTypes.HasFix = $true
                $changelog += "* $subject ($commitHash)"
            }
            '^bump(\(.+\))?:' {
                $commitTypes.HasBump = $true
                $changelog += "* $subject ($commitHash)"
            }
        }
    }

    # 版本号更新逻辑
    if ($commitTypes.HasBreakingChange) {
        Write-ColorOutput Yellow "检测到 BREAKING CHANGE，将增加主版本号(major)"
        $version.Major++
        $version.Minor = 0
        $version.Patch = 0
    }
    elseif ($commitTypes.HasFeat) {
        $version.Minor++
        $version.Patch = 0
    }
    elseif ($commitTypes.HasFix -or $commitTypes.HasBump) {
        $version.Patch++
    }
    elseif (-not ($commitTypes.HasFeat -or $commitTypes.HasFix -or $commitTypes.HasBump)) {
        Write-ColorOutput Yellow "警告: 没有发现版本相关的提交类型 (feat/fix/bump)"
        exit 0
    }

    return @{
        Version = "$($version.Major).$($version.Minor).$($version.Patch)"
        Changelog = $changelog
    }
}

function Update-PackageVersion($version) {
    $packageJsonPath = Join-Path (git rev-parse --show-toplevel) "package.json"
    $packageJson = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
    $packageJson.version = $version
    $packageJson | ConvertTo-Json -Depth 100 | Set-Content $packageJsonPath -NoNewline
}

function Update-Changelog($version, $changelog) {
    $changelogPath = Join-Path (git rev-parse --show-toplevel) "CHANGELOG.md"
    $date = Get-Date -Format "yyyy-MM-dd"
    $newContent = @"
# $version ($date)

$($changelog -join "`n")

"@

    if (Test-Path $changelogPath) {
        $existingContent = Get-Content $changelogPath -Raw
        $newContent = "$newContent`n$existingContent"
    }

    Set-Content $changelogPath $newContent
}

# 主流程
try {
    # 获取最近的tag
    Write-ColorOutput Green "正在获取最近的标签..."
    $latestTag = Get-LatestTag
    Write-ColorOutput Yellow "最近的标签: $latestTag"

    # 获取commit历史
    Write-ColorOutput Green "正在分析commit历史..."
    $commits = Get-CommitsSinceTag $latestTag

    if (-not $commits) {
        Write-ColorOutput Yellow "没有新的提交，无需更新版本"
        exit 0
    }

    # 计算新版本
    $result = Get-NewVersion $commits $latestTag
    $newVersion = $result.Version
    $changelog = $result.Changelog

    Write-ColorOutput Green "`n将要创建新版本: $newVersion"
    Write-ColorOutput Green "`nChangelog:"
    $changelog | ForEach-Object { Write-ColorOutput Yellow "  $_" }

    # 确认
    $confirmation = Read-Host "`n是否继续？(Y/n)"
    if ($confirmation -and $confirmation.ToLower() -ne 'y') {
        Write-ColorOutput Yellow "操作已取消"
        exit 0
    }

    # 更新文件
    Write-ColorOutput Green "`n更新 package.json..."
    Update-PackageVersion $newVersion

    Write-ColorOutput Green "更新 CHANGELOG.md..."
    Update-Changelog $newVersion $changelog

    # 提交更改
    Write-ColorOutput Green "提交更改..."
    git add package.json CHANGELOG.md
    git commit -m "release: v$newVersion"

    # 创建标签
    Write-ColorOutput Green "创建标签..."
    git tag -a "v$newVersion" -m "Release v$newVersion"

    Write-ColorOutput Green "`n✨ 完成！新版本 v$newVersion 已创建"
    Write-ColorOutput Green "请使用 'git push && git push --tags' 推送更改"

} catch {
    Write-ColorOutput Red "错误: $_"
    exit 1
} 