# 🚀 TechFest 2k26 - Event Registration System

A robust, secure, and dynamic event registration platform for GEC Dahod's TechFest 2k26. Built with Node.js, Express, PostgreSQL, and Razorpay.

live link: https://techfest2k26.onrender.com
---

## ✨ Key Features

### 🛒 Dynamic Registration & Pricing
- **Automated Pricing:** Prices are fetched dynamically from `server/config/events.config.json`. No code changes required to update fees!
- **Event Validation:** Ensures users select valid programs and events.
- **Secure Payments:** Integrated with Razorpay for safe transaction processing.

### 📧 Automated Communications
- **Instant Email Confirmation:** Participants receive immediate confirmation emails with registration details.
- **Custom Templates:** Program-specific branding (Spardha, TechFest, Trividya).

### 🎨 Rich User Experience
- **Responsive Design:** Optimized for mobile and desktop.
- **Event Detail Pages:** 16+ dedicated pages for each event (Net Cricket, Cosmo Clench, etc.) with full descriptions and direct registration links.
- **Gallery:** Photo showcase of previous events (powered by `public/images/gallery`).

### 🔒 Security Framework
- **Secure Backend:** Refactored structure following OOP and SOLID principles.
- **Database:** Cloud-hosted PostgreSQL (Neon) for reliability.
- **Environment Protection:** Sensitive keys managed via `.env`.

---

## 📂 Project Structure

```
TechFest2k26/
├── server.js               # Main Server Entry Point
├── .env                    # Environment Variables (Not committed)
│
├── server/                 # Backend Architecture
│   ├── config/             # Configuration (DB, Email, Events JSON)
│   ├── models/             # Database Models (Registration.model.js)
│   ├── services/           # Business Logic (Payment, Email, EventService)
│   └── templates/          # HTML Email Templates
│
├── public/                 # Frontend Assets
│   ├── css/                # Stylesheets (Navbar, Hero, Event Details)
│   ├── images/             # ALL Assets (Moved from root)
│   │   ├── event-logos/    # specific event images
│   │   └── ...             # Gallery and UI images
│   └── pages/              # HTML Views
│       ├── tech_fest_events/ # 📁 16 Individual Event Detail Pages
│       ├── reg.html          # Registration Form
│       ├── gallery.html      # Photo Gallery
│       └── index.html        # Landing Page
│
├── scripts/                # Utility Scripts (DB Setup, Testing)
└── docs/                   # Documentation Resources
```

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/PAVAN2005-LAB/Techfest2k26.git
cd Techfest2k26
npm install
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
DATABASE_URL=postgres://user:password@hostname/dbname
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Run the Application
```bash
# Start Server
npm start

# Development Mode (Auto-restart)
npm run dev
```

---

## 🔮 Future Roadmap (Planned Features)

- [ ] **Admin Dashboard:** View real-time registrations and payment stats.
- [ ] **QR Code Ticketing:** Generate QR codes for event entry validation.
- [ ] **Team Registration:** Allow registering multiple participants at once.
- [ ] **User Accounts:** Student login portal to manage registrations.
- [ ] **Live Leaderboard:** Real-time score updates for gaming events.

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon Cloud)
- **Payment:** Razorpay API
- **Email:** Nodemailer (Gmail SMTP)
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)

---

## 📞 Support & Documentation

For detailed guides, check the `docs/` folder:
- `docs/QUICKSTART.md` - Setup guide
- `docs/DYNAMIC_PRICING_GUIDE.md` - How to update prices
- `docs/SECURITY_REFACTORING.md` - Security details
