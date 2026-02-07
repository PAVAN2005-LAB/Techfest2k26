# PostgreSQL (Neon) Migration Complete! 🎉

## ✅ What Was Done

### 1. Database Connection Setup
- Added Neon PostgreSQL connection string to `.env`
- Installed `pg` (PostgreSQL client for Node.js)
- Configured SSL connection for Neon

### 2. Database Tables Created
Three tables have been created in your Neon database:
- `spardha` - For Spardha 2k26 registrations
- `techfest` - For TechFest 2k26 registrations
- `trividya` - For Trividya 2k26 registrations

Each table has the following schema:
```sql
- id (SERIAL PRIMARY KEY)
- firstName, lastName, email, phoneNumber
- programType, event
- collegeName, address, branch, sem, enrollmentNo, gender
- paymentId, orderId, paymentStatus, amount
- timestamp (TIMESTAMP, auto-generated)
```

### 3. Server Migration
- Migrated from SQLite to PostgreSQL
- Updated `server.js` to use connection pooling
- Converted all database queries to PostgreSQL syntax
- Maintained all existing functionality (Razorpay, email notifications, etc.)

## 📁 New Files Created

1. **`test-neon.js`** - Quick connection test script
2. **`setup-database.js`** - Database initialization script
3. **`psql-interactive.js`** - Interactive query tool (like psql)

## 🚀 How to Use

### Start Your Server
```bash
node server.js
```
Your server will run on http://localhost:3000 and connect to Neon PostgreSQL.

### Test Database Connection
```bash
node test-neon.js
```

### Interactive Database Queries
```bash
node psql-interactive.js
```

Once in the interactive tool, you can:
- `.tables` - List all tables
- `.count spardha` - Count registrations in spardha table
- `.schema techfest` - View table structure
- Or run any SQL query directly!

Example queries:
```sql
SELECT * FROM techfest;
SELECT COUNT(*) FROM spardha WHERE paymentStatus = 'SUCCESS';
SELECT email, firstName, lastName FROM trividya ORDER BY timestamp DESC LIMIT 10;
```

## 🔧 Environment Variables

Your `.env` file now includes:
```
PORT=3000
DATABASE_URL=postgresql://neondb_owner:...@ep-old-shadow-aiszybm0-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
```

## 📊 Database Info

- **Provider**: Neon (Serverless PostgreSQL)
- **Version**: PostgreSQL 17.7
- **Location**: us-east-1 (AWS)
- **Connection**: Pooled, SSL-enabled

## 🎯 Next Steps

1. **Test Registration Flow**: 
   - Start the server: `node server.js`
   - Open your registration page in a browser
   - Complete a test registration
   - Check the database: `node psql-interactive.js` → `SELECT * FROM techfest;`

2. **View Existing Data** (if any was in SQLite):
   - The old SQLite database (`registrations.db`) still exists
   - You can migrate data if needed

3. **Deploy to Production**:
   - Your Neon database is already cloud-hosted
   - Just deploy your Node.js server to any platform (Vercel, Heroku, etc.)
   - Make sure to set the environment variables

## ⚠️ Important Notes

- The old SQLite file (`registrations.db`) has NOT been deleted
- All new registrations will go to PostgreSQL
- The database connection uses SSL for security
- Connection pooling is enabled for better performance

## 🆘 Troubleshooting

If you see connection errors:
1. Check your `.env` file has the correct DATABASE_URL
2. Ensure `pg` package is installed: `npm install pg`
3. Verify network connectivity to Neon

## 📝 Useful Commands

```bash
# Install dependencies (if needed on another machine)
npm install

# Run the server
node server.js

# Test database connection
node test-neon.js

# Interactive database queries
node psql-interactive.js

# Recreate tables (if needed)
node setup-database.js
```

---
**Migration completed successfully!** 🎉
Your TechFest application is now using cloud-hosted PostgreSQL!
