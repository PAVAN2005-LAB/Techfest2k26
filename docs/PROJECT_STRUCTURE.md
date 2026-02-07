# 📂 Project Structure Guide

## Directory Organization

```
TechFest2k26/
│
├── 📁 server/                    Backend code (Node.js/Express)
│   ├── config/                   Configuration files
│   │   ├── database.config.js    PostgreSQL connection
│   │   ├── email.config.js       Email SMTP configuration
│   │   ├── payment.config.js     Razorpay configuration
│   │   └── events.config.json    Event pricing (editable)
│   │
│   ├── models/                   Data models (OOP)
│   │   └── Registration.model.js Registration entity
│   │
│   ├── services/                 Business logic (SOLID)
│   │   ├── EventService.js       Event management
│   │   ├── PaymentService.js     Payment processing
│   │   └── EmailService.js       Email operations
│   │
│   ├── templates/                Email templates
│   │   └── EmailTemplate.js      HTML email generator
│   │
│   ├── controllers/              Route controllers (optional)
│   ├── routes/                   API routes (optional)
│   └── middleware/               Custom middleware (optional)
│
├── 📁 public/                    Frontend static files
│   ├── css/                      Stylesheets
│   │   ├── index.css
│   │   ├── reg.css
│   │   ├── navbar.css
│   │   ├── footer.css
│   │   └── ...
│   │
│   ├── js/                       Client-side JavaScript
│   │   └── (your scripts)
│   │
│   ├── pages/                    HTML pages
│   │   ├── index.html            Home page
│   │   ├── reg.html              Registration form
│   │   ├── gallery.html          Gallery
│   │   └── ...
│   │
│   └── images/                   Static images
│       ├── logos/
│       ├── events/
│       └── ...
│
├── 📁 scripts/                   Utility scripts
│   ├── setup-database.js         Database initialization
│   ├── test-database.js          Database connection test
│   ├── test-email.js             Email service test
│   └── psql-interactive.js       Interactive query tool
│
├── 📁 docs/                      Documentation
│   ├── README.md                 Main documentation (root)
│   ├── DYNAMIC_PRICING_GUIDE.md  Pricing management
│   ├── SECURITY_REFACTORING.md   Security features
│   ├── EMAIL_SETUP.md            Email configuration
│   └── POSTGRES_MIGRATION.md     Database setup
│
├── 📄 server.js                  Main entry point
├── 📄 package.json               Dependencies & scripts
├── 📄 .env                       Environment variables (secret)
├── 📄 .env.example               Environment template
├── 📄 .gitignore                 Git ignore rules
└── 📄 README.md                  Project overview
```

---

## File Purposes

### Server Files

| File | Purpose |
|------|---------|
| `server.js` | Main application entry point |
| `server/config/*.js` | Configuration (database, email, payment) |
| `server/models/*.js` | Data models and validation |
| `server/services/*.js` | Business logic services |
| `server/templates/*.js` | Email HTML templates |

### Public Files

| Directory | Purpose |
|-----------|---------|
| `public/css/` | Stylesheets for all pages |
| `public/js/` | Client-side JavaScript |
| `public/pages/` | HTML pages served to users |
| `public/images/` | Static images and assets |

### Scripts

| Script | Purpose |
|--------|---------|
| `setup-database.js` | Creates database tables |
| `test-database.js` | Tests database connection |
| `test-email.js` | Tests email service |
| `psql-interactive.js` | Interactive database queries |

### Documentation

| Document | Content |
|----------|---------|
| `README.md` | Project overview and quick start |
| `DYNAMIC_PRICING_GUIDE.md` | How to manage event prices |
| `SECURITY_REFACTORING.md` | Security features explained |
| `EMAIL_SETUP.md` | Email configuration guide |

---

## Design Principles

### 1. Separation of Concerns
- **Server** = Backend logic
- **Public** = Frontend files
- **Scripts** = Utilities
- **Docs** = Documentation

### 2. Single Responsibility
Each file/folder has ONE clear purpose:
- `config/` = Configuration only
- `services/` = Business logic only
- `models/` = Data structures only

### 3. Scalability
Easy to:
- Add new services
- Add new routes
- Add new pages
- Add new events

---

## Quick Navigation

### To Change Event Prices:
```
📁 server/config/events.config.json
```

### To View Email Template:
```
📁 server/templates/EmailTemplate.js
```

### To Add New Page:
```
📁 public/pages/your-page.html
📁 public/css/your-page.css
```

### To Test Database:
```
📁 scripts/test-database.js
```

---

## Benefits of This Structure

✅ **Professional** - Industry-standard organization  
✅ **Maintainable** - Easy to find and update code  
✅ **Scalable** - Simple to add new features  
✅ **Secure** - Sensitive code separated from public  
✅ **Documented** - Clear purpose for each directory  
✅ **Testable** - Utilities separated for easy testing  

---

## Next Steps

1. **Development**: All new features go in appropriate folders
2. **Deployment**: Deploy `server.js` with environment variables
3. **Maintenance**: Update configs as needed (no code changes!)
4. **Documentation**: Update docs when adding features

---

**Your codebase is now professionally organized!** 🎯
