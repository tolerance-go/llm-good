#!/bin/bash

# 直接执行SQL命令
mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 使用数据库
USE $MYSQL_DATABASE;

-- 设置字符集
ALTER DATABASE $MYSQL_DATABASE CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 创建应用用户（如果不存在）
CREATE USER IF NOT EXISTS '$MYSQL_USER'@'%' IDENTIFIED BY '$MYSQL_PASSWORD';

-- 授予权限
GRANT ALL PRIVILEGES ON $MYSQL_DATABASE.* TO '$MYSQL_USER'@'%' WITH GRANT OPTION;
GRANT SELECT ON performance_schema.* TO '$MYSQL_USER'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

-- 启用外键检查
SET FOREIGN_KEY_CHECKS = 1;
EOF