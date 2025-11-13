# Plasmic Application Docker Deployment Guide

This guide covers the production-ready Docker deployment of the Plasmic application with all the fixes and optimizations applied.

## Table of Contents
1. [Overview](#overview)
2. [Docker Configuration](#docker-configuration)
3. [Production Deployment](#production-deployment)
4. [Development Deployment](#development-deployment)
5. [Environment Variables](#environment-variables)
6. [Health Checks](#health-checks)
7. [Security Considerations](#security-considerations)
8. [Troubleshooting](#troubleshooting)

## Overview

The Plasmic application is a complex monorepo with multiple services. The Docker setup includes:
- Application server (Node.js)
- PostgreSQL database
- Redis cache
- Nginx reverse proxy
- All necessary front-end and back-end components

## Docker Configuration

### Files Overview

- `optimized.Dockerfile`: Optimized multi-stage build for production
- `production.Dockerfile`: Full multi-stage build for production
- `docker-compose.production.yml`: Production docker-compose configuration
- `docker-compose.development.yml`: Development docker-compose configuration
- `nginx.conf`: Production nginx configuration

### Key Changes Made to Fix Build Issues

1. **Fixed live-frame build issue**: Modified rollup.config.js to use CSS stubbing instead of problematic postcss plugin
2. **Optimized build process**: Created separate optimized Dockerfile to reduce build time
3. **Security enhancements**: Added non-root user for container execution
4. **Resource management**: Added resource limits and health checks
5. **Multi-stage build**: Separated build and production stages for smaller image size

## Production Deployment

### Prerequisites

- Docker Engine 20.10+
- Docker Compose v2+
- Node version "20 || >=22" (required by application dependencies)
- At least 4GB RAM for building and 8GB for running
- 20GB+ disk space

### Steps for Production Deployment

1. **Set up environment variables** (create `.env` file):
   ```bash
   # Database
   DB_PASSWORD=your_secure_password
   DATABASE_URL=postgresql://plasmic:your_secure_password@plasmic-db:5432/plasmic_prod
   
   # Application
   PUBLIC_URL=https://your-domain.com
   NODE_ENV=production
   
   # Optional: Additional environment variables
   ```

2. **Build the application image** (for production deployment):
   ```bash
   # For production
   docker build -f production.Dockerfile -t plasmic-app:production .
   
   # Or for optimized build
   docker build -f optimized.Dockerfile -t plasmic-app:optimized .
   ```

3. **Deploy with Docker Compose**:
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

4. **Run database migrations** (on first deployment):
   ```bash
   docker-compose -f docker-compose.production.yml exec plasmic-app sh -c "cd /app/platform/wab && yarn typeorm migration:run"
   ```

5. **Verify deployment**:
   ```bash
   docker-compose -f docker-compose.production.yml ps
   docker-compose -f docker-compose.production.yml logs plasmic-app
   ```

## Development Deployment

For development, use the development compose file which mounts your source code:

```bash
# Build the development image
docker build -f optimized.Dockerfile -t plasmic-app:dev .

# Start development services
docker-compose -f docker-compose.development.yml up -d

# Access the application
# Frontend: http://localhost:3003
# Backend: http://localhost:3004
```

## Environment Variables

Required environment variables for production:

```bash
# Database
DB_PASSWORD=  # Secure password for PostgreSQL
DATABASE_URL=  # Full database connection string

# Application
PUBLIC_URL=  # Public URL for the application
NODE_ENV=production  # Set to 'production' for production

# Optional but recommended
PORT=3004  # Backend port
WAB_DBNAME=plasmic-db  # Database hostname
WAB_DBPASSWORD=  # Database password for application
CHOKIDAR_USEPOLLING=true  # File watching in containers
TRUST_PROXY=true  # Trust proxy headers
```

## Health Checks

The Docker configuration includes health checks for all services:
- PostgreSQL: Checks if database is ready
- Redis: Checks if Redis is responding
- Application: Checks /health endpoint
- Nginx: Checks if the proxy is running

## Security Considerations

1. **Non-root user**: Application runs as 'plasmic' user (UID 1001)
2. **Minimal base image**: Uses Alpine Linux for smaller attack surface
3. **Resource limits**: CPU and memory limits prevent resource exhaustion
4. **Security headers**: Nginx includes common security headers:
   - X-Frame-Options: DENY
   - X-Content-Type-Options: nosniff
   - X-XSS-Protection: "1; mode=block"
   - HSTS headers
   - Content Security Policy
5. **Network isolation**: Services run on isolated bridge network
6. **Production build**: Optimized build without development dependencies

## Troubleshooting

### Common Issues and Solutions

1. **Build times are too long**
   - Use the optimized Dockerfile for faster builds
   - Use build cache efficiently by ordering Dockerfile instructions properly
   - Consider using buildx with remote builders for faster compilation

2. **Application won't start**
   - Check database connectivity: `docker-compose logs plasmic-db`
   - Verify environment variables: `docker-compose exec plasmic-app env`
   - Check health status: `docker ps` and `docker-compose ps`

3. **Database migrations fail**
   - Ensure the database is fully initialized: `docker-compose logs plasmic-db`
   - Run migrations manually: `docker-compose exec plasmic-app yarn typeorm migration:run`

4. **Performance issues**
   - Verify resource limits match your infrastructure capabilities
   - Monitor resource usage with `docker stats`
   - Consider scaling services as needed

5. **Live-frame build errors** (if building from scratch)
   - The fix in rollup.config.js replaces the problematic postcss plugin with CSS stubbing
   - This allows CSS imports to work without requiring full CSS processing

### Useful Commands

```bash
# View logs
docker-compose -f docker-compose.production.yml logs -f plasmic-app

# Execute commands in container
docker-compose -f docker-compose.production.yml exec plasmic-app sh

# Monitor resource usage
docker stats

# Scale application (if needed)
docker-compose -f docker-compose.production.yml up -d --scale plasmic-app=2

# Backup database
docker-compose -f docker-compose.production.yml exec plasmic-db pg_dump -U plasmic plasmic_prod > backup.sql
```

## Production Best Practices

1. **Use external secrets management** for sensitive data like database passwords
2. **Implement log aggregation** for better monitoring
3. **Set up monitoring** for container metrics
4. **Regular security scanning** of the container images
5. **Automated CI/CD pipelines** for deployment
6. **Database backups** with automated schedules
7. **SSL certificates** from trusted certificate authorities
8. **Rate limiting** at the nginx level for protection against abuse

## Scaling

For production environments, consider:
- Load balancing across multiple application instances
- Database read replicas
- CDN for static assets
- Caching layers
- Auto-scaling based on metrics