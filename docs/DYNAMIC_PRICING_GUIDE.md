# 💰 Dynamic Event Pricing System

## ✅ What's New

Your application now has **dynamic event pricing**! You can easily manage event prices without touching any code.

---

## 📁 Configuration File

All event prices are managed in:
```
config/events.config.json
```

### Structure:
```json
{
  "programType": {
    "displayName": "Program Display Name",
    "teamName": "Team Name",
    "events": {
      "Event Name": {
        "price": 500,
        "description": "Event description",
        "teamSize": "Team size info"
      }
    }
  }
}
```

---

## 🎯 How to Manage Events

### 1. **Edit Existing Event Price**

Open `config/events.config.json`:

```json
"techfest": {
  "events": {
    "Hack-Accelerate": {
      "price": 600,  // ← Change this to any amount
      "description": "Coding hackathon",
      "teamSize": "2-4 participants"
    }
  }
}
```

💡 **Just change the number and save the file!**

---

### 2. **Add New Event**

Add a new event to an existing program:

```json
"techfest": {
  "events": {
    "Web Development Challenge": {  // ← New event!
      "price": 400,
      "description": "Website building competition",
      "teamSize": "1-3 participants"
    }
  }
}
```

---

### 3. **Add New Program**

Add a completely new program:

```json
{
  "spardha": { ... },
  "techfest": { ... },
  "trividya": { ... },
  "cultural": {  // ← New program!
    "displayName": "Cultural Fest 2k26",
    "teamName": "Cultural Team",
    "events": {
      "Solo Dance": {
        "price": 150,
        "description": "Solo dance competition",
        "teamSize": "1 participant"
      },
      "Group Dance": {
        "price": 300,
        "description": "Group dance performance",
        "teamSize": "5-10 participants"
      }
    }
  }
}
```

---

## 📊 Current Event Prices

### Spardha 2k26
- Net Cricket: ₹500
- Box Cricket: ₹600
- Volleyball: ₹400
- Kabaddi: ₹450
- Paint Ball: ₹700

### TechFest 2k26
- AutoCAD Master: ₹200
- Cosmo Clench: ₹250
- CAD Mania: ₹200
- Paper Presentation: ₹150
- Death Rush: ₹300
- Innov-a-thon: ₹500
- Hack-Accelerate: ₹600
- Paint Ball: ₹700
- Overkill (Valorant): ₹400
- Games Com: ₹350

### Trividya 2k26
- Dance: ₹300
- Singing: ₹150
- Drama: ₹400
- Fashion Show: ₹500

---

## 🔄 How It Works

```
User selects event
       ↓
Form sends: programType + eventName
       ↓
Server reads: events.config.json
       ↓
Server finds event price
       ↓
Razorpay order created with correct amount
       ↓
User pays the event-specific price
       ↓
Database stores actual amount paid
       ↓
Email shows correct amount
```

---

## 🚀 Testing Dynamic Pricing

### 1. Start the server:
```bash
node server.secure.js
```

### 2. Check event price via API:
```bash
# Get all techfest events
curl http://localhost:3000/api/events/techfest

# Get specific event details
curl http://localhost:3000/api/event/techfest/Hack-Accelerate
```

### 3. Test registration:
1. Go to `http://localhost:3000/reg.html`
2. Select **TechFest 2k26**
3. Select **Hack-Accelerate**
4. Start registration
5. Check console: You'll see:
   ```
   💰 Event: Hack-Accelerate (techfest) - Price: ₹600
   ```
6. Razorpay will show ₹600 payment!

---

## 📝 Example Scenarios

### Change Hack-Accelerate price from ₹600 to ₹800:

**Edit `config/events.config.json`:**
```json
"Hack-Accelerate": {
  "price": 800,  // Changed from 600
  "description": "Coding hackathon",
  "teamSize": "2-4 participants"
}
```

**Restart server:**
```bash
node server.secure.js
```

**Test:**
- Register for Hack-Accelerate
- You'll be charged ₹800 now!

---

### Add a new event "AI Challenge":

**Edit `config/events.config.json`:**
```json
"techfest": {
  "events": {
    "AI Challenge": {  // New!
      "price": 750,
      "description": "Artificial Intelligence competition",
      "teamSize": "1-4 participants"
    },
    // ... other events
  }
}
```

**Update `reg.html`** (add to dropdown):
```html
<option value="AI Challenge" class="event-option techfest">AI Challenge</option>
```

**Restart server** - Done! ✅

---

## 🆘 Troubleshooting

### Server doesn't see price changes?
- Make sure you saved `events.config.json`
- Restart the server: `node server.secure.js`
- The config is loaded when server starts

### Event shows ₹10 instead of actual price?
- Check if event name matches exactly (case-sensitive!)
- Example: "Hack-Accelerate" ≠ "hack-accelerate"

### Want to reload config without restart?
Add this endpoint to `server.secure.js`:
```javascript
app.post('/api/reload-events', (req, res) => {
  EventService.reloadConfig();
  res.json({ success: true, message: 'Events reloaded' });
});
```

Then run:
```bash
curl -X POST http://localhost:3000/api/reload-events
```

---

## 📊 View All Events

Create a simple admin page:

**Create `admin/events.html`:**
```html
<!DOCTYPE html>
<html>
<head>
  <title>Event Pricing Admin</title>
  <style>
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 8px; }
    th { background-color: #4CAF50; color: white; }
  </style>
</head>
<body>
  <h1>Event Pricing</h1>
  <table id="events-table">
    <thead>
      <tr>
        <th>Program</th>
        <th>Event</th>
        <th>Price</th>
        <th>Description</th>
        <th>Team Size</th>
      </tr>
    </thead>
    <tbody></tbody>
  </table>
  
  <script>
    fetch('/api/events/all')
      .then(r => r.json())
      .then(data => {
        const tbody = document.querySelector('#events-table tbody');
        // Populate table with events
      });
  </script>
</body>
</html>
```

---

## ✅ Benefits

1. **No Code Changes**: Just edit JSON file
2. **Instant Updates**: Change prices anytime
3. **Easy Management**: All prices in one place
4. **Audit Trail**: Track price changes via Git
5. **Flexible**: Add events without touching code

---

## 📁 Files Created

```
config/
  ├── events.config.json          # Main config (edit this!)
  └── events.config.example.json  # Template for new events

services/
  └── EventService.js             # Service to read config

server.secure.js                  # Updated with dynamic pricing
reg.html                          # Updated to send event details
```

---

## 🎓 Quick Reference

### Change Price:
1. Edit `config/events.config.json`
2. Find event
3. Change `"price": 600` to desired amount
4. Save file
5. Restart server

### Add Event:
1. Edit `config/events.config.json`
2. Add new event object
3. Update `reg.html` dropdown
4. Restart server

### Check Price via API:
```bash
curl http://localhost:3000/api/event/techfest/Hack-Accelerate
```

---

**Your pricing is now fully dynamic and easy to manage! 🎉💰**
