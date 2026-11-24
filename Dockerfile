# =============================================================================
# AI Life Companion for Students - Production Dockerfile
# PHP 8.2 with Apache, PDO MySQL, and SQLite Fallback Support
# =============================================================================

FROM php:8.2-apache

# Install system dependencies including SQLite3 development libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsqlite3-dev \
    sqlite3 \
    libzip-dev \
    zip \
    unzip \
    curl \
    ca-certificates \
    && docker-php-ext-install pdo pdo_mysql pdo_sqlite \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite for router and RESTful endpoints
RUN a2enmod rewrite

# Configure Apache virtual host and AllowOverride All
RUN sed -ri -e 's!/var/www/html!/var/www/html!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/!/var/www/html!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf \
    && echo "<Directory /var/www/html>\n\tOptions -Indexes +FollowSymLinks\n\tAllowOverride All\n\tRequire all granted\n</Directory>" >> /etc/apache2/apache2.conf

# Set working directory
WORKDIR /var/www/html

# Copy application files into the container
COPY . /var/www/html/

# Set appropriate permissions for web user (www-data)
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html \
    && touch /var/www/html/ai_life_companion_fallback.sqlite \
    && chown www-data:www-data /var/www/html/ai_life_companion_fallback.sqlite \
    && chmod 664 /var/www/html/ai_life_companion_fallback.sqlite

# Default environment variables
ENV PORT=80 \
    APP_ENV=production \
    DB_HOST=127.0.0.1 \
    DB_PORT=3306 \
    DB_NAME=ai_life_companion \
    DB_USER=root \
    DB_PASS= \
    AI_MODEL=gpt-4o-mini

EXPOSE 80

# Run Apache in foreground
CMD ["apache2-foreground"]
