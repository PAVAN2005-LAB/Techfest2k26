# 🎉 Dynamic Event Pricing - Quick Start

## ✅ What You Can Do Now:

### 1. **Change Event Prices** (No Code!)

**File**: `config/events.config.json`

Example - Change Hack-Accelerate from ₹600 to ₹800:
```json
"Hack-Accelerate": {
  "price": 800,  // Just change this number!
  "description": "Coding hackathon",
  "teamSize": "2-4 participants"
}
```

Save file → Restart server → Done! ✅

---

### 2. **Add New Event**

In `config/events.config.json`:

```json
"techfest": {
  "events": {
    "AI Challenge": {  // ← NEW EVENT!
      "price": 750,
      "description": "AI competition",
      "teamSize": "1-4 participants"
    }
  }
}
```

Then add to `reg.html` dropdown:
```html
<option value="AI Challenge" class="event-option techfest">AI Challenge</option>
```

---

### 3. **Add New Program**

```json
{
  "spardha": { ... },
  "cultural": {  // ← NEW PROGRAM!
    "displayName": "Cultural Fest 2k26",
    "teamName": "Cultural Team",
    "events": {
      "Solo Dance": {
        "price": 150,
        "description": "Dance competition",
        "teamSize": "1 participant"
      }
    }
  }
}
```

---

## 🧪 Test It!

### 1. Check event price via API:
```bash
curl http://localhost:3000/api/event/techfest/Hack-Accelerate
```

Response:
```json
{
  "success": true,
  "event": {
    "price": 600,
    "description": "Coding hackathon",
    "teamSize": " 2-4 participants",
    "programType": "techfest",
    "programDisplay": "TechFest 2k26",
    "teamName": "TechFest Team"
  }
}
```

### 2. Get all events for a program:
```bash
curl http://localhost:3000/api/events/techfest
```

### 3. Test registration:
1. Go to `http://localhost:3000/reg.html`
2. Select TechFest → Hack-Accelerate
3. Watch console:
   ```
   💰 Event: Hack-Accelerate (techfest) - Price: ₹600
   Event: Hack-Accelerate - Amount: ₹600
   ```
4. Razorpay shows ₹600!

---

## 📁 All Prices in One File

**`config/events.config.json`** contains ALL event prices:

```
Spardha: 5 events (₹400-₹700)
TechFest: 10 events (₹150-₹700)
Trividya: 4 events (₹150-₹500)
```

**Total: 19 events with individual prices!**

---

## 🔄 Workflow

```
Edit config/events.config.json
       ↓
Restart server
       ↓
Changes take effect immediately!
```

**No code changes needed!** ✨

---

## 📊 Current Prices

### TechFest (Popular Events)
- Hack-Accelerate: ₹600
- Innov-a-thon: ₹500
- AutoCAD Master: ₹200
- Paper Presentation: ₹150

### Spardha
- Paint Ball: ₹700
- Box Cricket: ₹600
- Net Cricket: ₹500

### Trividya
- Fashion Show: ₹500
- Drama: ₹400
- Dance: ₹300

---

## ⚡ Quick Commands

```bash
# Start server with dynamic pricing
node server.secure.js

# Test event price
curl http://localhost:3000/api/event/techfest/Hack-Accelerate

# View all techfest events
curl http://localhost:3000/api/events/techfest
```

---

**Your pricing system is now fully dynamic! 🎯💰**

See `DYNAMIC_PRICING_GUIDE.md` for complete documentation.
