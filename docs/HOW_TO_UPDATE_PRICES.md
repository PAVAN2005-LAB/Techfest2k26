# 💡 How to Update Event Prices

## Issue: Price Changes Not Showing

When you edit `server/config/events.config.json`, the changes won't appear until you **restart the server**.

---

## Why This Happens:

The `EventService` loads the config file when the server starts:

```javascript
// EventService.js - Line 8-9
constructor() {
    const configPath = path.join(__dirname, '../config/events.config.json');
    this.eventsConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    // ☝️ This only runs ONCE when server starts!
}
```

The config is **cached in memory** for performance. It doesn't reload automatically when you edit the file.

---

## ✅ Solution: Restart the Server

### Method 1: Stop & Start (Recommended)
```bash
# Stop the current server
Press: Ctrl + C

# Start it again
node server.secure.js
```

### Method 2: Kill & Restart
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Start fresh
node server.secure.js
```

---

## 🔄 Complete Workflow:

### Step 1: Edit Price
```
Open: server/config/events.config.json

Change:
"Net Cricket": {
    "price": 500   ← OLD
    ...
}

To:
"Net Cricket": {
    "price": 5     ← NEW
    ...
}

Save file ✅
```

### Step 2: Restart Server
```bash
# In terminal where server is running:
Ctrl + C  (stop server)

node server.secure.js  (start again)
```

### Step 3: Test API
```bash
curl http://localhost:3000/api/event/spardha/Net%20Cricket

# Should return:
{
    "success": true,
    "event": {
        "price": 5    ← NEW PRICE! ✅
        ...
    }
}
```

### Step 4: Refresh Browser
```
Press: Ctrl + Shift + R  (hard refresh)

Select: Spardha → Net Cricket
See: ₹5  (NEW PRICE!) ✅
```

---

## 🚀 Quick Steps:

1. **Edit** `server/config/events.config.json`
2. **Save** the file
3. **Stop** server (Ctrl + C)
4. **Start** server (`node server.secure.js`)
5. **Refresh** browser (Ctrl + Shift + R)

---

## 🔍 Verify It Worked:

### Test via API:
```bash
# Test specific event
curl "http://localhost:3000/api/event/spardha/Net%20Cricket"

# Should show new price
```

### Test via Browser:
```
1. Open: http://localhost:3000/pages/reg.html
2. Select: Spardha 2k26
3. Select: Net Cricket
4. See price box: ₹5 ✅
```

---

## 💡 Pro Tips:

### Use Development Mode (Auto-Reload)
```bash
# Install nodemon (already in package.json)
npm install

# Use dev script (auto-restarts on file changes)
npm run dev
```

With `npm run dev`, the server will **automatically restart** when you edit `events.config.json`!

### Alternative: Add Hot Reload Endpoint

You can call the `reloadConfig()` method without restarting:

```javascript
// Add this to server.secure.js:
app.post('/api/reload-config', (req, res) => {
    EventService.reloadConfig();
    res.json({ success: true, message: 'Config reloaded' });
});
```

Then reload without restart:
```bash
curl -X POST http://localhost:3000/api/reload-config
```

---

## 📋 Checklist:

- [x] Edited `server/config/events.config.json` ✅
- [ ] Stopped the server (Ctrl + C)
- [ ] Restarted the server (`node server.secure.js`)
- [ ] Tested API (shows new price)
- [ ] Refreshed browser (shows new price)

---

## Current Status:

**Your File:** ✅ Has `"price": 5`  
**Server Memory:** ❌ Still has `"price": 500` (old)  

**Action Needed:** **Restart the server!**

---

**After restart, your ₹5 price will show immediately!** 🎯
