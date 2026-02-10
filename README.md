# 🚀 TechFest 2k26 - Event Registration System

A robust, secure, and dynamic event registration platform for GEC Dahod's TechFest 2k26. Built with Node.js, Express, PostgreSQL, and Razorpay.

**Live Link:** [https://techfest2k26.onrender.com](https://techfest2k26.onrender.com)

---

## ✨ Key Features

### �️ Professional Admin Dashboard
- **Registration Management:** View and filter all registrations (Spardha, TechFest, Trividya).
- **Registration Toggle:** Instantly stop or start new registrations site-wide via the dashboard.
- **Persistent Settings:** Registration status is saved to the database, surviving server restarts.
- **Analytics:** Real-time stats for total and category-specific registrations.

### 🛒 Dynamic Registration & Pricing
- **Automated Pricing:** Prices are fetched dynamically from `server/config/events.config.json`.
- **Secure Payments:** Integrated with Razorpay for safe transaction processing.
- **Status Verification:** Users can check their registration status anytime using email or Order ID.

### 📧 Automated Communications
- **Instant Email Confirmation:** Automatic confirmation emails with full event details.
- **Dynamic Templates:** Program-specific branding for Spardha, TechFest, and Trividya.

### 📱 Modern & Professional UX
- **PWA Support:** Installable as an app on Android/iOS with offline access support.
- **Optimized Performance:** Animated WebP backgrounds (75% smaller than GIFs) for lightning-fast 5G/4G loading.
- **Responsive Design:** 100% mobile-first UI with a floating "Back to Top" button and slide-in sidebar.
- **Countdown Timer:** Live glassmorphism countdown to the event start.

### 🔒 Security & Performance
- **Secure Backend:** Implements OOP, SOLID, and ACID principles.
- **Rate Limiting:** Protects API endpoints from brute-force and abuse.
- **Environment Protection:** Strict separation of config and secrets using `.env`.

---

## 📂 Project Structure

```
TechFest2k26/
├── server.js               # Main Server (Express + Security Middleware)
├── .env                    # Environment Variables (Secrets)
│
├── server/                 # Backend Architecture
│   ├── config/             # DB, Email, Events, Payment Configs
│   ├── models/             # Database Models (Registration, SiteSettings)
│   ├── services/           # Business Logic (Payment, Email, EventService)
│   └── templates/          # Responsive HTML Email Templates
│
├── public/                 # Frontend Assets
│   ├── css/                # Optimized CSS (Admin, Navbar, PWA styles)
│   ├── js/                 # Client-side Logic (Admin, Reg, Countdown, PWA)
│   ├── images/             # Optimized Assets (Animated WebP, Logos)
│   ├── pages/              # HTML Views (Admin, Contact, Gallery, Events)
│   ├── sw.js               # Service Worker (PWA Offline Support)
│   └── manifest.json       # PWA Manifest
│
├── scripts/                # Support Scripts (Background compression, DB debug)
└── docs/                   # Full System Documentation
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
Create a `.env` file in the root directory using `.env.example`:
```env
PORT=3000
DATABASE_URL=postgres://...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
ADMIN_USER=admin@gecdahod.ac.in
ADMIN_PASS=your_secure_password
```

### 3. Run the Application
```bash
# Start Server
npm start

# Development Mode
npm run dev
```

---

## �️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (Neon Cloud)
- **Payment:** Razorpay API
- **Email:** Nodemailer (Gmail SMTP)
- **Aesthetic:** Vanilla CSS (Glassmorphism, High-Performance Refined UI)
- **Features:** PWA (Service Workers), Sharp (Asset Optimization), Helmet (Security)

---

## 🔮 Future Roadmap

- [ ] **QR Code Ticketing:** Automatic QR generation for check-in at the venue.
- [ ] **Team Registration:** Support for bulk/team event entries.
- [ ] **Live Leaderboard:** Real-time score updates for sports and gaming.
- [ ] **SMS Integration:** OTP verification for phone numbers.

---

## 📞 Support
Developed for **GEC Dahod TechFest 2k26**. For technical support or contribution, contact the lead developer.

email: pavan.yadav.sde@gmail.com , 230180107045@gecdahod.ac.in
