import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Clock, AlertCircle, RefreshCw, Zap } from 'lucide-react'

function Timeline() {
  const [schedule, setSchedule] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [failureLogging, setFailureLogging] = useState(false)

  const API_BASE = 'http://localhost:8000'

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      setLoading(true)
      setError(null)
      // Assuming an endpoint exists for schedule, adjust if needed
      const response = await axios.get(`${API_BASE}/api/revisions/dashboard/`)
      setSchedule(response.data.schedule || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch schedule')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const logMockTestFailure = async () => {
    try {
      setFailureLogging(true)
      // Simulate a failure by adjusting priorities
      await axios.post(`${API_BASE}/api/demo/simulate-day/`)
      await fetchSchedule()
    } catch (err) {
      setError(err.message || 'Failed to log failure')
      console.error(err)
    } finally {
      setFailureLogging(false)
    }
  }

  const getTimeColor = (hour) => {
    if (hour < 12) return 'border-neon-emerald'
    if (hour < 17) return 'border-neon-amber'
    return 'border-neon-crimson'
  }

  const getTimePeriod = (hour) => {
    if (hour < 12) return 'Morning'
    if (hour < 17) return 'Afternoon'
    return 'Evening'
  }

  // Mock schedule data if API returns empty
  const mockSchedule = [
    { id: 1, time: '09:00', duration: 45, topic: 'React Hooks', priority: 'high', status: 'future' },
    { id: 2, time: '10:00', duration: 30, topic: 'State Management', priority: 'high', status: 'overdue' },
    { id: 3, time: '11:30', duration: 45, topic: 'API Integration', priority: 'medium', status: 'future' },
    { id: 4, time: '14:00', duration: 60, topic: 'Performance Optimization', priority: 'medium', status: 'future' },
    { id: 5, time: '15:30', duration: 30, topic: 'Testing Strategies', priority: 'low', status: 'future' },
  ]

  const displaySchedule = schedule.length > 0 ? schedule : mockSchedule

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Timeline</h2>
          <p className="text-gray-300 mt-1">Auto-Rebalancing Study Blocks</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSchedule}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-dark-slate hover:bg-dark-border disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={logMockTestFailure}
            disabled={failureLogging}
            className="px-4 py-2 rounded-lg bg-neon-crimson/20 text-neon-crimson hover:bg-neon-crimson/30 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <Zap size={18} />
            Log Failure
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg bg-neon-crimson/10 border border-neon-crimson/30 flex items-start gap-3">
          <AlertCircle size={20} className="text-neon-crimson mt-1 flex-shrink-0" />
          <div>
            <p className="font-medium text-neon-crimson">Error</p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-dark-card rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Timeline */}
      {!loading && (
        <div className="space-y-3">
          {displaySchedule.map((block, index) => (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <div className={`border-l-4 ${getTimeColor(parseInt(block.time))} bg-dark-card rounded-r-lg p-4 hover:shadow-lg transition-shadow cursor-pointer group`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock size={18} className={`${getTimeColor(parseInt(block.time)).replace('border-', 'text-')}`} />
                      <span className="font-mono text-lg font-bold">{block.time}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        block.status === 'overdue'
                          ? 'bg-neon-crimson/20 text-neon-crimson'
                          : 'bg-neon-emerald/20 text-neon-emerald'
                      }`}>
                        {block.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-neon-emerald transition-colors">
                      {block.topic}
                    </h3>
                    <p className="text-sm text-gray-300">
                      {block.duration} minutes • Priority: <span className="capitalize text-neon-amber">{block.priority}</span>
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="inline-block px-3 py-1 rounded bg-dark-border text-xs font-mono">
                      {block.duration}m
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Summary */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-dark-border">
          <div className="p-4 rounded-lg bg-neon-emerald/10 border border-neon-emerald/20">
            <p className="text-sm text-gray-300">Total Time</p>
            <p className="text-2xl font-bold text-neon-emerald">
              {displaySchedule.reduce((sum, block) => sum + block.duration, 0)} min
            </p>
          </div>
          <div className="p-4 rounded-lg bg-neon-amber/10 border border-neon-amber/20">
            <p className="text-sm text-gray-300">Sessions</p>
            <p className="text-2xl font-bold text-neon-amber">{displaySchedule.length}</p>
          </div>
          <div className="p-4 rounded-lg bg-neon-crimson/10 border border-neon-crimson/20">
            <p className="text-sm text-gray-300">Overdue</p>
            <p className="text-2xl font-bold text-neon-crimson">
              {displaySchedule.filter(s => s.status === 'overdue').length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Timeline
