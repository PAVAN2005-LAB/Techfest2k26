const dbConfig = require('../config/database.config');

class RegistrationService {
    async searchRegistrations(searchTerm) {
        if (!searchTerm) return [];

        console.log(`Searching for: ${searchTerm}`);
        const pool = dbConfig.getPool();
        const tables = ['spardha', 'techfest', 'trividya'];
        let results = [];

        // Using lowercase column names because Postgres defaults to lowercase
        // Using ILIKE for case-insensitive email matching logic if needed, but keeping simple OR for now
        // We select 'programtype' specifically as that's how it appears in DB
        const sqlTemplate = (table) => `
            SELECT event, programtype, orderid, paymentstatus, timestamp
            FROM ${table} 
            WHERE email = $1 OR orderid = $1
        `;

        for (const table of tables) {
            try {
                const { rows } = await pool.query(sqlTemplate(table), [searchTerm]);

                rows.forEach(row => {
                    results.push({
                        event: row.event,
                        programType: row.programtype || table,
                        orderId: row.orderid,
                        status: row.paymentstatus,
                        date: row.timestamp
                    });
                });
            } catch (err) {
                console.error(`Error querying ${table}:`, err.message);
                // Don't throw, just continue to next table
            }
        }

        return results;
    }
}

module.exports = new RegistrationService();
