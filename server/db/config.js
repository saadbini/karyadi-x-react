import path from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), ".env") });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });


const sequelize = new Sequelize(
  process.env.DB_NAME || 'karyadi',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    pool: {
      max: 20,
      min: 0,
      acquire: 60000,
      idle: 10000,
      evict: 30000, // 30 seconds
    },
    logging: process.env.NODE_ENV !== 'production',
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false,
      connectTimeout: 60000, // 60 seconds
      statement_timeout: 60000, // 60 seconds for queries
      idle_in_transaction_session_timeout: 60000 // 60 seconds for idle transactions
    }
  }
);

// Test the connection with retry logic
const maxRetries = 5;
const retryDelay = 2000; // 2 seconds
let retries = 0;

function connectWithRetry() {
  return sequelize.authenticate()
    .then(() => {
      console.log('Database connection has been established successfully.');
    })
    .catch(err => {
      if (retries < maxRetries) {
        retries++;
        const delay = retryDelay * retries;
        console.log(`Connection attempt ${retries} failed. Retrying in ${delay / 1000} seconds...`);
        setTimeout(connectWithRetry, delay);
      } else {
        console.error('Unable to connect to the database after multiple attempts:', err);
      }
    });
}

connectWithRetry();

export default sequelize;
