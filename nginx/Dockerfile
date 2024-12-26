FROM nginx:1.24-alpine

ARG VERSION
LABEL version=$VERSION

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# 同时暴露 HTTP 和 HTTPS 端口
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]