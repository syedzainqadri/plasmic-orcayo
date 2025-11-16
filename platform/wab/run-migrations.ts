// Script to run TypeORM migrations programmatically with proper TypeScript support
import { createConnection } from "typeorm";

async function runMigrations() {
  try {
    // Create connection using the ormconfig.js file
    console.log("Connecting to database and running migrations...");
    const connection = await createConnection();
    
    // Run migrations
    await connection.runMigrations();
    console.log("Migrations completed successfully!");
    
    // Close connection
    await connection.close();
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  }
}

runMigrations();