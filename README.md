# 🚀 TechFest 2k26 — Event Registration System

A robust, secure, and dynamic event registration platform for **GEC Dahod's TechFest 2k26, Trividya 2k26 & Spardha 2k26**. Built with Node.js, Express, PostgreSQL, and Razorpay.

**🌐 Live:** [https://techfest2k26.onrender.com](https://techfest2k26.onrender.com)

---

## ✨ Features

### 🛡️ Admin Dashboard
- **Event Manager** — Add, edit, and delete events across all programs (Spardha, TechFest, Trividya) from the UI. Changes reflect instantly on the registration form.
- **Registration Management** — View and filter all registrations with real-time stats.
- **Registration Toggle** — Instantly enable/disable registrations site-wide. Status is persisted in the database.
- **Secure Login** — Admin authentication works independently of database connectivity.

### 🛒 Dynamic Registration & Pricing
- **Live Event Loading** — Events are fetched dynamically from the server API, not hardcoded.
- **Automated Pricing** — Prices are managed via `server/config/events.config.json` and shown in the registration form.
- **Secure Payments** — Integrated with Razorpay for safe transaction processing.
- **Status Verification** — Users can check their registration status using email or Order ID.

### 📧 Automated Communications
- **Instant Email Confirmation** — Automatic confirmation emails with full event and payment details.
- **Dynamic Templates** — Program-specific branding for Spardha, TechFest, and Trividya emails.

### 📱 Modern & Professional UX
- **PWA Support** — Installable as an app on Android/iOS with offline access.
- **Optimized Performance** — Animated WebP backgrounds (75% smaller than GIFs).
- **Responsive Design** — Mobile-first UI with floating "Back to Top" button and slide-in sidebar.
- **Live Countdown Timer** — Glassmorphism countdown to the event start date.

### 🔒 Security
- **Secure Backend** — OOP, SOLID, and ACID design principles.
- **Rate Limiting** — API endpoints protected from brute-force and abuse.
- **Helmet & XSS Protection** — HTTP security headers and input sanitization.
- **Environment Protection** — Secrets isolated in `.env`, never exposed client-side.

---

## 📂 Project Structure

```
TechFest2k26/
├── server.js                  # Main Express server with API routes
├── .env                       # Environment variables (secrets — not committed)
├── .env.example               # Template for environment variables
├── package.json               # Dependencies and scripts
│
├── server/                    # Backend
│   ├── config/                # Database, Email, Events, Payment configs
│   │   └── events.config.json # Event data (managed via Admin UI)
│   ├── models/                # Database models (Registration, SiteSettings)
│   ├── services/              # Business logic (Payment, Email, Event CRUD)
│   └── templates/             # HTML email templates
│
├── public/                    # Frontend
│   ├── css/                   # Stylesheets (Admin, Navbar, Registration, etc.)
│   ├── js/                    # Client-side JS (Admin, Registration, Countdown)
│   ├── images/                # Logos and optimized assets (WebP)
│   ├── pages/                 # HTML pages (Admin, Registration, Contact, Gallery)
│   ├── sw.js                  # Service Worker (PWA offline support)
│   └── manifest.json          # PWA Manifest
│
└── scripts/                   # Utility scripts (DB testing, email testing)
```

---

## 🏁 Run Locally

### Prerequisites

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **npm** v9 or higher (comes with Node.js)
- **PostgreSQL database** — You can use [Neon](https://neon.tech/) (free cloud PostgreSQL)
- **Razorpay account** — [Sign up](https://razorpay.com/) for payment gateway keys
- **Gmail App Password** — For email notifications ([Generate here](https://myaccount.google.com/apppasswords))

### Step 1: Clone the Repository

```bash
git clone https://github.com/PAVAN2005-LAB/Techfest2k26.git
cd Techfest2k26
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@host/database?sslmode=require
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
ADMIN_USER=admin@gecdahod.ac.in
ADMIN_PASS=your_secure_password
```

### Step 4: Start the Server

```bash
# Production mode
npm start

# Development mode (auto-restart on file changes)
npm run dev
```

### Step 5: Open in Browser

| Page                | URL                                       |
|---------------------|-------------------------------------------|
| 🏠 Homepage          | http://localhost:3000                      |
| 📋 Registration Form | http://localhost:3000/reg.html             |
| 🛡️ Admin Dashboard   | http://localhost:3000/pages/admin.html     |
| 📞 Contact Page      | http://localhost:3000/pages/contact.html   |
| 🖼️ Gallery           | http://localhost:3000/pages/gallery.html   |

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|--------------------------------------------------|
| **Runtime** | Node.js (v18+)                                   |
| **Backend** | Express.js                                       |
| **Database**| PostgreSQL (Neon Cloud)                           |
| **Payment** | Razorpay API                                     |
| **Email**   | Nodemailer (Gmail SMTP)                          |
| **Frontend**| Vanilla HTML, CSS, JavaScript                    |
| **Security**| Helmet, express-rate-limit, hpp, xss-clean       |
| **PWA**     | Service Workers, Web App Manifest                |
| **Hosting** | Render                                           |

---

## � Admin Panel Usage

1. Navigate to `/pages/admin.html`
2. Login with the credentials set in your `.env` file (`ADMIN_USER` and `ADMIN_PASS`)
3. Use the **Registrations** tab to view all registrations and toggle registration status
4. Use the **Event Manager** tab to add, edit, or delete events — changes reflect instantly on the registration form

---

## 📞 Support

Developed for **GEC Dahod — TechFest 2k26, Trividya 2k26 & Spardha 2k26**.

For technical support or contributions, contact the lead developer:

- 📧 **Email:** pavan.yadav.sde@gmail.com
- 🎓 **College Email:** 230180107045@gecdahod.ac.in
- 🐙 **GitHub:** [PAVAN2005-LAB](https://github.com/PAVAN2005-LAB)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
