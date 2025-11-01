# Plasmic Development Environment Setup Guide

## Prerequisites

### System Requirements
- macOS or Linux with at least 8GB RAM
- Node.js v18+ (v21 recommended)
- Yarn package manager
- PostgreSQL 12+
- Docker and Docker Compose

### Tools to Install
```bash
# Install Node Version Manager (nvm) and Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 21
nvm use 21

# Install Yarn
npm install -g yarn

# Install Docker Desktop (macOS) or Docker Engine (Linux)
# Visit: https://www.docker.com/get-started
```

## Step-by-Step Setup Instructions

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd plasmic
```

### Step 2: Install Dependencies
```bash
# Install dependencies with yarn (ignore engines if needed)
yarn install --ignore-engines
```

### Step 3: Set Up PostgreSQL Database

#### Option A: Using Docker (Recommended)
```bash
# Start PostgreSQL using Docker Compose
docker-compose up -d db

# Or using the optimized version if provided
docker-compose -f docker-compose-optimized.yml up -d db
```

#### Option B: Using Local PostgreSQL Installation
1. Install PostgreSQL locally
2. Create a database user and database:
```sql
CREATE USER wab WITH PASSWORD 'SEKRET';
CREATE DATABASE wab OWNER wab;
```

### Step 4: Database Configuration
Create a `.env` file in the root directory:
```bash
DATABASE_URI=postgres://wab:SEKRET@localhost:5432/wab
```

### Step 5: Run Database Migrations
```bash
# Navigate to the main platform directory
cd platform/wab

# Run database migrations
yarn db:migrate

# Exit back to root
cd ../..
```

### Step 6: Generate Database Models (if needed)
If you encounter model errors during development:
```bash
cd platform/wab
yarn gen:models
cd ../..
```

### Step 7: Fix Potential rsbuild Configuration Issue
Create a minimal PostCSS configuration to prevent path resolution errors:

```bash
cd platform/wab
echo "module.exports = {};" > postcss.config.js
cd ../..
```

### Step 8: Build Dependencies
Some dependencies may need to be rebuilt for your local architecture:

```bash
# Install bcrypt with legacy peer deps if needed
cd platform/wab
npm install bcrypt --legacy-peer-deps
cd ../..
```

### Step 9: Start the Development Environment
```bash
# From the root directory
DATABASE_URI=postgres://wab:SEKRET@localhost:5432/wab yarn dev
```

### Step 10: Verify Services Are Running
Wait 1-2 minutes for all services to start, then check:

- **Frontend (Studio UI)**: Open http://localhost:3003 in your browser
- **Backend API**: http://localhost:3004 (should return a response)
- **Host Server**: http://localhost:3005

## Troubleshooting Common Issues

### Issue 1: Database Connection Errors
**Symptoms**: Error connecting to database
**Solution**:
```bash
# Verify PostgreSQL is running
docker-compose ps

# Restart PostgreSQL
docker-compose restart db

# Verify the connection
psql postgresql://wab:SEKRET@localhost:5432/wab
```

### Issue 2: Frontend Won't Start (Port 3003 not accessible)
**Symptoms**: Frontend server fails to start, rsbuild errors
**Solution**:
```bash
# Check if PostgreSQL is running
docker-compose up -d db

# Stop all processes
pkill -f plasmic
pkill -f yarn
pkill -f rsbuild
pkill -f concurrently

# Create the postcss config file in platform/wab directory
cd platform/wab
echo "module.exports = {};" > postcss.config.js
cd ../..

# Restart the environment
DATABASE_URI=postgres://wab:SEKRET@localhost:5432/wab yarn dev
```

### Issue 3: Module Resolution Errors
**Symptoms**: Various errors during yarn install or dev start
**Solution**:
```bash
# Clean install dependencies
rm -rf node_modules
rm yarn.lock
yarn install --ignore-engines

# Rebuild packages if needed
yarn rebuild
```

### Issue 4: Permission Errors
**Symptoms**: EPERM errors when accessing files
**Solution**:
```bash
# Fix file permissions
chmod 644 package.json
chmod -R 755 platform/
```

## Project Structure Overview

```
plasmic/
├── platform/
│   ├── wab/              # Main application (frontend + backend)
│   ├── canvas-packages/  # Canvas components
│   ├── react-web-bundle/ # React web components
│   ├── live-frame/       # Live frame components
│   └── sub/              # Shared utilities
├── packages/             # Additional packages
├── examples/             # Example projects
└── plasmicpkgs/          # Plasmic packages
```

## Available Commands

### Development
```bash
# Start full development environment
yarn dev

# Build all packages
yarn build

# Run database migrations
yarn db:migrate

# Generate models from database
yarn gen:models
```

### Platform-specific Commands
```bash
# From platform/wab directory:
cd platform/wab

# Start only the frontend
yarn start

# Start only the backend
yarn backend

# Run tests
yarn test
```

## Important Notes

1. **Database**: The system requires PostgreSQL. Ensure it's running before starting the dev environment.

2. **Frontend Build**: The frontend may take 1-2 minutes to start up completely due to the bundling process.

3. **File Watching**: Some components use file watchers which may cause issues on some systems. If you experience high CPU usage, you may need to adjust your system's file watching limits.

4. **Ports**: Ensure ports 3003-3005 are available before starting the environment.

## Quick Start Checklist

- [ ] Node.js (v21+) and Yarn installed
- [ ] PostgreSQL running (via Docker or local installation)
- [ ] `.env` file created with DATABASE_URI
- [ ] Dependencies installed with `yarn install --ignore-engines`
- [ ] `postcss.config.js` created in `platform/wab`
- [ ] Database migrations run with `yarn db:migrate`
- [ ] Development environment started with `yarn dev`
- [ ] All services accessible at localhost:3003, 3004, 3005

---

**Success**: Once all services are running, open http://localhost:3003 in your browser to access the Plasmic Studio interface. The development environment is now ready for full development and testing.