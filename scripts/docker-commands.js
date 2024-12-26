const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 读取版本号
const lernaJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../lerna.json'), 'utf8'));
const version = lernaJson.version;

// 定义服务列表
const services = ['website', 'frontend', 'backend', 'game-hub', 'game-maker', 'nginx', 'db'];

// 执行命令并打印输出
function runCommand(command) {
  try {
    execSync(command, { 
      stdio: 'inherit',
      env: { ...process.env, VERSION: version }
    });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

// 获取命令类型
const command = process.argv[2];

switch (command) {
  case 'build':
    // 使用 docker-compose.build.yml 构建所有服务
    runCommand(`docker compose -f docker-compose.build.yml --env-file .env.prod build --no-cache`);
    
    // 构建完成后，为所有服务打上对应的标签
    services.forEach(service => {
      // 从 latest 标签复制到版本标签
      runCommand(`docker tag llm-good-${service}:latest llm-good-${service}:${version}`);
      // 打上远程仓库的标签
      const registryTag = `registry.cn-heyuan.aliyuncs.com/llm-good/${service}:${version}`;
      runCommand(`docker tag llm-good-${service}:${version} ${registryTag}`);
    });
    break;

  case 'push':
    // 如果指定了特定服务
    const service = process.argv[3];
    if (service && services.includes(service)) {
      const registryTag = `registry.cn-heyuan.aliyuncs.com/llm-good/${service}:${version}`;
      runCommand(`docker push ${registryTag}`);
    } 
    // 如果没有指定服务，推送所有服务
    else if (!service) {
      services.forEach(svc => {
        const registryTag = `registry.cn-heyuan.aliyuncs.com/llm-good/${svc}:${version}`;
        runCommand(`docker push ${registryTag}`);
      });
    } else {
      console.error(`Invalid service: ${service}`);
      process.exit(1);
    }
    break;

  default:
    console.error('Invalid command. Available commands: build, push');
    process.exit(1);
} 