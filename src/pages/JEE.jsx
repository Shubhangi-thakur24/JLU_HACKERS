import React, { useState } from 'react'
import { ArrowLeft, BookOpen, Clock, Users, Target, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function JEE() {
  const navigate = useNavigate()
  const [selectedSubject, setSelectedSubject] = useState('physics')

  const subjects = {
    physics: {
      name: 'Physics',
      chapters: ['Mechanics', 'Thermodynamics', 'Electromagnetism', 'Modern Physics', 'Optics'],
      progress: 65,
      duration: '240 hrs',
    },
    chemistry: {
      name: 'Chemistry',
      chapters: ['Atomic Structure', 'Bonding', 'Thermodynamics', 'Organic Chemistry', 'Solutions'],
      progress: 45,
      duration: '200 hrs',
    },
    math: {
      name: 'Math',
      chapters: ['Algebra', 'Trigonometry', 'Calculus', 'Coordinate Geometry', 'Vectors'],
      progress: 78,
      duration: '260 hrs',
    },
  }

  const current = subjects[selectedSubject]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-slate to-dark-bg text-white p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/exam-selection')}
          className="flex items-center gap-2 text-neon-purple hover:text-neon-violet mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Exams
        </motion.button>

        {/* Title Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-neon-purple via-neon-violet to-purple-light bg-clip-text text-transparent">
            JEE Advanced
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">Master Engineering Entrance Exam</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {[
            { icon: Target, label: 'Rank Target', value: 'Top 1%', color: 'from-neon-purple to-neon-violet' },
            { icon: Clock, label: 'Total Hours', value: '700+', color: 'from-neon-violet to-purple-light' },
            { icon: Users, label: 'Students', value: '1.2M+', color: 'from-purple-light to-neon-purple' },
            { icon: BookOpen, label: 'Mock Tests', value: '50+', color: 'from-neon-amber to-neon-crimson' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-5 sm:p-6 rounded-xl bg-dark-card border border-neon-purple/35 hover:border-neon-purple/70 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
              <div className={`absolute right-0 top-0 h-full w-20 bg-gradient-to-l ${stat.color} opacity-10`}></div>
              <stat.icon size={28} className="text-neon-purple mb-3" />
              <p className="text-sm text-gray-300">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Subject Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8"
        >
          {/* Left: Subject Tabs */}
          <div className="lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-neon-purple">Subjects</h2>
            <div className="space-y-3">
              {Object.entries(subjects).map(([key, val]) => (
                <motion.button
                  key={key}
                  onClick={() => setSelectedSubject(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    selectedSubject === key
                      ? 'border-neon-purple bg-neon-purple/20'
                      : 'border-dark-border hover:border-neon-purple/50'
                  }`}
                >
                  <p className="font-bold text-neon-purple">{val.name}</p>
                  <p className="text-sm text-gray-300 mt-1">Progress: {val.progress}%</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Chapter Details */}
          <motion.div
            key={selectedSubject}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Progress Bar */}
            <div className="p-6 rounded-lg bg-dark-card border border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-neon-purple">{current.name} Progress</h3>
                <span className="text-2xl font-bold text-neon-purple">{current.progress}%</span>
              </div>
              <div className="w-full h-3 bg-dark-bg rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${current.progress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-neon-purple to-neon-violet rounded-full"
                />
              </div>
              <p className="text-gray-300 text-sm mt-3">Total Duration: {current.duration}</p>
            </div>

            {/* Chapters */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neon-purple mb-4">Chapters ({current.chapters.length})</h3>
              <div className="space-y-2">
                {current.chapters.map((chapter, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-lg bg-dark-card border border-dark-border hover:border-neon-purple/50 transition-all flex items-center gap-3 cursor-pointer group"
                  >
                    <CheckCircle size={20} className="text-neon-purple group-hover:text-neon-violet transition-colors" />
                    <span className="group-hover:text-neon-purple transition-colors">{chapter}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-lg bg-gradient-to-r from-neon-purple to-neon-violet text-dark-bg font-bold hover:shadow-lg transition-all"
              >
                Study Notes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 rounded-lg bg-gradient-to-r from-neon-amber to-neon-crimson text-dark-bg font-bold hover:shadow-lg transition-all"
              >
                Mock Test
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-violet/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default JEE
