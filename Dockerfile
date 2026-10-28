FROM nginx:alpine

LABEL maintainer="Oltre il Portale <minecraft.guidelli.net>"
LABEL description="Web portal and server status showcase for Minecraft Oltre il Portale"

# Install curl for healthcheck
RUN apk add --no-cache curl

# Remove default nginx configurations
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copy website assets to nginx root
COPY public /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck configuration
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
