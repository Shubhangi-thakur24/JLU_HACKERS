import React, { useState } from 'react'
import { ArrowLeft, Map, FileText, Users, BarChart3, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function UPSC() {
  const navigate = useNavigate()
  const [selectedStage, setSelectedStage] = useState('prelims')

  const stages = {
    prelims: {
      name: 'Civil Services Prelims',
      subjects: ['Indian Polity', 'History', 'Geography', 'Economics', 'Science & Tech', 'Environment'],
      progress: 55,
      duration: '400 hrs',
      questions: '200 MCQs',
    },
    mains: {
      name: 'Civil Services Mains',
      subjects: ['Essay', 'General Studies I-IV', 'Optional Subject', 'Interview Prep'],
      progress: 30,
      duration: '600 hrs',
      questions: 'Descriptive',
    },
    interview: {
      name: 'Interview',
      subjects: ['Personality Test', 'IQ & Reasoning', 'Communication', 'General Knowledge'],
      progress: 10,
      duration: '200 hrs',
      questions: 'Face-to-Face',
    },
  }

  const current = stages[selectedStage]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-slate to-dark-bg text-white p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate('/exam-selection')}
          className="flex items-center gap-2 text-orange-400 hover:text-yellow-400 mb-8 transition-colors"
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-orange-400 via-yellow-400 to-amber-400 bg-clip-text text-transparent">
            UPSC IAS
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">Become an IAS Officer - Civil Services Elite</p>
        </motion.div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
          {[
            { icon: Award, label: 'Success Rate', value: '0.1%', color: 'from-orange-500 to-red-500' },
            { icon: Users, label: 'Aspirants', value: '9L+', color: 'from-yellow-500 to-orange-500' },
            { icon: BarChart3, label: 'Final Selected', value: '1100', color: 'from-amber-500 to-yellow-500' },
            { icon: Map, label: 'Avg. Duration', value: '2-3 yrs', color: 'from-red-500 to-pink-500' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-5 sm:p-6 rounded-xl bg-dark-card border border-orange-400/35 hover:border-orange-400/70 hover:shadow-lg transition-all overflow-hidden"
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${stat.color}`}></div>
              <div className={`absolute right-0 top-0 h-full w-20 bg-gradient-to-l ${stat.color} opacity-10`}></div>
              <stat.icon size={28} className="text-orange-400 mb-3" />
              <p className="text-sm text-gray-300">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-2 tracking-tight">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Stage Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8"
        >
          {/* Left: Stage Tabs */}
          <div className="lg:col-span-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-orange-400">Exam Stages</h2>
            <div className="space-y-3">
              {Object.entries(stages).map(([key, val]) => (
                <motion.button
                  key={key}
                  onClick={() => setSelectedStage(key)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${
                    selectedStage === key
                      ? 'border-orange-400 bg-orange-400/20'
                      : 'border-dark-border hover:border-orange-400/50'
                  }`}
                >
                  <p className="font-bold text-orange-400">{val.name}</p>
                  <p className="text-sm text-gray-300 mt-1">Progress: {val.progress}%</p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Right: Stage Details */}
          <motion.div
            key={selectedStage}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Stage Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: 'Duration', value: current.duration },
                { label: 'Format', value: current.questions },
                { label: 'Progress', value: `${current.progress}%` },
              ].map((info, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-lg bg-dark-card border border-dark-border text-center"
                >
                  <p className="text-sm text-gray-300">{info.label}</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-400 mt-2">{info.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Progress Bar */}
            <div className="p-6 rounded-lg bg-dark-card border border-dark-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-orange-400">Completion Status</h3>
                <span className="text-2xl font-bold text-orange-400">{current.progress}%</span>
              </div>
              <div className="w-full h-4 bg-dark-bg rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${current.progress}%` }}
                  transition={{ duration: 0.8 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"
                />
              </div>
            </div>

            {/* Subject List */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-orange-400 mb-4">Key Topics ({current.subjects.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.subjects.map((subject, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-3 rounded-lg bg-dark-card border border-dark-border hover:border-orange-400/50 transition-all flex items-center gap-2 cursor-pointer group"
                  >
                    <FileText size={18} className="text-orange-400 group-hover:text-yellow-400 transition-colors" />
                    <span className="text-sm group-hover:text-orange-400 transition-colors">{subject}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-gradient-to-r from-orange-500 to-yellow-500 text-dark-bg font-bold hover:shadow-lg"
              >
                Study Material
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-4 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-dark-bg font-bold hover:shadow-lg"
              >
                Practice Test
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default UPSC
