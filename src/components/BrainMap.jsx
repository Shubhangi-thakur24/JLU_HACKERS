import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { RefreshCw, Zap, AlertCircle } from 'lucide-react'

function BrainMap() {
  const [concepts, setConcepts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [simulating, setSimulating] = useState(false)

  const API_BASE = 'http://localhost:8000'

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_BASE}/api/revisions/dashboard/`)
      setConcepts(response.data.revisions || [])
    } catch (err) {
      setError(err.message || 'Failed to fetch data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const simulateDay = async () => {
    try {
      setSimulating(true)
      await axios.post(`${API_BASE}/api/demo/simulate-day/`)
      // Refresh data after simulation
      await fetchDashboard()
    } catch (err) {
      setError(err.message || 'Simulation failed')
      console.error(err)
    } finally {
      setSimulating(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'due_today':
        return 'border-l-4 border-neon-amber bg-neon-amber/10'
      case 'overdue':
        return 'border-l-4 border-neon-crimson bg-neon-crimson/10'
      case 'future':
      default:
        return 'border-l-4 border-neon-emerald bg-neon-emerald/10'
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      due_today: { label: 'Due Today', bg: 'bg-neon-amber/20', text: 'text-neon-amber' },
      overdue: { label: 'Overdue', bg: 'bg-neon-crimson/20', text: 'text-neon-crimson' },
      future: { label: 'Future', bg: 'bg-neon-purple/20', text: 'text-neon-purple' },
    }
    const badge = badges[status] || badges.future
    return badge
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cognitive Brain Map</h2>
          <p className="text-gray-300 mt-1">Spaced Repetition System</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-dark-slate hover:bg-dark-border disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={simulateDay}
            disabled={simulating}
            className="px-4 py-2 rounded-lg bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            <Zap size={18} />
            Simulate Time
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-dark-card rounded-lg animate-pulse" />
          ))}
        </div>
      )}

      {/* Concepts Grid */}
      {!loading && concepts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {concepts.map((concept, index) => {
            const badge = getStatusBadge(concept.status)
            return (
              <motion.div
                key={concept.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-lg ${getStatusColor(concept.status)} hover:shadow-lg transition-shadow cursor-pointer border-l-4`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg flex-1">{concept.concept}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-3">{concept.topic}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-dark-bg/50 p-2 rounded">
                    <span className="text-gray-300">Interval</span>
                    <p className="font-mono">{concept.interval || '-'}</p>
                  </div>
                  <div className="bg-dark-bg/50 p-2 rounded">
                    <span className="text-gray-300">Repetitions</span>
                    <p className="font-mono">{concept.repetitions || 0}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && concepts.length === 0 && (
        <div className="p-12 rounded-lg bg-dark-card border border-dark-border text-center">
          <Brain size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-200">No concepts to review</p>
          <p className="text-sm text-gray-300 mt-2">Add topics to get started!</p>
        </div>
      )}
    </div>
  )
}

import { Brain } from 'lucide-react'
export default BrainMap
