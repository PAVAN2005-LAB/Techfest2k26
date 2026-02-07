// Payment Configuration (Single Responsibility Principle)
require('dotenv').config();
const Razorpay = require('razorpay');

class PaymentConfig {
    constructor() {
        // Private configuration - never exposed to client
        this.razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        this.testAmount = 10; // Test amount in INR
    }

    getRazorpayInstance() {
        return this.razorpay;
    }

    // Only public key is sent to client (safe to expose)
    getPublicKey() {
        return process.env.RAZORPAY_KEY_ID;
    }

    // Secret is never exposed
    getSecret() {
        return process.env.RAZORPAY_KEY_SECRET;
    }

    getTestAmount() {
        return this.testAmount;
    }
}

module.exports = new PaymentConfig();
