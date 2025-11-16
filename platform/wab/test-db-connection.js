const fs = require('fs');
const path = require('path');

console.log('Testing database connection and module availability...\n');

// 1. Check if TypeORM is available
try {
  console.log('Checking for TypeORM installation...');
  const typeorm = require('typeorm');
  console.log('✓ TypeORM module found:', typeof typeorm);
} catch (e) {
  console.error('✗ TypeORM module NOT found:', e.message);
  console.log('Attempting to install TypeORM...\n');
  
  const { execSync } = require('child_process');
  try {
    execSync('yarn add typeorm pg reflect-metadata', { stdio: 'inherit' });
    console.log('✓ TypeORM installed successfully');
  } catch (installErr) {
    console.error('✗ Failed to install TypeORM:', installErr.message);
    process.exit(1);
  }
}

// 2. Check if data-source.ts exists
const dataSourcePath = path.join(__dirname, 'data-source.ts');
if (fs.existsSync(dataSourcePath)) {
  console.log('✓ data-source.ts file exists at:', dataSourcePath);
} else {
  console.log('⚠ data-source.ts file does NOT exist at:', dataSourcePath);
  
  // Create a temporary data-source.ts for testing
  const dbConfig = {
    type: "postgres",
    host: process.env.WAB_DBHOST || process.env.DB_HOST || "plasmic-db",
    port: parseInt(process.env.WAB_DBPORT || process.env.DB_PORT || "5432"),
    username: process.env.WAB_DBUSER || process.env.DB_USER || "wab",
    password: process.env.WAB_DBPASSWORD || process.env.DB_PASS || "SEKRET",
    database: process.env.WAB_DBNAME || process.env.DB_NAME || "wab",
    synchronize: false,
    dropSchema: false,
    logging: false,
    entities: [
      "src/wab/server/entities/**/*.ts"
    ],
    migrations: [
      "src/wab/server/migrations/**/*.ts"
    ],
    subscribers: [
      "src/wab/server/subscribers/**/*.ts"
    ]
  };
  
  const dataSourceContent = `
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource(${JSON.stringify(dbConfig, null, 2)});
`;
  
  fs.writeFileSync(path.join(__dirname, 'data-source.ts'), dataSourceContent);
  console.log('✓ Created temporary data-source.ts file');
}

// 3. Test database connection parameters
console.log('\nDatabase configuration:');
console.log('- Host:', process.env.WAB_DBHOST || process.env.DB_HOST || "plasmic-db");
console.log('- Port:', process.env.WAB_DBPORT || process.env.DB_PORT || 5432);
console.log('- Username:', process.env.WAB_DBUSER || process.env.DB_USER || "wab");
console.log('- Database:', process.env.WAB_DBNAME || process.env.DB_NAME || "wab");

// 4. Install pg module if needed for direct testing
try {
  console.log('\nChecking for pg module...');
  const { Client } = require('pg');
  
  const client = new Client({
    host: process.env.WAB_DBHOST || process.env.DB_HOST || "plasmic-db",
    port: parseInt(process.env.WAB_DBPORT || process.env.DB_PORT || "5432"),
    user: process.env.WAB_DBUSER || process.env.DB_USER || "wab",
    password: process.env.WAB_DBPASSWORD || process.env.DB_PASS || "SEKRET",
    database: process.env.WAB_DBNAME || process.env.DB_NAME || "wab",
  });

  console.log('Attempting to connect to database...');
  client.connect()
    .then(() => {
      console.log('✓ Database connection successful!');
      client.end();
      process.exit(0);
    })
    .catch(err => {
      console.error('✗ Database connection failed:', err.message);
      console.log('\nMake sure the database service is running and accessible.');
      process.exit(1);
    });
    
} catch (e) {
  console.error('✗ pg module NOT found, installing...', e.message);
  const { execSync } = require('child_process');
  try {
    execSync('yarn add pg', { stdio: 'inherit' });
    console.log('✓ pg module installed successfully');
    
    const { Client } = require('pg');
    const client = new Client({
      host: process.env.WAB_DBHOST || process.env.DB_HOST || "plasmic-db",
      port: parseInt(process.env.WAB_DBPORT || process.env.DB_PORT || "5432"),
      user: process.env.WAB_DBUSER || process.env.DB_USER || "wab",
      password: process.env.WAB_DBPASSWORD || process.env.DB_PASS || "SEKRET",
      database: process.env.WAB_DBNAME || process.env.DB_NAME || "wab",
    });

    console.log('Attempting to connect to database...');
    client.connect()
      .then(() => {
        console.log('✓ Database connection successful!');
        client.end();
        process.exit(0);
      })
      .catch(err => {
        console.error('✗ Database connection failed:', err.message);
        console.log('\nMake sure the database service is running and accessible.');
        process.exit(1);
      });
  } catch (installErr) {
    console.error('✗ Failed to install pg module:', installErr.message);
    process.exit(1);
  }
}