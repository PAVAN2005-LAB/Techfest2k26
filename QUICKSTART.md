# 🚀 Quick Start Guide - TechFest 2k26

## ✅ Your Application is Now Production-Ready!

---

## 📊 Current Status

✅ **Professionally Organized** - Enterprise-grade structure  
✅ **Secure** - OOP, SOLID, ACID principles  
✅ **Dynamic Pricing** - JSON-based event management  
✅ **Email System** - Automated confirmations  
✅ **Database** - PostgreSQL (Neon) cloud-hosted  
✅ **Payment Gateway** - Razorpay integration  

**Server Status:** ✅ Running at `http://localhost:3000`

---

## 🎯 Common Commands

### Start Server
```bash
npm start
```

### Development Mode (Auto-reload)
```bash
npm run dev
```

### Setup Database
```bash
npm run setup
```

### Test Database Connection
```bash
npm run test:db
```

### Test Email Service
```bash
npm run test:email
```

### Interactive Database Query
```bash
npm run db:query
```

---

## 📁 Quick Navigation

### Want to...

**Change Event Prices?**  
→ Edit `server/config/events.config.json`

**Update Email Template?**  
→ Edit `server/templates/EmailTemplate.js`

**Modify Registration Form?**  
→ Edit `public/pages/reg.html`

**Change Styles?**  
→ Edit files in `public/css/`

**View Registration Data?**  
→ Run `npm run db:query`

**Test Features?**  
→ Run scripts in `scripts/` folder

**Read Documentation?**  
→ Check `docs/` folder

---

## 🌐 Access Your Application

### Main Pages
- **Home:** http://localhost:3000/
- **Registration:** http://localhost:3000/pages/reg.html
- **Gallery:** http://localhost:3000/pages/gallery.html

### API Endpoints
- **Razorpay Key:** http://localhost:3000/api/config/razorpay
- **Event Details:** http://localhost:3000/api/event/techfest/Hack-Accelerate
- **All Events:** http://localhost:3000/api/events/techfest

---

##💰 Event Pricing

All prices managed in: `server/config/events.config.json`

### Current Programs:
- **Spardha** - 5 events (₹400-₹700)
- **TechFest** - 10 events (₹150-₹700)
- **Trividya** - 4 events (₹150-₹500)

### To Change Price:
1. Open `server/config/events.config.json`
2. Find the event
3. Change `"price": 600` to your amount
4. Save file
5. Restart server: `npm start`

---

## 📂 Project Structure

```
TechFest2k26/
├── server/          # Backend (Node.js)
├── public/          # Frontend (HTML/CSS/JS)
├── scripts/         # Utilities
├── docs/            # Documentation
├── server.js        # Main entry point
└── package.json     # Dependencies
```

---

## 🔧 Configuration

### Environment Variables (.env)
```env
PORT=3000
DATABASE_URL=your_neon_postgres_url
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

⚠️ **Never commit .env file to Git!**

---

## 📖 Documentation

All guides in `docs/` folder:

1. **README.md** - Complete overview
2 **PROJECT_STRUCTURE.md** - Directory organization
3. **DYNAMIC_PRICING_GUIDE.md** - Manage event prices
4. **SECURITY_REFACTORING.md** - Security features
5. **EMAIL_SETUP.md** - Email configuration
6. **REORGANIZATION_SUMMARY.md** - Code structure benefits

---

## 🧪 Testing

### 1. Test Registration Flow
```
1. Go to http://localhost:3000/pages/reg.html
2. Fill the form
3. Complete payment (use test mode)
4. Check email inbox
5. Verify database: npm run db:query
```

### 2. Test Specific Event Price
```bash
curl http://localhost:3000/api/event/techfest/Hack-Accelerate
```

### 3. Test Email Service
```bash
npm run test:email
```

---

## 🚀 Deployment Checklist

- [ ] Set environment variables on hosting platform
- [ ] Update `DATABASE_URL` for production
- [ ] Switch Razorpay to live mode
- [ ] Test email delivery
- [ ] Configure custom domain
- [ ] Enable HTTPS
- [ ] Test payment flow
- [ ] Monitor error logs

---

## 🔐 Security

✅ **API Keys** - Fetched from server, not in browser  
✅ **Payment Verification** - Server-side signature check  
✅ **SQL Injection** - Parameterized queries  
✅ **Environment Vars** - Protected with .env  
✅ **Git Security** - .gitignore configured  

---

## 📊 Features

### Dynamic Pricing
- JSON-based configuration
- No code changes needed
- Easy to update

### Payment Integration
- Razorpay gateway
- Secure verification
- Order management

### Email System
- HTML templates
- Automatic confirmations
- Program-specific branding

### Database
- PostgreSQL (Neon)
- Cloud-hosted
- ACID compliant

---

## 🆘 Troubleshooting

### Server won't start?
```bash
# Check if port is in use
netstat -ano | findstr :3000

# Use different port
$env:PORT=3001; npm start
```

### Database connection fails?
```bash
npm run test:db
```

### Email not sending?
```bash
npm run test:email
```

### Event price not updating?
- Check `server/config/events.config.json`
- Restart server: `npm start`
- Verify event name matches exactly (case-sensitive)

---

## 📞 Support

Need help? Check:
1. Documentation in `docs/` folder
2. Comments in code files
3. Console logs when running server

---

## 🎉 Success!

**Your application is:**
- ✅ Professionally organized
- ✅ Secure and scalable
- ✅ Production-ready
- ✅ Well-documented

**Ready to accept registrations!** 🚀

---

**Made with ❤️ for TechFest 2k26**
