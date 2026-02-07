// Secure Server with OOP, SOLID, and ACID Principles
// All sensitive data is hidden from client-side

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Import services and configs (Dependency Injection)
const dbConfig = require('./server/config/database.config');
const PaymentService = require('./server/services/PaymentService');
const EmailService = require('./server/services/EmailService');
const EventService = require('./server/services/EventService');
const Registration = require('./server/models/Registration.model');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize connections
(async () => {
    await dbConfig.testConnection();
    await EmailService.verify();
})();

// ============================================
// SECURE ENDPOINT: Get Razorpay PUBLIC key only
// ============================================
app.get('/api/config/razorpay', (req, res) => {
    console.log('📍 GET /api/config/razorpay - Request received');
    // Only send public key - secret stays on server
    res.json({
        key: PaymentService.getPublicKey()
    });
});
console.log('✅ Route registered: GET /api/config/razorpay');

// ============================================
// API: Get all events for a program
// ============================================
app.get('/api/events/:programType', (req, res) => {
    const { programType } = req.params;
    const events = EventService.getProgramEvents(programType);

    if (events) {
        res.json({ success: true, events });
    } else {
        res.status(404).json({ success: false, message: 'Program not found' });
    }
});

// ============================================
// API: Get specific event details
// ============================================
app.get('/api/event/:programType/:eventName', (req, res) => {
    const { programType, eventName } = req.params;
    const eventDetails = EventService.getEventDetails(programType, eventName);

    if (eventDetails) {
        res.json({ success: true, event: eventDetails });
    } else {
        res.status(404).json({ success: false, message: 'Event not found' });
    }
});

// ============================================
// ENDPOINT: Create Razorpay Order (with dynamic pricing)
// ============================================
app.post('/create-order', async (req, res) => {
    try {
        const { programType, event } = req.body;

        // Get event price from configuration
        let amount = 1; // Default test amount

        if (programType && event) {
            const eventPrice = EventService.getEventPrice(programType, event);
            if (eventPrice) {
                amount = eventPrice;
                console.log(`💰 Event: ${event} (${programType}) - Price: ₹${amount}`);
            } else {
                console.log(`⚠️  Event not found in config, using default: ₹${amount}`);
            }
        } else {
            console.log(`⚠️  No event details provided, using test amount: ₹${amount}`);
        }

        const result = await PaymentService.createOrder(amount);

        if (result.success) {
            // Send order with amount info
            res.json({
                ...result.order,
                eventAmount: amount // Include original amount for client
            });
        } else {
            res.status(500).json({
                error: "Error creating order",
                details: result.error
            });
        }
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({
            error: "Server error",
            details: error.message
        });
    }
});

// ============================================
// ENDPOINT: Registration (with payment verification)
// ============================================
app.post('/register', async (req, res) => {
    try {
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature
        } = req.body;

        console.log('📝 Registration request received');

        // Step 1: Verify Payment Signature (SECURITY CRITICAL!)
        const isValidPayment = PaymentService.verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValidPayment) {
            console.error('❌ Payment verification failed');
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        console.log('✅ Payment verified successfully');

        // Step 2: Create Registration instance (OOP)
        const registration = new Registration(req.body);

        // Step 3: Validate data
        const validation = registration.validate();
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        // Step 4: Save to database (ACID - Atomicity, Consistency, Isolation, Durability)
        const saveResult = await registration.save();

        if (!saveResult.success) {
            throw new Error('Failed to save registration');
        }

        console.log(`✅ Registration saved with ID: ${saveResult.id}`);

        // Step 5: Send confirmation email (asynchronous - don't block response)
        const emailData = registration.getEmailData();
        EmailService.sendConfirmationEmail(emailData)
            .then(result => {
                if (result.success) {
                    console.log('✅ Confirmation email sent');
                } else {
                    console.error('❌ Email failed:', result.error);
                }
            });

        // Step 6: Return success response
        res.json({
            success: true,
            message: "Registration successful! Confirmation email will be sent shortly."
        });

    } catch (error) {
        console.error('❌ Registration error:', error.message);
        res.status(500).json({
            success: false,
            message: "Server error: " + error.message
        });
    }
});

// ============================================
// Static File Serving (After API routes!)
// ============================================
// Serve CSS and images
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Serve HTML pages at /pages path
app.use('/pages', express.static(path.join(__dirname, 'public/pages')));

// AI AGENT FIX: Serve pages at root level too so /index.html works!
app.use(express.static(path.join(__dirname, 'public/pages')));

// Fallback: serve other static files from public root
app.use(express.static(path.join(__dirname, 'public')));

// Root route - explicitly serve reg.html (or index.html as preferred)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/pages/index.html'));
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log('🚀 Secure Server Running');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🔒 Security: OOP + SOLID + ACID principles`);
    console.log(`🗄️  Database: PostgreSQL (Neon)`);
    console.log(`💳 Payment: Razorpay (secure)`);
    console.log(`📧 Email: Nodemailer (Gmail)`);
    console.log('='.repeat(50) + '\n');
});
