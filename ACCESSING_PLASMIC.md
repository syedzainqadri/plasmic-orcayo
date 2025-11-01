# Accessing Plasmic UI

The Plasmic application has been started with the database component running. Here's how to access the UI once the build completes:

## Current Status
- Database (plasmic-db) is running on port 5432
- The main application (plasmic-wab) is currently building

## Accessing the UI

Once the build completes, you'll be able to access:

- **Plasmic Studio (Main UI)**: http://localhost:3003
- **Backend API**: http://localhost:3004
- **Host Server**: http://localhost:3005

## If you need to access the application directly:

Since the Docker build is resource-intensive and taking a long time, you can alternatively run Plasmic directly on your machine if you have Node.js installed:

1. Make sure the database is running:
   ```bash
   docker-compose up plasmic-db -d
   ```

2. Install dependencies:
   ```bash
   cd /path/to/plasmic
   yarn install
   ```

3. Run the setup:
   ```bash
   yarn setup
   ```

4. Run the development servers:
   ```bash
   cd platform/wab
   yarn dev
   ```

## Troubleshooting

If the Docker build continues to take too long:
- Check available disk space: `df -h`
- Consider building only the database component and running the application directly on your host system

## Important Notes

- The first-time setup of Plasmic is resource-intensive
- The application requires PostgreSQL database to function
- After initial setup, subsequent runs will be faster