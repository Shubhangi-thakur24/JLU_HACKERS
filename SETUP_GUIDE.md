# SETUP INSTRUCTIONS - Manual Step-by-Step Guide

## Prerequisites Check

Before starting, verify you have:
- ✅ Python 3.8+ installed
- ✅ Node.js 14+ installed
- ✅ npm installed with Node.js

**Check Installation:**
```powershell
python --version
node --version
npm --version
```

---

## OPTION 1: Automatic Setup (Easiest)

### For Windows:
1. Navigate to project folder:
   ```powershell
   cd "c:\Users\LENOVO\Desktop\aditya project sql\DevClash"
   ```

2. Double-click `start.bat` file

3. Wait for both backend and frontend terminals to appear

4. Frontend will open automatically at http://localhost:3000

✅ **Done! Both servers are running.**

---

## OPTION 2: Manual Setup (Detailed)

### PART A: Start Backend

#### Step 1: Open PowerShell/Command Prompt

#### Step 2: Navigate to Backend
```powershell
cd "c:\Users\LENOVO\Desktop\aditya project sql\DevClash\backend"
```

#### Step 3: Create Virtual Environment (First time only)
```powershell
python -m venv venv
```

If you get an error about execution policy:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try again:
```powershell
python -m venv venv
```

#### Step 4: Activate Virtual Environment
```powershell
.\venv\Scripts\Activate.ps1
```

Your prompt should now show `(venv)` at the beginning.

#### Step 5: Install Dependencies
```powershell
pip install -r requirements.txt
```

Wait for all packages to install (takes 1-2 minutes).

#### Step 6: Start Backend Server
```powershell
python main.py
```

You should see:
```
[START] Starting Adaptive Question System Backend...
INFO:     Uvicorn running on http://0.0.0.0:8000
```

✅ **Backend is running! Keep this window open.**

---

### PART B: Start Frontend (New Window)

#### Step 1: Open New PowerShell/Command Prompt

#### Step 2: Navigate to Frontend
```powershell
cd "c:\Users\LENOVO\Desktop\aditya project sql\DevClash\frontend"
```

#### Step 3: Install Dependencies (First time only)
```powershell
npm install
```

This downloads React, Axios, and other packages (~200MB, takes 2-5 minutes).

**You will see warnings - these are normal!**

#### Step 4: Start Frontend Server
```powershell
npm start
```

The frontend will:
1. Compile the React app
2. Open your browser automatically to http://localhost:3000

You should see:
```
Compiled successfully!

You can now view adaptive-question-system in the browser.

  Local:            http://localhost:3000
```

✅ **Frontend is running! You should see the application in your browser.**

---

## Verify Everything Works

### Backend Check
Open browser and go to: http://localhost:8000/health

You should see:
```json
{
  "status": "healthy",
  "service": "Adaptive Question Generation System",
  "version": "1.0.0"
}
```

### Frontend Check
Check browser at: http://localhost:3000

You should see:
- 🎓 Title: "Adaptive Practice System"
- Difficulty selector buttons
- A question displayed

### API Connection Check
1. In the app, click "Correct" or "Incorrect"
2. You should see the answer recorded and next question appears
3. No "connection refused" errors should appear

---

## Troubleshooting

### Backend Won't Start

**Problem: "Address already in use"**
```powershell
# Find process using port 8000
Get-NetTCPConnection -LocalPort 8000

# Kill the process (replace XXXX with actual PID)
taskkill /PID XXXX /F
```

Then try again:
```powershell
python main.py
```

**Problem: "ModuleNotFoundError: No module named 'fastapi'"**
```powershell
# Make sure virtual environment is activated (you should see (venv))
.\venv\Scripts\Activate.ps1

# Reinstall dependencies
pip install -r requirements.txt
```

**Problem: "python command not found"**
- Python is not installed or not in PATH
- Install from https://www.python.org/
- Make sure "Add Python to PATH" is checked during installation

---

### Frontend Won't Start

**Problem: "npm command not found"**
- Node.js is not installed
- Install from https://nodejs.org/
- Restart PowerShell after installation

**Problem: "npm ERR! 404 Not Found"**
```powershell
# Clear npm cache
npm cache clean --force

# Try install again
npm install
```

**Problem: Port 3000 already in use**
```powershell
# Kill process on port 3000
Get-NetTCPConnection -LocalPort 3000 | Select -ExpandProperty OwningProcess | Stop-Process -Force
```

Then:
```powershell
npm start
```

---

### Both Running but App Shows "Connection Refused"

**Problem: Frontend can't reach backend**

1. Check backend is running: http://localhost:8000/health
2. Check browser console (F12) for error messages
3. Restart both servers:

```powershell
# In backend window: Ctrl+C
# In frontend window: Ctrl+C

# Then start again
```

---

## Daily Usage (After Initial Setup)

### Starting Backend (Subsequent times):
```powershell
cd "c:\Users\LENOVO\Desktop\aditya project sql\DevClash\backend"
.\venv\Scripts\Activate.ps1
python main.py
```

### Starting Frontend (Subsequent times):
```powershell
cd "c:\Users\LENOVO\Desktop\aditya project sql\DevClash\frontend"
npm start
```

Or just use `start.bat` again!

---

## Testing the System

Once running:

1. **Get a Question**
   - Click on difficulty level
   - Question appears

2. **Submit an Answer**
   - Click "✓ Correct" or "✗ Incorrect"
   - Timer stops, feedback shown
   - Next question loads automatically

3. **View Stats**
   - Click "📊 View Statistics"
   - See your performance
   - Click "Back to Practice" to continue

4. **Reset Session**
   - Click "🔄 Reset & Start Over"
   - All history cleared
   - Start fresh

---

## Common Questions

**Q: Can I close the backend/frontend windows?**
A: Only when you're done using the app. If you close them, the app won't work.

**Q: Do I need to do the setup every time?**
A: No! First time does full setup. Next times, just:
   - Backend: `cd backend`, `.\venv\Scripts\Activate.ps1`, `python main.py`
   - Frontend: `cd frontend`, `npm start`

**Q: What if I want to stop everything?**
A: Press Ctrl+C in each window to stop the servers.

**Q: Can I run both on different machines?**
A: Yes! Change `BACKEND_URL` in `frontend/src/App.js` to backend machine's IP.

**Q: What data is stored?**
A: All data is in-memory (RAM). Refresh or close browser = data gone.
   (This is temporary; for production add a database)

---

## You're Ready!

Once both servers show "running", the app is ready to use.

Enjoy the Adaptive Practice System! 🚀

For more details, read the main `README.md` file.
