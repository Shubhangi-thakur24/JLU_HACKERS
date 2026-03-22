import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Clock, Video, LogOut, Settings, BookOpen, Zap } from 'lucide-react'

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  const displayName = user?.username || user?.name || 'Learner'

  useEffect(() => {
    const userData = localStorage.getItem('synapseUser')
    if (!userData) {
      navigate('/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('synapseUser')
    navigate('/login')
  }

  const features = [
    {
      icon: Brain,
      title: 'Cognitive Brain Map',
      description: 'Spaced Repetition System for efficient learning',
      color: 'from-neon-purple to-neon-violet',
      link: '/dashboard',
    },
    {
      icon: Clock,
      title: 'Study Timeline',
      description: 'Auto-rebalancing study blocks optimized for you',
      color: 'from-neon-violet to-purple-light',
      link: '/dashboard',
    },
    {
      icon: Video,
      title: 'Video Processor',
      description: 'Transform videos into structured learning notes',
      color: 'from-purple-light to-neon-purple',
      link: '/dashboard',
    },
  ]

  const stats = [
    { label: 'Concepts Learned', value: '24' },
    { label: 'Study Streak', value: '7 days' },
    { label: 'Time Invested', value: '12.5h' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-slate to-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-neon-purple to-neon-violet flex items-center justify-center">
              <Brain size={24} className="text-dark-bg" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-violet bg-clip-text text-transparent">
              PrepSaathi
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-gray-300">{user?.email}</p>
            </div>
            <button
              onClick={() => navigate('/exam-selection')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-violet text-dark-bg font-bold hover:shadow-lg transition-all text-sm"
            >
              Exams
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-dark-border transition-colors text-gray-400 hover:text-neon-crimson"
            >
              <LogOut size={20} />
            </button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <h2 className="text-5xl font-bold mb-4">
            Welcome back, <span className="bg-gradient-to-r from-neon-purple to-neon-violet bg-clip-text text-transparent">{displayName.split(' ')[0]}</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Ready to accelerate your learning? Let's dive into today's study plan.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="p-4 rounded-lg bg-dark-card border border-dark-border hover:border-neon-purple transition-all"
              >
                <p className="text-sm text-gray-300">{stat.label}</p>
                <p className="text-2xl font-bold text-neon-purple mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-violet text-dark-bg font-bold rounded-lg hover:shadow-2xl transition-all flex items-center gap-2"
          >
            <Zap size={20} />
            Go to Dashboard
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold mb-8">Your Learning Tools</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                onClick={() => navigate(feature.link)}
                className="group cursor-pointer"
              >
                <div className="h-full p-6 rounded-xl bg-gradient-to-br from-dark-card to-dark-slate border border-dark-border hover:border-neon-emerald transition-all">
                  <div className={`w-14 h-14 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:shadow-lg transition-all`}>
                    <feature.icon size={28} className="text-dark-bg" />
                  </div>
                  <h4 className="text-xl font-bold mb-2 group-hover:text-neon-purple transition-colors">
                    {feature.title}
                  </h4>
                  <p className="text-gray-300 mb-4">{feature.description}</p>
                  <div className="flex items-center gap-2 text-neon-purple opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-medium">Go to Tool</span>
                    <span>{'>'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-8 rounded-xl bg-gradient-to-r from-neon-purple/10 to-neon-violet/10 border border-neon-purple/20"
        >
          <div className="flex gap-4">
            <BookOpen size={24} className="text-neon-purple flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-xl font-bold mb-2">Pro Tip</h4>
              <p className="text-gray-300">
                Use the Video Processor to convert your course materials into comprehensive study notes. It uses AI to extract key concepts and organize them for spaced repetition.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-violet/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default Home
