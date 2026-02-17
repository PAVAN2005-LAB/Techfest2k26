
// All sensitive data is hidden from client-side

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');

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

// Security Headers
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for external scripts (Razorpay, FontAwesome)
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resources
    crossOriginOpenerPolicy: false, // Allow cross-origin popups (Razorpay checkout)
}));

// Cross-Origin Resource Sharing
app.use(cors());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Rate Limiting (API endpoints only, not static files)
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 500 // limit each IP to 500 requests per windowMs
});
app.use('/api', limiter); // Only apply to API routes

// Initialize connections & settings (resilient - won't crash if DB is down)
let dbReady = false;

async function initDatabase() {
    try {
        const connected = await dbConfig.testConnection();
        if (!connected) {
            console.log('⚠️ Database not reachable. Will retry...');
            setTimeout(initDatabase, 10000); // Retry in 10 seconds
            return;
        }

        // Create settings table if not exists
        const pool = dbConfig.getPool();
        await pool.query(`
        CREATE TABLE IF NOT EXISTS site_settings (
            key VARCHAR(50) PRIMARY KEY,
            value VARCHAR(255) NOT NULL
        )
    `);
        // Insert default registration_open = true if not exists
        await pool.query(`
        INSERT INTO site_settings (key, value) 
        VALUES ('registration_open', 'true') 
        ON CONFLICT (key) DO NOTHING
    `);
        dbReady = true;
        console.log('✅ Site settings loaded');

        // Load events from database (for production - read-only filesystem)
        await EventService.initDB();
    } catch (error) {
        console.error('⚠️ Database init error:', error.message);
        console.log('🔄 Retrying database connection in 10 seconds...');
        setTimeout(initDatabase, 10000);
    }
}

// Start initialization (non-blocking)
initDatabase();

// Email verification (non-blocking)
EmailService.verify().catch(err => console.error('⚠️ Email verify error:', err.message));

// HEALTH CHECK (for UptimeRobot to keep alive)
// ============================================
app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: Math.floor(process.uptime()) + 's' });
});

// ============================================
// SECURE ENDPOINT: Get Razorpay PUBLIC key only
// ============================================
app.get('/api/config/razorpay', (req, res) => {
    console.log(' GET /api/config/razorpay - Request received');
    // Only send public key - secret stays on server
    res.json({
        key: PaymentService.getPublicKey()
    });
});
console.log(' Route registered: GET /api/config/razorpay');

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
// REGISTRATION STATUS (Database-backed toggle)
// ============================================

// Helper: get registration status from DB
async function getRegStatus() {
    const pool = dbConfig.getPool();
    const result = await pool.query("SELECT value FROM site_settings WHERE key = 'registration_open'");
    return result.rows[0]?.value === 'true';
}

// Helper: set registration status in DB
async function setRegStatus(isOpen) {
    const pool = dbConfig.getPool();
    await pool.query("UPDATE site_settings SET value = $1 WHERE key = 'registration_open'", [isOpen ? 'true' : 'false']);
}

// Public API - check if registration is open
app.get('/api/registration-status', async (req, res) => {
    try {
        const open = await getRegStatus();
        res.json({ open });
    } catch (err) {
        console.error('Status check error:', err);
        res.json({ open: true }); // Default to open on error
    }
});

// Admin API - toggle registration
app.post('/api/admin/toggle-registration', async (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    const user = auth[0];
    const pass = auth[1];

    if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
        const currentStatus = await getRegStatus();
        const newStatus = !currentStatus;
        await setRegStatus(newStatus);
        console.log(` Registration ${newStatus ? 'OPENED' : 'CLOSED'} by admin (saved to DB)`);
        res.json({ success: true, open: newStatus });
    } else {
        res.status(401).json({ error: 'Invalid Credentials' });
    }
});

// ============================================
// ENDPOINT: Create Razorpay Order (with dynamic pricing)
// ============================================
app.post('/create-order', async (req, res) => {
    // Block orders if registration is closed
    const regOpen = await getRegStatus();
    if (!regOpen) {
        return res.status(403).json({ error: 'Registration is currently closed.' });
    }

    try {
        const { programType, event } = req.body;

        // Get event price from configuration
        let amount = 1; // Default test amount

        if (programType && event) {
            const eventPrice = EventService.getEventPrice(programType, event);
            if (eventPrice) {
                amount = eventPrice;
                console.log(` Event: ${event} (${programType}) - Price: ₹${amount}`);
            } else {
                console.log(` Event not found in config, using default: ₹${amount}`);
            }
        } else {
            console.log(`  No event details provided, using test amount: ₹${amount}`);
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

        console.log(' Registration request received');

        // Step 1: Verify Payment Signature (SECURITY CRITICAL!)
        const isValidPayment = PaymentService.verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValidPayment) {
            console.error(' Payment verification failed');
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        console.log('Payment verified successfully');

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

        console.log(` Registration saved with ID: ${saveResult.id}`);

        // Step 5: Send confirmation email (asynchronous - don't block response)
        const emailData = registration.getEmailData();
        EmailService.sendConfirmationEmail(emailData)
            .then(result => {
                if (result.success) {
                    console.log(' Confirmation email sent');
                } else {
                    console.error(' Email failed:', result.error);
                }
            });

        // Step 6: Return success response
        res.json({
            success: true,
            message: "Registration successful! Confirmation email will be sent shortly."
        });

    } catch (error) {
        console.error(' Registration error:', error.message);
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
// New Endpoints for Contact & Check Registration
// ============================================

// 1. Contact Form Endpoint
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        // We use the EmailService transporter but construct a custom mail for Admin
        const transporter = require('./server/config/email.config').getTransporter();

        const mailOptions = {
            from: `"${name}" <${process.env.EMAIL_USER}>`, // Send via our authenticated email
            to: process.env.EMAIL_USER, // Send TO Admin (us)
            replyTo: email, // Reply to the user
            subject: `📩 New Inquiry from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <h3>New Contact Inquiry</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <hr>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Message sent successfully' });

    } catch (error) {
        console.error('Contact API Error:', error);
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
});

// 2. Check Registration Endpoint
const RegistrationService = require('./server/services/RegistrationService');

app.post('/api/check-registration', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }

        const registrations = await RegistrationService.searchRegistrations(query);

        res.json({ success: true, registrations });

    } catch (error) {
        console.error('Check Registration Error:', error);
    }
});

// 3. Admin Login (validates credentials WITHOUT database)
app.post('/api/admin/login', (req, res) => {
    if (verifyAdmin(req)) {
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid Credentials' });
    }
});

// 4. Admin Dashboard Endpoint (Basic Security)
app.get('/api/admin/registrations', async (req, res) => {
    if (!verifyAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        if (!dbReady) {
            // DB not connected yet - return empty but don't fail login
            return res.json({ success: true, registrations: [], dbStatus: 'connecting' });
        }

        const pool = dbConfig.getPool();
        const spardha = await pool.query(`SELECT id, firstName, lastName, email, phoneNumber, event, paymentStatus, 'spardha' as programtype FROM spardha`);
        const techfest = await pool.query(`SELECT id, firstName, lastName, email, phoneNumber, event, paymentStatus, 'techfest' as programtype FROM techfest`);
        const trividya = await pool.query(`SELECT id, firstName, lastName, email, phoneNumber, event, paymentStatus, 'trividya' as programtype FROM trividya`);

        const allRegistrations = [
            ...spardha.rows,
            ...techfest.rows,
            ...trividya.rows
        ];

        res.json({ success: true, registrations: allRegistrations });
    } catch (error) {
        console.error('Admin API Error:', error.message);
        // Return empty registrations instead of crashing the login
        res.json({ success: true, registrations: [], dbStatus: 'error', dbError: error.message });
    }
});

// ============================================
// Admin Auth Helper
// ============================================
function verifyAdmin(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return false;
    const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
    return auth[0] === process.env.ADMIN_USER && auth[1] === process.env.ADMIN_PASS;
}

// ============================================
// ADMIN: Get All Events (for Event Manager)
// ============================================
app.get('/api/admin/events', (req, res) => {
    if (!verifyAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    res.json({ success: true, events: EventService.getFullConfig() });
});

// ============================================
// ADMIN: Add New Event
// ============================================
app.post('/api/admin/events', (req, res) => {
    if (!verifyAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { program, eventName, price, teamSize, description } = req.body;

    if (!program || !eventName) {
        return res.status(400).json({ error: 'Program and event name are required' });
    }

    const result = EventService.addEvent(program, eventName, {
        price: parseInt(price) || 0,
        description: description || '',
        teamSize: teamSize || '1 participant'
    });

    if (result.success) {
        console.log(`✅ Event added: ${eventName} (${program})`);
        res.json({ success: true, message: 'Event added successfully' });
    } else {
        res.status(400).json({ error: result.error });
    }
});

// ============================================
// ADMIN: Update Event
// ============================================
app.put('/api/admin/events/:program/:eventName', (req, res) => {
    if (!verifyAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { program, eventName } = req.params;
    const { newName, price, teamSize, description } = req.body;

    const result = EventService.updateEvent(program, decodeURIComponent(eventName), {
        newName: newName || eventName,
        price: parseInt(price) || 0,
        description: description || '',
        teamSize: teamSize || '1 participant'
    });

    if (result.success) {
        console.log(`✅ Event updated: ${eventName} -> ${newName || eventName} (${program})`);
        res.json({ success: true, message: 'Event updated successfully' });
    } else {
        res.status(400).json({ error: result.error });
    }
});

// ============================================
// ADMIN: Delete Event
// ============================================
app.delete('/api/admin/events/:program/:eventName', (req, res) => {
    if (!verifyAdmin(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { program, eventName } = req.params;

    const result = EventService.deleteEvent(program, decodeURIComponent(eventName));

    if (result.success) {
        console.log(`🗑️ Event deleted: ${eventName} (${program})`);
        res.json({ success: true, message: 'Event deleted successfully' });
    } else {
        res.status(400).json({ error: result.error });
    }
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, () => {
    console.log('\n' + '='.repeat(50));
    console.log(' Secure Server Running');
    console.log('='.repeat(50));
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` ok to shine`);
    console.log(`  Database: PostgreSQL (Neon)`);
    console.log(` Payment: Razorpay (secure)`);
    console.log(`Email: Nodemailer (Gmail)`);
    console.log('='.repeat(50) + '\n');
});
