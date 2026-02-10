// Registration Model (OOP with SOLID principles)
const dbConfig = require('../config/database.config');

class Registration {
    constructor(data) {
        this.firstName = data.fullName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.phoneNumber = data.phoneNumber;
        this.programType = data.programType;
        this.event = data.event;
        this.collegeName = data.CollegeName;
        this.address = data.address;
        this.branch = data.branch;
        this.sem = data.sem;
        this.enrollmentNo = data.enrollmentNo;
        this.gender = data.gender;
        this.paymentId = data.razorpay_payment_id;
        this.orderId = data.razorpay_order_id;
        this.paymentStatus = 'SUCCESS';
        this.amount = data.amount || 10;
    }

    // Determine table name based on program type
    getTableName() {
        const tableMap = {
            'spardha': 'spardha',
            'techfest': 'techfest',
            'trividya': 'trividya'
        };
        return tableMap[this.programType] || null;
    }

    // Get program display name
    getProgramDisplay() {
        const displayMap = {
            'spardha': 'Spardha 2k26',
            'techfest': 'TechFest 2k26',
            'trividya': 'Trividya 2k26'
        };
        return displayMap[this.programType] || '';
    }

    // Get team name
    getTeamName() {
        const teamMap = {
            'spardha': 'Spardha Team',
            'techfest': 'TechFest Team',
            'trividya': 'Trividya Team'
        };
        return teamMap[this.programType] || '';
    }

    // Validate registration data
    validate() {
        if (!this.firstName || !this.email || !this.phoneNumber) {
            return { valid: false, message: 'Missing required fields' };
        }
        if (!this.getTableName()) {
            return { valid: false, message: 'Invalid program type' };
        }
        return { valid: true };
    }

    // Check for duplicate registration
    async checkDuplicate() {
        const tableName = this.getTableName();
        const pool = dbConfig.getPool();
        const sql = `SELECT id FROM ${tableName} WHERE email = $1 AND event = $2`;
        const result = await pool.query(sql, [this.email, this.event]);
        return result.rowCount > 0;
    }

    // Save to database (ACID principles - Atomicity)
    async save() {
        const validation = this.validate();
        if (!validation.valid) {
            throw new Error(validation.message);
        }

        if (await this.checkDuplicate()) {
            throw new Error('You are already registered for this event with this email.');
        }

        const tableName = this.getTableName();
        const pool = dbConfig.getPool();

        const sql = `
            INSERT INTO ${tableName} 
            (firstName, lastName, email, phoneNumber, programType, event, 
             collegeName, address, branch, sem, enrollmentNo, gender, 
             paymentId, orderId, paymentStatus, amount) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
            RETURNING id
        `;

        const params = [
            this.firstName, this.lastName, this.email, this.phoneNumber,
            this.programType, this.event, this.collegeName, this.address,
            this.branch, this.sem, this.enrollmentNo, this.gender,
            this.paymentId, this.orderId, this.paymentStatus, this.amount
        ];

        try {
            const result = await pool.query(sql, params);
            return { success: true, id: result.rows[0].id };
        } catch (error) {
            console.error('Database error:', error.message);
            throw new Error('Failed to save registration: ' + error.message);
        }
    }

    // Get data for email template
    getEmailData() {
        return {
            fullName: this.firstName,
            lastName: this.lastName,
            gender: this.gender,
            email: this.email,
            phoneNumber: this.phoneNumber,
            CollegeName: this.collegeName,
            address: this.address,
            branch: this.branch,
            sem: this.sem,
            enrollmentNo: this.enrollmentNo,
            programDisplay: this.getProgramDisplay(),
            event: this.event,
            teamName: this.getTeamName(),
            razorpay_payment_id: this.paymentId,
            razorpay_order_id: this.orderId,
            amountPaid: this.amount
        };
    }
}

module.exports = Registration;
