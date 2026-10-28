FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
LABEL description="Oltre il Portale - sito del server Minecraft"
RUN apk add --no-cache curl && rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 CMD curl -f http://localhost/health || exit 1
CMD ["nginx", "-g", "daemon off;"]
