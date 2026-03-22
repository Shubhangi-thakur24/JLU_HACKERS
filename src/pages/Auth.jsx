import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react'

function Auth() {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    if (!isLogin) {
      if (!formData.name) {
        setError('Please enter your name')
        setLoading(false)
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }
    }

    // Simulate API call
    setTimeout(() => {
      // Store user data in localStorage
      const resolvedName = formData.name || formData.email.split('@')[0]
      const user = {
        username: resolvedName,
        name: resolvedName,
        email: formData.email,
        loggedIn: true,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem('synapseUser', JSON.stringify(user))
      
      setLoading(false)
      navigate('/home')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-slate to-dark-bg flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-neon-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-violet/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-neon-purple to-neon-violet flex items-center justify-center shadow-lg">
                <Brain size={32} className="text-dark-bg" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">PrepSaathi</h1>
            <p className="text-gray-300">AI Learning Companion</p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-2 mb-8 bg-dark-bg rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                isLogin
                  ? 'bg-neon-purple text-dark-bg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md font-medium transition-all ${
                !isLogin
                  ? 'bg-neon-purple text-dark-bg'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-neon-purple outline-none text-white placeholder-gray-600 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-neon-purple outline-none text-white placeholder-gray-600 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-neon-purple outline-none text-white placeholder-gray-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password (Signup only) */}
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-dark-bg border border-dark-border focus:border-neon-purple outline-none text-white placeholder-gray-600 transition-colors"
                  />
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-neon-crimson/10 border border-neon-crimson/30"
              >
                <p className="text-sm text-neon-crimson">{error}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-neon-purple to-neon-violet text-dark-bg font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-dark-bg border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  {isLogin ? 'Login' : 'Create Account'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo Mode */}
          <div className="mt-6 p-4 rounded-lg bg-dark-bg border border-dark-border border-dashed">
            <p className="text-xs text-gray-300 mb-2">Demo Mode - Quick Login:</p>
            <button
              onClick={() => {
                setFormData({
                  email: 'demo@synapse.ai',
                  password: 'demo123',
                  name: 'Demo User',
                  confirmPassword: 'demo123',
                })
              }}
              className="text-xs text-neon-purple hover:text-neon-violet transition-colors"
            >
              Fill Demo Credentials
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-300 text-sm mt-6">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-purple hover:text-neon-violet font-medium transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}

export default Auth
