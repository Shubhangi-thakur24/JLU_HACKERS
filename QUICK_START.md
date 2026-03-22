# 🚀 SynapseOS Frontend - Quick Commands

## First Time Setup (After Installing Node.js)

```powershell
# Step 1: Navigate to project
cd "a:\dev clash frontend\synapse-os"

# Step 2: Install dependencies
npm install

# This will automatically install all these packages:
# - react
# - vite
# - tailwindcss
# - framer-motion
# - axios
# - lucide-react
```

## Running the Development Server

```powershell
npm run dev
```

**Expected Output:**
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

Open your browser to: **http://localhost:5173**

## Building for Production

```powershell
npm run build
```

This creates an optimized `dist/` folder ready for deployment.

## Individual Package Installation (if needed)

```powershell
# React & Vite (included in npm install)
npm install react react-dom

# Styling & Animations
npm install tailwindcss framer-motion

# API & Icons
npm install axios lucide-react

# Dev Dependencies
npm install -D vite @vitejs/plugin-react postcss autoprefixer
```

---

## 🔗 Backend Requirement

Ensure your Django backend is running:
```
http://localhost:8000
```

The frontend expects these endpoints:
- `GET /api/revisions/dashboard/`
- `POST /api/demo/simulate-day/`
- `POST /api/process-video/`

---

## ✅ Checklist Before Running

1. ✅ Node.js installed? → Run `node --version`
2. ✅ PowerShell restarted? → Try closing and reopening
3. ✅ In project folder? → `cd "a:\dev clash frontend\synapse-os"`
4. ✅ Django running? → Check `http://localhost:8000`
5. ✅ Run `npm install` → Once per project
6. ✅ Run `npm run dev` → Every time you want to develop

---

**Built with ❤️ for SynapseOS Hackathon**
