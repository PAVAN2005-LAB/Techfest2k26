# 🎓 TechFest 2k26 - Event Registration System

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-blue.svg)](https://neon.tech/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A professional, secure event registration system with dynamic pricing, payment integration, and email notifications.

---

## 🌟 Features

- ✅ **Dynamic Event Pricing** - Manage event prices via JSON configuration
- 🔒 **Secure Payment Integration** - Razorpay payment gateway with verification
- 📧 **Automated Email Notifications** - HTML email templates for confirmations
- 🗄️ **PostgreSQL Database** - Cloud-hosted on Neon with ACID compliance
- 🛡️ **Security First** - OOP, SOLID, and security best practices
- 📱 **Responsive Design** - Mobile-friendly registration forms
- 🎯 **Multi-Program Support** - Spardha, TechFest, and Trividya events

---

## 📁 Project Structure

```
TechFest2k26/
├── server/
│   ├── config/              # Configuration files
│   │   ├── database.config.js
│   │   ├── email.config.js
│   │   ├── payment.config.js
│   │   └── events.config.json
│   ├── models/              # Data models
│   │   └── Registration.model.js
│   ├── services/            # Business logic
│   │   ├── EventService.js
│   │   ├── PaymentService.js
│   │   └── EmailService.js
│   ├── templates/           # Email templates
│   │   └── EmailTemplate.js
│   ├── controllers/         # Route controllers
│   ├── routes/             # API routes
│   └── middleware/         # Custom middleware
│
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side scripts
│   ├── pages/             # HTML pages
│   └── images/            # Static images
│
├── scripts/               # Utility scripts
│   ├── setup-database.js
│   ├── test-database.js
│   ├── test-email.js
│   └── psql-interactive.js
│
├── docs/                  # Documentation
│   ├── DYNAMIC_PRICING_GUIDE.md
│   ├── SECURITY_REFACTORING.md
│   ├── EMAIL_SETUP.md
│   └── POSTGRES_MIGRATION.md
│
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── server.js             # Main entry point
└── README.md             # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon account)
- Razorpay account
- Gmail account (for emails)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd TechFest2k26

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your credentials

# Setup database tables
npm run setup

# Start the server
npm start
```

The application will be running at `http://localhost:3000`

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
PORT=3000
DATABASE_URL=postgresql://user:pass@host/database?sslmode=require
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Event Pricing

Edit `server/config/events.config.json`:

```json
{
  "techfest": {
    "events": {
      "Hack-Accelerate": {
        "price": 600,
        "description": "Coding hackathon",
        "teamSize": "2-4 participants"
      }
    }
  }
}
```

---

## 📜 Available Scripts

```bash
npm start              # Start production server
npm run dev            # Start development server with auto-reload
npm run setup          # Setup database tables
npm run test:db        # Test database connection
npm run test:email     # Test email configuration
npm run db:query       # Interactive database query tool
```

---

## 🔐 Security Features

- **API Key Protection** - Razorpay keys fetched from server, not hardcoded
- **Payment Verification** - Server-side signature verification
- **SQL Injection Prevention** - Parameterized queries
- **Environment Variables** - Sensitive data in `.env` file
- **HTTPS Ready** - SSL/TLS support for production

---

## 📊 Database Schema

### Tables: `spardha`, `techfest`, `trividya`

```sql
CREATE TABLE techfest (
    id SERIAL PRIMARY KEY,
    firstName TEXT,
    lastName TEXT,
    email TEXT,
    phoneNumber TEXT,
    programType TEXT,
    event TEXT,
    collegeName TEXT,
    address TEXT,
    branch TEXT,
    sem TEXT,
    enrollmentNo TEXT,
    gender TEXT,
    paymentId TEXT,
    orderId TEXT,
    paymentStatus TEXT,
    amount INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔌 API Endpoints

### Public Endpoints

```
GET  /api/config/razorpay         # Get Razorpay public key
GET  /api/events/:programType     # Get events for a program
GET  /api/event/:program/:event   # Get specific event details
POST /create-order                # Create Razorpay order
POST /register                    # Submit registration
```

### Example Usage

```bash
# Get event details
curl http://localhost:3000/api/event/techfest/Hack-Accelerate

# Response
{
  "success": true,
  "event": {
    "price": 600,
    "description": "Coding hackathon",
    "teamSize": "2-4 participants"
  }
}
```

---

## 📧 Email System

Automated HTML emails are sent after successful registration with:
- All registration details
- Payment information
- Event details
- Program-specific branding

Configure email in `server/config/email.config.js`

---

## 🎨 Frontend Pages

- `/` - Home page
- `/reg.html` - Registration form
- `/gallery.html` - Event gallery
- `/gec_dahod_event.html` - Event listings

---

## 🧪 Testing

### Test Database Connection
```bash
npm run test:db
```

### Test Email Service
```bash
npm run test:email
```

### Interactive Database Queries
```bash
npm run db:query
```

---

## 📚 Documentation

- [Dynamic Pricing Guide](docs/DYNAMIC_PRICING_GUIDE.md)
- [Security Refactoring](docs/SECURITY_REFACTORING.md)
- [Email Setup](docs/EMAIL_SETUP.md)
- [Database Migration](docs/POSTGRES_MIGRATION.md)

---

## 🏗️ Architecture

- **OOP (Object-Oriented Programming)** - Classes for models and services
- **SOLID Principles** - Single responsibility, dependency injection
- **ACID Compliance** - Atomic database transactions
- **MVC Pattern** - Separation of concerns

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

**Government College of Engineering Dahod**  
TechFest 2k26 Organizing Committee

---

## 📞 Support

For issues and questions:
- Email: techfest@gecdahod.ac.in
- GitHub Issues: [Create an issue](your-repo/issues)

---

## 🙏 Acknowledgments

- Neon PostgreSQL for database hosting
- Razorpay for payment gateway
- All contributors and participants

---

**Made with ❤️ by GEC Dahod TechFest Team**
