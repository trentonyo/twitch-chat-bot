import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),
});

const connectToDatabase = () => {
    return new Promise((resolve, reject) => {
        pool.connect()
            .then(client => {
                console.log('Connected to the database successfully');
                client.release();
                resolve(true);
            })
            .catch(err => {
                console.error('Failed to connect to the database:', err);
                reject(err);
            });
    });
};

// Export the pool to use it in other parts of your app
export { pool, connectToDatabase };