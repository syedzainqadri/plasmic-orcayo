# Quick Start with Improved Deployment

This guide will help you quickly set up and run Plasmic using the improved deployment system.

## Prerequisites

- Docker Engine (v20.10.0 or later)
- Docker Compose (v2.0.0 or later)

## Step 1: Setup Environment

First, run the setup command to prepare your environment:

```bash
./deploy-plasmic.sh setup
```

This will:
- Create a `.env` file from the example
- Generate secure keys for session secret and CMS integration API
- Verify all prerequisites are installed

## Step 2: Start Local Development

Start the local development environment:

```bash
./deploy-plasmic.sh start local
```

This will:
- Build the necessary Docker images
- Start PostgreSQL database, Redis, and Plasmic services
- Run database migrations automatically
- Seed the database with default data

## Step 3: Access the Application

Once the services are running, you can access:

- **Web App Builder**: http://localhost:3003
- **Backend API**: http://localhost:3004
- **Additional services**: http://localhost:3005

## Step 4: Login to the Application

Use the default admin credentials:
- Email: `admin@admin.example.com`
- Password: `!53kr3tz!`

## Useful Commands

- Check service status: `./deploy-plasmic.sh status local`
- View logs: `./deploy-plasmic.sh logs local`
- Stop services: `./deploy-plasmic.sh stop local`
- Restart services: `./deploy-plasmic.sh restart local`

## Next Steps

- Review the [full deployment guide](DEPLOYMENT_GUIDE.md) for advanced configuration
- Learn about [CMS integration](cms-integration-demo.html) for embedding Plasmic in your CMS
- Check out the [API endpoints](platform/wab/src/wab/server/routes/cms-integration.ts) for custom integrations

## Troubleshooting

If you encounter issues:

1. Check if all Docker containers are running: `./deploy-plasmic.sh status local`
2. View logs for any error messages: `./deploy-plasmic.sh logs local`
3. Make sure ports 3003-3005, 5433, and 6379 are not in use by other applications
4. Verify your environment variables in the `.env` file