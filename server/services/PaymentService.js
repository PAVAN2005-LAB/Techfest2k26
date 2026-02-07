// Payment Service (Single Responsibility - handles payment logic only)
const crypto = require('crypto');
const paymentConfig = require('../config/payment.config');

class PaymentService {
    constructor() {
        this.razorpay = paymentConfig.getRazorpayInstance();
        this.secret = paymentConfig.getSecret();
    }

    // Create Razorpay order
    async createOrder(amount = null) {
        try {
            const orderAmount = amount || paymentConfig.getTestAmount();

            const options = {
                amount: orderAmount * 100, // Convert to paise
                currency: "INR",
                receipt: "receipt#" + Date.now(),
            };

            console.log("Creating Razorpay order:", JSON.stringify(options));

            const order = await this.razorpay.orders.create(options);
            console.log("Order created successfully:", order.id);

            return { success: true, order };
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Verify payment signature (Security critical!)
    verifyPaymentSignature(orderId, paymentId, signature) {
        try {
            const generated_signature = crypto
                .createHmac('sha256', this.secret)
                .update(orderId + "|" + paymentId)
                .digest('hex');

            return generated_signature === signature;
        } catch (error) {
            console.error("Signature verification error:", error);
            return false;
        }
    }

    // Get public key for client-side (safe to expose)
    getPublicKey() {
        return paymentConfig.getPublicKey();
    }
}

module.exports = new PaymentService();
