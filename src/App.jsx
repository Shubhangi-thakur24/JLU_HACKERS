import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Auth from './pages/Auth'
import Home from './pages/Home'
import ExamSelection from './pages/ExamSelection'
import JEE from './pages/JEE'
import NEET from './pages/NEET'
import UPSC from './pages/UPSC'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import './App.css'

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('brain')
  const [userName, setUserName] = useState('Learner')

  useEffect(() => {
    const syncUserName = () => {
      const raw = localStorage.getItem('synapseUser')
      if (!raw) {
        setUserName('Learner')
        return
      }
      try {
        const user = JSON.parse(raw)
        setUserName(user.username || user.name || 'Learner')
      } catch {
        setUserName('Learner')
      }
    }

    syncUserName()

    window.addEventListener('storage', syncUserName)
    document.addEventListener('visibilitychange', syncUserName)

    return () => {
      window.removeEventListener('storage', syncUserName)
      document.removeEventListener('visibilitychange', syncUserName)
    }
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem('synapseUser')
    if (!raw) {
      return
    }
    try {
      const user = JSON.parse(raw)
      setUserName(user.username || user.name || 'Learner')
    } catch {
      setUserName('Learner')
    }
  }, [activeTab])

  const handleLogout = () => {
    localStorage.removeItem('synapseUser')
    window.location.href = '/login'
  }

  return (
    <div className="flex h-screen bg-dark-bg text-white">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onLogout={handleLogout}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-dark-card border-b border-dark-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden hover:bg-dark-slate p-2 rounded"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-violet bg-clip-text text-transparent">
              PrepSaathi
            </h1>
          </div>
          <div className="text-sm text-gray-300">Welcome, {userName}</div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Dashboard activeTab={activeTab} onTabChange={setActiveTab} />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/home" element={<Home />} />
        <Route path="/exam-selection" element={<ExamSelection />} />
        <Route path="/jee" element={<JEE />} />
        <Route path="/neet" element={<NEET />} />
        <Route path="/upsc" element={<UPSC />} />
        <Route path="/dashboard" element={<AppLayout />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
