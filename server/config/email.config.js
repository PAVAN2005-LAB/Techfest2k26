// Email Configuration (Single Responsibility Principle)
require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailConfig {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    getTransporter() {
        return this.transporter;
    }

    // Verify email configuration
    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email service ready');
            return true;
        } catch (error) {
            console.error('❌ Email configuration error:', error.message);
            return false;
        }
    }
}

module.exports = new EmailConfig();
