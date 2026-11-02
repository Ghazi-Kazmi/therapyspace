# Quick Start Guide

## To Run the Application

### 1. Start the Backend Server

Open a terminal and run:
```bash
cd server
npm run dev
```

You should see:
```
🚀 Server is running on http://localhost:5000
📊 Health check: http://localhost:5000/health
```

**Keep this terminal open!**

### 2. Start the Frontend

Open a **NEW** terminal window and run:
```bash
npm run dev
```

You should see the frontend starting on `http://localhost:3000`

### 3. Test the Application

1. Open your browser and go to `http://localhost:3000`
2. Click "Get Started" or scroll to the dashboard
3. Try saving a mood entry
4. Click "History" to see your saved entries

## Important Notes

- **Both servers must be running** - Backend (port 5000) and Frontend (port 3000)
- If data doesn't save, check that the backend server is running
- Check the browser console (F12) for any error messages
- The backend terminal will show API requests and any errors

## First Time Setup

If this is your first time running the application:

1. **Install dependencies** (if not already done):
   ```bash
   # In the server directory
   cd server
   npm install
   
   # In the root directory
   cd ..
   npm install
   ```

2. **Run database migrations**:
   ```bash
   cd server
   npm run migrate
   ```

3. **Make sure PostgreSQL is running** and the database `therapy-space` exists

4. Then follow steps 1-3 above to start both servers

## Troubleshooting

If something doesn't work:
1. Check if both servers are running (backend on 5000, frontend on 3000)
2. Check browser console (F12) for errors
3. Check backend terminal for error messages
4. See `TROUBLESHOOTING.md` for detailed help

