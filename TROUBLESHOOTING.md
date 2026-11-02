# Troubleshooting Guide

## Issue: Data Not Saving/Displaying

If your mood entries (or other data) are not being saved or displayed, follow these steps:

### Step 1: Check if Server is Running

1. Open a terminal/command prompt
2. Navigate to the server directory: `cd server`
3. Start the server: `npm run dev` or `npm start`
4. You should see: `🚀 Server is running on http://localhost:5000`

### Step 2: Check Database Connection

1. Make sure PostgreSQL is running
2. Verify the database exists: `therapy-space`
3. Check the connection string in `server/src/config/database.js` matches your PostgreSQL setup:
   ```
   postgresql://postgres:9596@localhost:5432/therapy-space
   ```

### Step 3: Run Database Migrations

If you haven't run migrations yet:
```bash
cd server
npm run migrate
```

### Step 4: Check Browser Console

1. Open your browser's Developer Tools (F12)
2. Go to the Console tab
3. Look for any error messages when you try to save data
4. Common errors:
   - `Failed to fetch` - Server is not running or CORS issue
   - `Network Error` - Server is not accessible
   - `500 Internal Server Error` - Database connection issue

### Step 5: Test API Endpoints

Test if the API is working:

**Health Check:**
```bash
curl http://localhost:5000/health
```
Should return: `{"status":"ok","message":"Therapy Space API is running"}`

**Test Mood Creation:**
```bash
curl -X POST http://localhost:5000/api/mood -H "Content-Type: application/json" -d "{\"mood\":4,\"emoji\":\"🙂\",\"note\":\"test\"}"
```

**Test Mood Retrieval:**
```bash
curl http://localhost:5000/api/mood
```

### Step 6: Check API URL in Frontend

1. Open `src/services/api.js`
2. Verify the API_BASE_URL: `http://localhost:5000/api`
3. If your server runs on a different port, update it or set `VITE_API_URL` in `.env`

### Step 7: Verify Both Servers Are Running

You need TWO terminals:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Common Issues and Solutions

#### Issue: "Failed to fetch" Error
**Solution:** 
- Make sure the backend server is running on port 5000
- Check if there are any firewall issues
- Verify CORS is enabled (it should be by default)

#### Issue: "Database connection failed"
**Solution:**
- Verify PostgreSQL is running
- Check database credentials
- Ensure database `therapy-space` exists
- Run migrations: `npm run migrate`

#### Issue: Data saves but doesn't show in history
**Solution:**
- Refresh the page - data should load automatically
- Check browser console for errors
- Verify the data was actually saved by checking the database directly

#### Issue: Port 5000 already in use
**Solution:**
- Change the port in `server/src/index.js`
- Update `VITE_API_URL` in frontend `.env` file
- Or kill the process using port 5000

### Quick Diagnostic Commands

```bash
# Check if server is running
curl http://localhost:5000/health

# Check database connection
cd server
node test-connection.js

# Run migrations
npm run migrate

# Check if tables exist (PostgreSQL)
psql -U postgres -d therapy-space -c "\dt"
```

### Still Having Issues?

1. Check the server logs in the terminal where `npm run dev` is running
2. Check browser console for JavaScript errors
3. Verify all dependencies are installed: `npm install` in both root and server directories
4. Make sure you're using the correct database connection string

