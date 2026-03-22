# SynapseOS - AI Learning Companion Frontend

A production-ready React (Vite) frontend for the SynapseOS learning platform, featuring AI-powered spaced repetition, study planning, and video distillation.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn
- Django backend running on `http://localhost:8000`

### Installation & Setup

```bash
# Navigate to the project directory
cd synapse-os

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📋 Installation Commands (Copy-Paste)

### One-by-one (recommended for new setups):

```bash
# Install Node dependencies
npm install

# Install Framer Motion
npm install framer-motion

# Install Axios
npm install axios

# Install Lucide Icons
npm install lucide-react

# Verify Tailwind CSS is installed
npm install -D tailwindcss postcss autoprefixer
```

### All-in-one:

```bash
npm install && npm install framer-motion axios lucide-react && npm install -D tailwindcss postcss autoprefixer
```

## 🏗️ Project Structure

```
synapse-os/
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx           # Main dashboard with tabs
│   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   ├── BrainMap.jsx            # Component A: Spaced repetition
│   │   ├── Timeline.jsx            # Component B: Study planner
│   │   └── VideoProcessor.jsx      # Component C: Video distillation
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # Global styles
│   └── main.jsx                    # Entry point
├── index.html                      # HTML template
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
└── package.json                    # Dependencies
```

## 🎨 Design Features

- **Dark Mode Theme**: Deep navy (#0F172A) and slate backgrounds
- **Neon Accents**: 
  - Emerald (#10B981) - Success/Future
  - Amber (#F59E0B) - Warning/Due Today
  - Crimson (#EF4444) - Error/Overdue
- **Responsive Layout**: Collapsed sidebar, mobile-friendly
- **Smooth Animations**: Framer Motion transitions

## 📦 Core Components

### 1. **Cognitive Brain Map** (Spaced Repetition)
- Fetches from: `GET /api/revisions/dashboard/`
- Displays study concepts as color-coded cards
- **Simulate Time** button hits: `POST /api/demo/simulate-day/`
- Color coding:
  - 🟢 Green: Future reviews
  - 🟡 Yellow: Due today
  - 🔴 Red: Overdue

### 2. **Study Timeline** (Auto-Rebalancing)
- Displays today's study blocks
- **Log Mock Test Failure** button re-prioritizes schedule
- Summary stats: Total time, sessions, overdue count

### 3. **Video Distillation Chamber** (Multimodal Processor)
- YouTube URL input with embedded player
- **Process** button hits: `POST /api/process-video/`
- Renders API response as structured notes:
  - Summary cards
  - Key points list
  - Concepts breakdown
  - Timestamp markers

## 🔌 API Integration

All API calls point to `http://localhost:8000` with proper error handling and loading states.

### Endpoints Used:
- `GET /api/revisions/dashboard/` - Fetch revision data
- `POST /api/demo/simulate-day/` - Simulate time progression
- `POST /api/process-video/` - Process YouTube videos

## ⚡ Key Features

✅ **Loading States**: Skeleton loaders for all async operations  
✅ **Error Handling**: User-friendly error messages  
✅ **Animations**: Smooth transitions with Framer Motion  
✅ **Responsive**: Mobile-first design  
✅ **Icons**: Lucide-React for clean SVG icons  
✅ **Dark Mode**: Production-ready dark UI  
✅ **Component Isolation**: Modular, reusable components  

## 🛠️ Development Tips

### Hot Module Reloading
Changes to components automatically reload in the browser during `npm run dev`.

### Tailwind CSS
The project uses Tailwind's utility classes. Custom colors are defined in `tailwind.config.js`.

### API Debugging
Enable browser DevTools Network tab to inspect API calls. Mock data is provided for testing without a backend.

## 📝 Environment Variables

Create a `.env` file if needed for custom API URLs:
```
VITE_API_BASE=http://localhost:8000
```

## 🎯 Hackathon Checklist

- ✅ React (Vite) setup with all dependencies
- ✅ Tailwind CSS with dark mode theme
- ✅ Three core components (Brain Map, Timeline, Video Processor)
- ✅ API integration with error handling
- ✅ Loading states and spinners
- ✅ Responsive sidebar layout
- ✅ Production-ready code quality
- ✅ Framer Motion animations
- ✅ Lucide-React icons

## 🚀 Deploy

To deploy to production:

```bash
npm run build
# Deploy 'dist' folder to your hosting
```

## 📞 Support

For issues:
1. Check backend is running on `http://localhost:8000`
2. Verify API endpoints match your Django setup
3. Check browser console for errors
4. Inspect Network tab for failed requests

---

**Built for SynapseOS Hackathon** | Deadline: 9 AM | 🧠 AI Learning Companion
