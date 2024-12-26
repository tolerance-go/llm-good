const { execSync } = require('child_process');
const path = require('path');
const chalk = require('chalk');

// 工具函数
function printGreen(message) {
  console.log(chalk.green(message));
}

function execCommand(command) {
  try {
    execSync(command, { 
      stdio: 'inherit',
      shell: process.platform === 'win32' ? 'bash' : '/bin/bash'
    });
  } catch (error) {
    console.error(chalk.red(`执行命令失败: ${command}`));
    console.error(error);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 开始发布流程...\n');

  try {
    // 1. 执行版本更新脚本
    printGreen('📦 步骤 1/4: 更新版本号...');
    execCommand('bash ./scripts/version.sh');
    printGreen('✅ 版本更新完成\n');

    // 2. 构建 Docker 镜像
    printGreen('🏗️  步骤 2/4: 构建 Docker 镜像...');
    execCommand('pnpm run docker:build');
    printGreen('✅ Docker 镜像构建完成\n');

    // 3. 推送 Docker 镜像
    printGreen('⬆️  步骤 3/4: 推送 Docker 镜像...');
    execCommand('pnpm run docker:deploy');
    printGreen('✅ Docker 镜像推送完成\n');

    // 4. 部署到生产环境
    printGreen('🚀 步骤 4/4: 部署到生产环境...');
    execCommand('pnpm run deploy:prod');
    printGreen('✅ 部署完成\n');

    printGreen('🎉 发布流程全部完成！');
  } catch (error) {
    console.error(chalk.red('发布过程中出现错误:'));
    console.error(error);
    process.exit(1);
  }
}

main().catch(console.error);