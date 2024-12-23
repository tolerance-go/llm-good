FROM mysql:8.0

ARG VERSION
LABEL version=$VERSION

COPY apps/backend/prisma/init.sh /docker-entrypoint-initdb.d/init.sh

RUN chmod +x /docker-entrypoint-initdb.d/init.sh

EXPOSE 3306

CMD ["mysqld", "--default-authentication-plugin=mysql_native_password", "--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci"] 