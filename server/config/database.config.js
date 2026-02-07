// Database Configuration (Single Responsibility Principle)
require('dotenv').config();
const { Pool } = require('pg');

class DatabaseConfig {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false
            }
        });
    }

    async testConnection() {
        try {
            const client = await this.pool.connect();
            console.log('✅ Connected to PostgreSQL database (Neon)');
            client.release();
            return true;
        } catch (error) {
            console.error('❌ Database connection error:', error.message);
            return false;
        }
    }

    getPool() {
        return this.pool;
    }
}

module.exports = new DatabaseConfig();
