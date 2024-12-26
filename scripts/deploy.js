const { execSync } = require('child_process');
require('dotenv').config();

const { PROD_SERVER_USER, PROD_SERVER_HOST, PROD_SERVER_PATH } = process.env;

// 检查必要的环境变量
if (!PROD_SERVER_USER || !PROD_SERVER_HOST || !PROD_SERVER_PATH) {
  console.error('错误: 缺少必要的环境变量');
  console.error('请确保在 .env 文件中设置了以下变量:');
  console.error('- PROD_SERVER_USER');
  console.error('- PROD_SERVER_HOST');
  console.error('- PROD_SERVER_PATH');
  process.exit(1);
}

try {
  // 构建 SSH 命令
  const sshCommand = `ssh ${PROD_SERVER_USER}@${PROD_SERVER_HOST} "cd ${PROD_SERVER_PATH} && git pull && ./scripts/docker-prod.sh restart"`;
  
  console.log('开始执行部署...');
  console.log(`连接到服务器: ${PROD_SERVER_HOST}`);
  
  // 执行命令
  execSync(sshCommand, { stdio: 'inherit' });
  
  console.log('部署完成！');
} catch (error) {
  console.error('部署过程中发生错误:', error.message);
  process.exit(1);
} 