// Event Service - Manages event data and pricing
const fs = require('fs');
const path = require('path');

class EventService {
    constructor() {
        // Load events configuration
        const configPath = path.join(__dirname, '../config/events.config.json');
        console.log('📂 EventService loading config from:', configPath);
        try {
            const fileContent = fs.readFileSync(configPath, 'utf-8');
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

    // Reload configuration (in case file is updated)
    reloadConfig() {
        const configPath = path.join(__dirname, '../config/events.config.json');
        this.eventsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        console.log('✅ Events configuration reloaded');
    }
}

module.exports = new EventService();
