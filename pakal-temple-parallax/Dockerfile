# ==============================================================================
# PAKAL TUN — DOCKERFILE DE PRODUCCIÓN (NGINX ALPINE HIGH-PERFORMANCE)
# Servidor web ultraligero (<25MB), optimizado con compresión gzip y cache de assets
# ==============================================================================

FROM nginx:1.27-alpine-slim

# Metadatos del contenedor
LABEL maintainer="Maestro Yax Balam <contacto@pakaltun.mx>"
LABEL description="Landing Page Inmersiva Parallax 3D - Templo Maya Pakal Tun"

# Eliminar configuración por defecto de Nginx
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada optimizada de Nginx
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    listen [::]:80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Compresión Gzip para máximo rendimiento de transferencia
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml image/svg+xml;
    gzip_disable "MSIE [1-6]\.";

    # Cache de assets estáticos (imágenes y estilos)
    location ~* \.(?:jpg|jpeg|gif|png|ico|cur|gz|svg|svgz|mp4|ogg|ogv|webm|htc|webp)$ {
        expires 1M;
        access_log off;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # CSS y JS con revalidación eficiente
    location ~* \.(?:css|js)$ {
        expires 7d;
        access_log off;
        add_header Cache-Control "public, max-age=604800";
    }

    # Seguridad: Bloquear acceso a archivos ocultos
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    # Enrutamiento de página principal
    location / {
        try_files \$uri \$uri/ /index.html;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }

    # Healthcheck endpoint
    location = /healthz {
        access_log off;
        default_type text/plain;
        return 200 'OK';
    }
}
EOF

# Copiar archivos del proyecto al directorio web de Nginx
COPY . /usr/share/nginx/html

# Exponer el puerto estándar HTTP
EXPOSE 80

# Comprobación de salud nativa de Docker
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/healthz || exit 1

# Comando por defecto para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
