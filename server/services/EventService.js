// Event Service - Manages event data and pricing
const fs = require('fs');
const path = require('path');

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
            return null; // Event not found
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
            // Check new name doesn't conflict
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

    // Save configuration to file
    _saveConfig() {
        try {
            fs.writeFileSync(this.configPath, JSON.stringify(this.eventsConfig, null, 4), 'utf-8');
            console.log('✅ Events configuration saved to disk');
            return { success: true };
        } catch (error) {
            console.error('❌ Error saving config:', error.message);
            return { success: false, error: 'Failed to save configuration' };
        }
    }

    // Reload configuration (in case file is updated externally)
    reloadConfig() {
        this.eventsConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
        console.log('✅ Events configuration reloaded');
    }
}

module.exports = new EventService();
