import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Zap, ArrowRight, BookOpen, Users, Target, GraduationCap, Stethoscope, Landmark } from 'lucide-react'

function ExamSelection() {
  const navigate = useNavigate()

  const exams = [
    {
      id: 'jee',
      name: 'JEE Advanced',
      title: 'Engineering Entrance',
      description: 'Master Math, Physics & Chemistry for Top Engineering Colleges',
      icon: GraduationCap,
      color: 'from-neon-purple to-neon-violet',
      stats: [
        { label: 'Colleges', value: '25K+' },
        { label: 'Questions', value: '10K+' },
        { label: 'Duration', value: '700+ hrs' },
      ],
      path: '/jee',
      accent: 'text-neon-purple',
      accentBorder: 'border-neon-purple/50',
      hoverTitleClass: 'group-hover:text-neon-purple',
    },
    {
      id: 'neet',
      name: 'NEET Medical',
      title: 'Medical Entrance',
      description: 'Science Excellence for AIIMS, JIPMER & Medical Schools',
      icon: Stethoscope,
      color: 'from-green-500 to-emerald-500',
      stats: [
        { label: 'Schools', value: '400+' },
        { label: 'Questions', value: '15K+' },
        { label: 'Duration', value: '650+ hrs' },
      ],
      path: '/neet',
      accent: 'text-green-400',
      accentBorder: 'border-green-400/50',
      hoverTitleClass: 'group-hover:text-green-300',
    },
    {
      id: 'upsc',
      name: 'UPSC IAS',
      title: 'Civil Services',
      description: 'Become an IAS Officer: Prepare for India\'s Most Prestigious Exam',
      icon: Landmark,
      color: 'from-orange-500 to-yellow-500',
      stats: [
        { label: 'Selected', value: '1100' },
        { label: 'Topics', value: '200+' },
        { label: 'Duration', value: '2-3 yrs' },
      ],
      path: '/upsc',
      accent: 'text-orange-400',
      accentBorder: 'border-orange-400/50',
      hoverTitleClass: 'group-hover:text-orange-300',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-slate to-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <motion.button
            onClick={() => navigate('/home')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-neon-purple to-neon-violet flex items-center justify-center">
              <Brain size={24} className="text-dark-bg" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-purple to-neon-violet bg-clip-text text-transparent">
              PrepSaathi
            </h1>
          </motion.button>
          <div className="text-sm text-gray-300">Choose Your Exam Path</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-neon-purple via-neon-violet to-purple-light bg-clip-text text-transparent">
            Choose Your Learning Path
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Select your exam and get personalized study plans, expert resources, and adaptive learning tailored to your goals.
          </p>
        </motion.div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {exams.map((exam, idx) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              onClick={() => navigate(exam.path)}
              className="cursor-pointer group"
            >
              {/* Card */}
              <div className={`relative h-full p-8 rounded-2xl bg-dark-card/90 border-2 border-dark-border ${exam.accentBorder} hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${exam.color} opacity-10 group-hover:opacity-20 transition-all duration-300`}></div>
                <div className="absolute top-0 left-0 right-0 h-1 bg-white/40"></div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col">
                  {/* Icon */}
                  <div className="mb-4">
                    <exam.icon size={42} className={exam.accent} />
                  </div>

                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-1 text-white ${exam.hoverTitleClass} transition-colors`}>
                    {exam.name}
                  </h3>
                  <p className={`text-sm ${exam.accent} font-medium mb-4`}>{exam.title}</p>

                  {/* Description */}
                  <p className="text-gray-100 text-sm mb-6 flex-1">{exam.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-t border-white/20">
                    {exam.stats.map((stat, i) => (
                      <div key={i} className="text-center bg-black/20 rounded-lg py-2">
                        <p className={`text-lg font-bold ${exam.accent}`}>{stat.value}</p>
                        <p className="text-xs text-gray-200">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 rounded-lg bg-gradient-to-r ${exam.color} text-black/90 font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all group/btn`}
                  >
                    <Zap size={20} />
                    Start Learning
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              icon: BookOpen,
              title: 'Comprehensive Resources',
              description: 'Access to curated study materials, video lectures, and practice questions.',
              color: 'from-neon-purple to-neon-violet',
            },
            {
              icon: Target,
              title: 'Smart Learning',
              description: 'AI-powered adaptive learning that adjusts to your pace and learning style.',
              color: 'from-neon-violet to-purple-light',
            },
            {
              icon: Users,
              title: 'Community Support',
              description: 'Connect with peers, join study groups, and get mentorship from experts.',
              color: 'from-purple-light to-neon-purple',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="p-6 rounded-lg bg-dark-card border border-dark-border/50 hover:border-neon-purple/50 transition-all group"
            >
              <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${feature.color} bg-opacity-20 mb-4`}>
                <feature.icon size={24} className="text-neon-purple" />
              </div>
              <h4 className="text-lg font-bold mb-2 group-hover:text-neon-purple transition-colors">
                {feature.title}
              </h4>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-violet/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  )
}

export default ExamSelection
