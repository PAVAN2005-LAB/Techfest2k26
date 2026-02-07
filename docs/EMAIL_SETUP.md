# Email Acknowledgment Setup Guide 📧

## ✅ What's Been Done

Your server now sends **professional HTML emails** to registrants after successful payment!

### Features:
- ✨ Beautiful HTML email template with gradient header
- 📊 Well-organized sections for all registration details
- 💳 Payment information prominently displayed
- 📱 Mobile-responsive design
- 🎨 Program-specific branding (Spardha, TechFest, Trividya)
- ⚡ Both HTML and plain text versions (for compatibility)

---

## 🧪 How to Test Email Functionality

### Option 1: Send a Test Email (Quick Test)

1. **Edit the test email script:**
   ```bash
   notepad test-email.js
   ```

2. **Change this line (line 14):**
   ```javascript
   email: 'test@example.com', // CHANGE THIS TO YOUR EMAIL
   ```
   Replace with your actual email address.

3. **Run the test:**
   ```bash
   node test-email.js
   ```

4. **Check your email** (including spam folder!)

### Option 2: Test Through the Full Registration Flow

1. **Make sure your server is running:**
   ```bash
   node server.js
   ```

2. **Open the registration page:**
   - Navigate to `http://localhost:3000/reg.html`

3. **Fill out the registration form:**
   - Use a valid email address you can access
   - Select a program type and event
   - Complete all fields

4. **Complete the payment:**
   - Amount will be ₹10 (test amount)
   - Use Razorpay test card details if in test mode

5. **Check your email** for the acknowledgment!

---

## 📧 Email Configuration

Your current email settings (from `.env`):
- **Email Service:** Gmail
- **Sender Email:** `subodhyadav65197@gmail.com`
- **Authentication:** App Password (recommended)

### Important Gmail Setup:

If you're getting authentication errors, you need to use an **App Password**:

1. Go to Google Account Settings
2. Security → 2-Step Verification (enable it)
3. Security → App Passwords
4. Generate a new app password for "Mail"
5. Update `.env` with the 16-character app password (no spaces)

---

## 📬 Email Template Preview

The email includes:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Registration Confirmed!
TechFest 2k26
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dear Pavan Kumar,

✅ Payment Successful! Your registration has been confirmed.

👤 Personal Information
Name: Pavan Kumar
Gender: Male
Email: pavan@example.com
Phone: 1234567890

🎓 Academic Information
College: Government College of Engineering Dahod
Branch: Computer
Semester: 5th
...

🎯 Event Details
Program: TechFest 2k26
Event: Hack-Accelerate

💳 Payment Information
Transaction ID: pay_xxxxxxxxxxxxx
Order ID: order_yyyyyyyyyyyyy
Amount Paid: ₹10
Status: ✓ SUCCESS
```

---

## 🔧 Troubleshooting

### Email Not Sending?

1. **Check environment variables:**
   ```bash
   type .env
   ```
   Make sure `EMAIL_USER` and `EMAIL_PASS` are set correctly.

2. **Test email credentials:**
   ```bash
   node test-email.js
   ```
   This will show detailed error messages.

3. **Common issues:**
   - ❌ Using regular Gmail password → Use App Password instead
   - ❌ 2-Step Verification not enabled → Enable it first
   - ❌ "Less secure apps" disabled → Use App Password (modern solution)
   - ❌ Wrong email format → Check that EMAIL_USER includes @gmail.com

### Email Going to Spam?

This is normal for new senders. Solutions:
- Ask recipients to mark as "Not Spam"
- Add sender to address book
- For production: Use a dedicated email service (SendGrid, Mailgun, etc.)

---

## 💡 Customization Options

### Change Email Template Colors

Edit `server.js` around line 130:

```javascript
.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); ... }
```

### Different Email for Each Program

The email already adapts based on program:
- **Spardha Team** for Spardha 2k26
- **TechFest Team** for TechFest 2k26
- **Trividya Team** for Trividya 2k26

### Add Event-Specific Information

You can modify the email template in `server.js` to include:
- Event date/time
- Venue details
- Special instructions
- Contact information

---

## 📊 Testing Checklist

- [ ] Test email script works (`node test-email.js`)
- [ ] Email appears correctly in inbox
- [ ] HTML formatting looks good
- [ ] All registration details are included
- [ ] Payment information is correct
- [ ] Program-specific branding is correct
- [ ] Full registration flow sends email
- [ ] Email is saved in database

---

## 🚀 Production Recommendations

When deploying to production:

1. **Consider a dedicated email service:**
   - SendGrid (free tier: 100 emails/day)
   - Mailgun (free tier: 1,000 emails/month)
   - Amazon SES (very cheap, scalable)

2. **Update email template** with:
   - Actual event dates
   - Venue location
   - Contact support email
   - Event guidelines/instructions

3. **Set up email tracking:**
   - Delivery confirmation
   - Open tracking
   - Bounce handling

4. **Add CC/BCC** to admin:
   ```javascript
   bcc: 'admin@gecdahod.ac.in'
   ```

---

## 📝 Quick Commands

```bash
# Test email functionality
node test-email.js

# Start server (emails sent on registration)
node server.js

# Check email configuration
echo $EMAIL_USER
echo $EMAIL_PASS

# View recent registrations
node psql-interactive.js
# Then: SELECT email, firstName, lastName FROM techfest ORDER BY timestamp DESC LIMIT 10;
```

---

**Email system is ready! 📧✨**
