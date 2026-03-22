# SynapseOS Frontend - Setup Instructions

## ⚠️ Prerequisites Required

You need to install **Node.js** first before running this project.

### Step 1: Download & Install Node.js

1. Visit: https://nodejs.org/
2. Download the **LTS (Long Term Support)** version
3. Run the installer and follow the setup wizard
4. **Important**: Make sure you check the box to add Node.js to PATH

### Step 2: Verify Installation

After installation, restart PowerShell and run:
```powershell
node --version
npm --version
```

You should see version numbers (e.g., v18.17.0 or v20.0.0).

---

## 🚀 Once Node.js is Installed

Navigate to the project and run:

```powershell
cd "a:\dev clash frontend\synapse-os"
npm install
```

This will install all dependencies:
- React 18.2.0
- Vite 5.0.0
- Tailwind CSS 3.3.0
- Framer Motion 10.16.4
- Axios 1.6.0
- Lucide-React 0.292.0

### Start Development Server

```powershell
npm run dev
```

Then open: **http://localhost:5173**

### Build for Production

```powershell
npm run build
```

---

## 🐛 Troubleshooting

**Problem**: npm command not found after installation?
- Restart your terminal/PowerShell
- Or restart your computer

**Problem**: Permission denied errors?
- Run PowerShell as Administrator

**Problem**: Port 5173 already in use?
- Vite will automatically use the next available port (5174, 5175, etc.)

---

## 📋 Quick Checklist

- [ ] Node.js LTS installed from nodejs.org
- [ ] PowerShell restarted
- [ ] `node --version` shows a version number
- [ ] `npm --version` shows a version number
- [ ] Ran `npm install` in the project directory
- [ ] Backend running on http://localhost:8000
- [ ] `npm run dev` started successfully

---

## 💡 Pro Tips

1. Keep your Django backend running on `http://localhost:8000`
2. The frontend will automatically hot-reload as you edit files
3. Open Browser DevTools (F12) to see network requests and errors
4. Check the Network tab if API calls fail

Good luck with your Hackathon! 🚀
