# Plasmic Local Development Setup Guide

This document provides a comprehensive guide to setting up the Plasmic development environment locally on your machine.

## Prerequisites

Before setting up the development environment, ensure you have the following installed:

- Node.js (v18+ recommended, v21.5.0 confirmed working)
- Yarn (v1.22.22+)
- Docker (for PostgreSQL database)
- PostgreSQL client tools (for direct database access)
- Git

## Setup Process

### Step 1: Clone and Install Dependencies

1. Clone the Plasmic repository (if not already done)
2. Navigate to the project root directory
3. Install dependencies using Yarn:

```bash
# Set Yarn to ignore engine requirements due to dependency conflicts
yarn config set ignore-engines true

# Install all dependencies
yarn install --ignore-engines
```

### Step 2: Set Up the Database

1. Start PostgreSQL using Docker:
```bash
# Start the PostgreSQL database container using docker-compose
cd /Users/xain/Documents/GitHub/plasmic
docker-compose up -d plasmic-db
```

2. Run database migrations:
```bash
cd /Users/xain/Documents/GitHub/plasmic/platform/wab

# Update ormconfig.json to use localhost instead of service name
cp ormconfig.json ormconfig.json.bak
sed -i.bak 's/plasmic-db/localhost/g' ormconfig.json

# Run the database migrations
yarn typeorm migration:run
```

### Step 3: Build Dependencies

Run the setup script to build all required packages and dependencies:

```bash
cd /Users/xain/Documents/GitHub/plasmic

# Run the main setup process (ignore the live-frame build error)
yarn setup:sub && yarn setup:react-web-bundle && yarn setup:live-frame && yarn setup:loader-bundle-env && yarn setup:loader-html-hydrate
```

### Step 4: Start the Development Environment

1. Start the development servers:
```bash
# In the project root
yarn dev
```

The development environment will run multiple services:

- **Backend server**: Runs on port 3004 (API requests)
- **Frontend server**: Runs on port 3003 (UI)
- **Host server**: Runs on port 3005 (component hosting)

### Step 5: Verify the Setup

Once the development servers are running, you can access:

- Plasmic Studio UI: http://localhost:3003
- Backend API: http://localhost:3004
- Component host: http://localhost:3005

## Troubleshooting

### Common Issues and Solutions

1. **Port already in use errors**:
   - Check for existing processes: `lsof -i :3003,3004,3005`
   - Kill existing processes: `pkill -f plasmic` or `pkill -f yarn`

2. **Database connection errors**:
   - Ensure PostgreSQL container is running: `docker ps | grep postgres`
   - Verify ormconfig.json uses "localhost" instead of "plasmic-db"

3. **Permission errors**:
   - Fix file permissions: `find /Users/xain/Documents/GitHub/plasmic -type f -name "package.json" -exec chmod 644 {} \;`

4. **Module resolution errors**:
   - Run: `yarn config set ignore-engines true`
   - Reinstall: `yarn install --ignore-engines`

5. **Memory issues during build**:
   - The Plasmic project is very large and requires significant memory (8GB+ recommended)
   - Consider building components separately if running into memory limits

6. **Model/Field errors (e.g., "Field animationSequences does not exist on class Site")**:
   - This may indicate an issue with database schema vs. codebase compatibility
   - If encountered during seeding, skip the seed command as it's optional for basic development

## Development Workflow

### Running Individual Components

Instead of running the full development environment, you can run components separately:

```bash
# Backend only
cd /Users/xain/Documents/GitHub/plasmic/platform/wab && yarn backend

# Frontend only (after backend is running)
cd /Users/xain/Documents/GitHub/plasmic/platform/wab && yarn start

# Host server only
cd /Users/xain/Documents/GitHub/plasmic/platform/wab && yarn host-server
```

### Code Changes and Hot Reload

The development environment supports hot reloading for most changes:
- Frontend changes are reflected automatically
- Backend changes may require restarting the server
- Component changes in the canvas-packages are watched automatically

## Project Structure

- `/platform/wab` - Main Web App Builder (Studio UI and backend)
- `/platform/canvas-packages` - UI component packages
- `/platform/sub` - Subscription and billing related components
- `/platform/live-frame` - Live preview components
- `/platform/react-web-bundle` - React rendering components
- `/platform/loader-bundle-env` - Component loader environment
- `/platform/loader-html-hydrate` - HTML hydration components
- `/packages` - Various utility packages and SDKs
- `/plasmicpkgs` - Plasmic component packages

## Performance Tips

- The Plasmic development environment is resource-intensive. Ensure you have adequate memory and disk space
- If experiencing performance issues, consider running components separately rather than the full `yarn dev` command
- Use the `CHOKIDAR_USEPOLLING=true` environment variable if file watching is unreliable
- Consider increasing Docker resources if using Docker for the database

## Updating the Codebase

When updating to newer code changes:

1. Fetch the latest changes: `git pull`
2. Update dependencies: `yarn install`
3. Run migrations: `yarn typeorm migration:run`
4. Restart development servers: `yarn dev`

## Environment Variables

Create a `.env` file in `/platform/wab` with appropriate configuration variables for your development environment. See `.env.example` for reference.