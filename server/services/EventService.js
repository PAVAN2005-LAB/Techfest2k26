// Event Service - Manages event data and pricing
// Uses JSON file for defaults + PostgreSQL for CRUD persistence (works on read-only filesystems like Vercel/Render)
const fs = require('fs');
const path = require('path');
const dbConfig = require('../config/database.config');

class EventService {
    constructor() {
        this.configPath = path.join(__dirname, '../config/events.config.json');
        console.log('📂 EventService loading config from:', this.configPath);
        try {
            const fileContent = fs.readFileSync(this.configPath, 'utf-8');
            this.eventsConfig = JSON.parse(fileContent);
            console.log('✅ Events Configuration Loaded Successfully');
        } catch (error) {
            console.error('❌ Error loading config:', error.message);
            this.eventsConfig = {};
        }
        this.dbReady = false;
    }

    // Initialize DB table and load overrides from database
    async initDB() {
        try {
            const pool = dbConfig.getPool();

            // Create events_config table if not exists
            await pool.query(`
                CREATE TABLE IF NOT EXISTS events_config (
                    id SERIAL PRIMARY KEY,
                    config JSONB NOT NULL,
                    updated_at TIMESTAMP DEFAULT NOW()
                )
            `);

            // Check if DB has saved config
            const result = await pool.query('SELECT config FROM events_config ORDER BY id DESC LIMIT 1');
            if (result.rows.length > 0) {
                // DB config exists — use it (it has the latest admin changes)
                this.eventsConfig = result.rows[0].config;
                console.log('✅ Events loaded from database (latest admin changes)');
            } else {
                // No DB config yet — seed from JSON file
                await pool.query('INSERT INTO events_config (config) VALUES ($1)', [JSON.stringify(this.eventsConfig)]);
                console.log('✅ Events seeded to database from JSON file');
            }

            this.dbReady = true;
        } catch (error) {
            console.error('⚠️ EventService DB init error:', error.message);
            console.log('📂 Using JSON file config as fallback');
        }
    }

    // Get all programs
    getAllPrograms() {
        return Object.keys(this.eventsConfig);
    }

    // Get program details
    getProgramDetails(programType) {
        const program = this.eventsConfig[programType];
        if (!program) {
            return null;
        }
        return {
            displayName: program.displayName,
            teamName: program.teamName,
            events: Object.keys(program.events)
        };
    }

    // Get event price by program and event name
    getEventPrice(programType, eventName) {
        const program = this.eventsConfig[programType];
        if (!program || !program.events[eventName]) {
            return null;
        }
        return program.events[eventName].price;
    }

    // Get event details
    getEventDetails(programType, eventName) {
        const program = this.eventsConfig[programType];
        if (!program || !program.events[eventName]) {
            return null;
        }
        return {
            ...program.events[eventName],
            programType,
            programDisplay: program.displayName,
            teamName: program.teamName
        };
    }

    // Get all events for a program
    getProgramEvents(programType) {
        const program = this.eventsConfig[programType];
        if (!program) {
            return null;
        }
        return program.events;
    }

    // Check if event exists
    eventExists(programType, eventName) {
        const program = this.eventsConfig[programType];
        return program && program.events[eventName] !== undefined;
    }

    // Get all events (for admin/stats)
    getAllEvents() {
        const allEvents = [];
        for (const [programType, program] of Object.entries(this.eventsConfig)) {
            for (const [eventName, eventData] of Object.entries(program.events)) {
                allEvents.push({
                    programType,
                    programDisplay: program.displayName,
                    eventName,
                    ...eventData
                });
            }
        }
        return allEvents;
    }

    // Get full config (for admin panel)
    getFullConfig() {
        return this.eventsConfig;
    }

    // ============================
    // CRUD OPERATIONS
    // ============================

    // Add a new event
    addEvent(programType, eventName, eventData) {
        if (!this.eventsConfig[programType]) {
            return { success: false, error: 'Program not found' };
        }
        if (this.eventsConfig[programType].events[eventName]) {
            return { success: false, error: 'Event already exists' };
        }

        this.eventsConfig[programType].events[eventName] = {
            price: eventData.price || 0,
            description: eventData.description || '',
            teamSize: eventData.teamSize || '1 participant'
        };

        return this._saveConfig();
    }

    // Update an existing event
    updateEvent(programType, eventName, newData) {
        if (!this.eventsConfig[programType]) {
            return { success: false, error: 'Program not found' };
        }
        if (!this.eventsConfig[programType].events[eventName]) {
            return { success: false, error: 'Event not found' };
        }

        // If name changed, delete old and create new
        var newName = newData.newName || eventName;
        if (newName !== eventName) {
            if (this.eventsConfig[programType].events[newName]) {
                return { success: false, error: 'An event with that name already exists' };
            }
            delete this.eventsConfig[programType].events[eventName];
        }

        this.eventsConfig[programType].events[newName] = {
            price: newData.price !== undefined ? newData.price : 0,
            description: newData.description || '',
            teamSize: newData.teamSize || '1 participant'
        };

        return this._saveConfig();
    }

    // Delete an event
    deleteEvent(programType, eventName) {
        if (!this.eventsConfig[programType]) {
            return { success: false, error: 'Program not found' };
        }
        if (!this.eventsConfig[programType].events[eventName]) {
            return { success: false, error: 'Event not found' };
        }

        delete this.eventsConfig[programType].events[eventName];
        return this._saveConfig();
    }

    // Save configuration — writes to DB (production) + JSON file (local fallback)
    _saveConfig() {
        // Always try to save to database first (works on Vercel/Render)
        if (this.dbReady) {
            try {
                const pool = dbConfig.getPool();
                pool.query(
                    'UPDATE events_config SET config = $1, updated_at = NOW() WHERE id = (SELECT id FROM events_config ORDER BY id DESC LIMIT 1)',
                    [JSON.stringify(this.eventsConfig)]
                ).then(() => {
                    console.log('✅ Events configuration saved to database');
                }).catch(err => {
                    console.error('❌ Error saving to database:', err.message);
                });
                return { success: true };
            } catch (error) {
                console.error('❌ DB save error:', error.message);
            }
        }

        // Fallback: try writing to JSON file (works locally, fails on read-only filesystems)
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.eventsConfig, null, 4), 'utf-8');
            console.log('✅ Events configuration saved to disk');
            return { success: true };
        } catch (error) {
            console.error('⚠️ Cannot write to file (read-only filesystem). In-memory update applied.');
            // Even if file write fails, the in-memory config is already updated
            // This means changes work for the current server session
            return { success: true };
        }
    }

    // Reload configuration
    reloadConfig() {
        try {
            this.eventsConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
            console.log('✅ Events configuration reloaded from file');
        } catch (error) {
            console.log('⚠️ Could not reload from file, keeping current config');
        }
    }
}

module.exports = new EventService();
