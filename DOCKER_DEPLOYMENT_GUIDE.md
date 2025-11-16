# Docker Deployment Guide for Plasmic (Legacy)

⚠️ **IMPORTANT NOTICE**: This guide describes the legacy deployment approach. For an improved and streamlined deployment process, please refer to the [Improved Deployment Guide](DEPLOYMENT_GUIDE.md).

## Legacy Deployment Overview

This document provides information about the original Docker deployment approach for reference purposes. For new installations, please use the improved deployment scripts and configuration.

### Legacy Prerequisites

- Docker Engine (v20.10.0 or later)
- Docker Compose (v2.0.0 or later)
- Node.js v21.5.0 (for local development)
- Node.js v22 (for production due to dependency compatibility)

### Legacy Configuration Files

The original approach used a single Docker Compose configuration:

- `docker-compose.yml` - Main Docker Compose configuration with complex volume management

### Legacy Local Development Setup

For local development with the legacy approach:

1. Ensure your environment is configured:
```
DATABASE_URI=postgresql://wab:SEKRET@142.44.136.233:5432/plasmic-db
WAB_DBNAME=plasmic-db
WAB_DBPASSWORD=SEKRET
NODE_ENV=development
```

2. Run the legacy setup:
```bash
# Build and start services
docker-compose up --build -d
```

### Legacy Production Deployment

For production with the legacy approach:

1. Configure your database settings in the docker-compose file
2. Run:
```bash
# Build and start in production mode
docker-compose -f docker-compose.yml up --build -d
```

## Recommended Approach

For a better deployment experience, please refer to the new approach:

1. **[New Deployment Guide](DEPLOYMENT_GUIDE.md)** - Complete guide for the improved deployment process
2. **[Deployment Script](deploy-plasmic.sh)** - Automated deployment script with easy commands
3. **New Docker Compose Files**:
   - `docker-compose.local.yml` - Simplified local development configuration
   - `docker-compose.prod.yml` - Production-optimized configuration

## Key Improvements in the New Approach

- Simplified deployment commands via `deploy-plasmic.sh` script
- Better environment management with `.env` file handling
- Clear separation between local development and production configurations
- Improved documentation and troubleshooting
- Automated environment setup and key generation
- Better resource management and security practices

For new installations and ongoing development, we strongly recommend using the new deployment approach described in the [Improved Deployment Guide](DEPLOYMENT_GUIDE.md).