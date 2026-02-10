require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testQuery() {
    const email = '230180107070@gecdahod.ac.in';
    const tables = ['spardha', 'techfest', 'trividya'];

    console.log(`Searching for email: ${email}`);

    for (const table of tables) {
        console.log(`\n--- Checking table: ${table} ---`);
        try {
            // Check column names first
            const schemaRes = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = '${table}'
            `);
            console.log('Columns:', schemaRes.rows.map(r => r.column_name).join(', '));

            // Try simple select *
            const res = await pool.query(`SELECT * FROM ${table} WHERE email = $1`, [email]);
            console.log(`Found ${res.rowCount} rows.`);
            if (res.rowCount > 0) {
                console.log('Row data keys:', Object.keys(res.rows[0]));
                console.log('Row data:', res.rows[0]);
            }

        } catch (err) {
            console.error(`Error with table ${table}:`, err.message);
        }
    }
    pool.end();
}

testQuery();
