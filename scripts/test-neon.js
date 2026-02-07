const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_Gw56VsXUQIvM@ep-old-shadow-aiszybm0-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        await client.connect();
        console.log('✅ Connected to Neon PostgreSQL database successfully!');

        // List all tables
        const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log('\n📋 Tables in database:');
        if (tablesResult.rows.length === 0) {
            console.log('  No tables found.');
        } else {
            tablesResult.rows.forEach(row => {
                console.log(`  - ${row.table_name}`);
            });
        }

        // Get database version
        const versionResult = await client.query('SELECT version();');
        console.log('\n📊 Database version:');
        console.log(`  ${versionResult.rows[0].version}`);

    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
    } finally {
        await client.end();
        console.log('\n🔌 Connection closed.');
    }
}

testConnection();
