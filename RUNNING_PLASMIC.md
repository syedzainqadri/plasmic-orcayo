# Running Plasmic Locally

Plasmic is a comprehensive visual builder platform with a complex architecture. Running it locally requires significant resources and a detailed setup process.

## Resource Requirements

The Plasmic project is very large and requires:
- At least 15-20 GB of free disk space
- 8 GB of RAM (16 GB recommended)
- A multi-core processor for faster builds
- Stable internet connection for dependency downloads

## Current Docker Setup

The project includes a `docker-compose.yml` file that attempts to build and run Plasmic as an all-in-one service. However, this build process is resource-intensive and may fail on systems with limited disk space or memory.

## Alternative Approaches

### Option 1: Build Environment with More Resources

If you have access to a machine with more resources, you can try running the complete setup:

```bash
# Ensure you have at least 20GB free space
docker-compose up --build
```

### Option 2: Development Approach

For development purposes, it's better to run the application using the local development commands instead of Docker:

1. Install dependencies:
```bash
yarn install
```

2. Run database setup:
```bash
cd platform/wab && yarn db:setup
```

3. Run the development servers separately:
```bash
# Terminal 1: Run the backend server
yarn dev
```

### Option 3: Production Docker Image

If available, you could use a pre-built production image instead of building from source, which would be much faster.

## Required Services

Plasmic requires several interconnected services:
- PostgreSQL database for storing user data, projects, and assets
- Backend server (runs on port 3004) for API requests
- Frontend server (runs on port 3003) for the UI
- Host server (runs on port 3005) for component hosting

## Configuration

The application needs various environment variables and configurations:
- Database connection string
- Encryption keys
- API keys for integrations (optional)
- File storage configuration

## Troubleshooting

If the Docker build fails with "no space left on device" error:
1. Free up disk space on your system
2. Clear Docker's cache: `docker system prune -a`
3. Consider running only the database container initially:
   ```bash
   docker-compose up db
   ```

## Notes

- The application is designed as a monorepo with multiple interconnected packages
- Building the entire application from source is time-intensive (can take 30+ minutes)
- For production deployments, it's recommended to use optimized build processes