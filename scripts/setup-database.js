require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function setupDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to Neon PostgreSQL database');

        // Table schema (PostgreSQL syntax)
        const tableSchema = `(
      id SERIAL PRIMARY KEY,
      firstName TEXT,
      lastName TEXT,
      email TEXT,
      phoneNumber TEXT,
      programType TEXT,
      event TEXT,
      collegeName TEXT,
      address TEXT,
      branch TEXT,
      sem TEXT,
      enrollmentNo TEXT,
      gender TEXT,
      paymentId TEXT,
      orderId TEXT,
      paymentStatus TEXT,
      amount INTEGER,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

        // Create tables for each program type
        console.log('\n📋 Creating tables...');

        await client.query(`CREATE TABLE IF NOT EXISTS spardha ${tableSchema}`);
        console.log('✓ Created table: spardha');

        await client.query(`CREATE TABLE IF NOT EXISTS techfest ${tableSchema}`);
        console.log('✓ Created table: techfest');

        await client.query(`CREATE TABLE IF NOT EXISTS trividya ${tableSchema}`);
        console.log('✓ Created table: trividya');

        // Verify tables were created
        const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('\n✅ Database setup complete!');
        console.log('\n📊 Tables in database:');
        result.rows.forEach(row => {
            console.log(`  - ${row.table_name}`);
        });

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        console.error(error);
    } finally {
        await client.end();
        console.log('\n🔌 Connection closed.');
    }
}

setupDatabase();
