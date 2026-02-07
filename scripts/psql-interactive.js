require('dotenv').config();
const { Client } = require('pg');
const readline = require('readline');

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'postgres> '
});

async function executeQuery(query) {
    try {
        const result = await client.query(query);

        if (result.command === 'SELECT' && result.rows.length > 0) {
            console.log('\n📊 Results:');
            console.table(result.rows);
            console.log(`\n✓ ${result.rowCount} row(s) returned\n`);
        } else if (result.command === 'INSERT') {
            console.log(`\n✓ INSERT successful - ${result.rowCount} row(s) inserted\n`);
        } else if (result.command === 'UPDATE') {
            console.log(`\n✓ UPDATE successful - ${result.rowCount} row(s) updated\n`);
        } else if (result.command === 'DELETE') {
            console.log(`\n✓ DELETE successful - ${result.rowCount} row(s) deleted\n`);
        } else {
            console.log('\n✓ Query executed successfully');
            if (result.rowCount !== undefined) {
                console.log(`  Rows affected: ${result.rowCount}\n`);
            } else {
                console.log();
            }
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message, '\n');
    }
}

async function main() {
    try {
        await client.connect();
        console.log('✅ Connected to Neon PostgreSQL database');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('  Interactive PostgreSQL Query Tool');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('');
        console.log('📝 Common commands:');
        console.log('  .tables        - List all tables');
        console.log('  .count <table> - Count rows in a table');
        console.log('  .schema <table>- Show table schema');
        console.log('  .quit or .exit - Exit the tool');
        console.log('');
        console.log('💡 Or enter any SQL query directly');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        rl.prompt();

        rl.on('line', async (line) => {
            const input = line.trim();

            if (!input) {
                rl.prompt();
                return;
            }

            // Handle special commands
            if (input === '.quit' || input === '.exit') {
                console.log('\n👋 Goodbye!\n');
                await client.end();
                process.exit(0);
            } else if (input === '.tables') {
                await executeQuery(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name;
        `);
            } else if (input.startsWith('.count ')) {
                const tableName = input.substring(7).trim();
                await executeQuery(`SELECT COUNT(*) as count FROM ${tableName};`);
            } else if (input.startsWith('.schema ')) {
                const tableName = input.substring(8).trim();
                await executeQuery(`
          SELECT column_name, data_type, character_maximum_length, is_nullable
          FROM information_schema.columns
          WHERE table_name = '${tableName}'
          ORDER BY ordinal_position;
        `);
            } else {
                // Execute the query directly
                await executeQuery(input);
            }

            rl.prompt();
        });

        rl.on('close', async () => {
            console.log('\n👋 Goodbye!\n');
            await client.end();
            process.exit(0);
        });

    } catch (error) {
        console.error('❌ Error connecting to database:', error.message);
        process.exit(1);
    }
}

main();
