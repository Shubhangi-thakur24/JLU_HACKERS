import React, { useState } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Play, AlertCircle, Loader } from 'lucide-react'

function VideoProcessor() {
  const [videoUrl, setVideoUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [videoId, setVideoId] = useState('')

  const API_BASE = 'http://localhost:8000'

  const extractYoutubeId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
  }

  const handleProcess = async () => {
    if (!videoUrl.trim()) {
      setError('Please enter a YouTube URL')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)

      const id = extractYoutubeId(videoUrl)
      if (id) {
        setVideoId(id)
      }

      const response = await axios.post(`${API_BASE}/api/process-video/`, {
        url: videoUrl,
      })

      setResult(response.data)
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to process video')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleProcess()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Video Distillation Chamber</h2>
        <p className="text-gray-300 mt-1">Multimodal Processor</p>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Video Input & Player */}
        <div className="space-y-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-4 py-2 rounded-lg bg-dark-card border border-dark-border focus:border-neon-purple outline-none text-white placeholder-gray-400 transition-colors"
              />
              <button
                onClick={handleProcess}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-neon-purple text-black/90 font-bold hover:bg-neon-violet disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {loading ? <Loader size={18} className="animate-spin" /> : <Play size={18} />}
                Process
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

          {/* Video Player */}
          <div className="rounded-lg overflow-hidden bg-dark-card border border-dark-border aspect-video flex items-center justify-center">
            {videoId ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}`}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center text-gray-300">
                <Play size={48} className="mx-auto mb-2" />
                <p>Video will appear here</p>
              </div>
            )}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="p-4 rounded-lg bg-neon-amber/10 border border-neon-amber/30 flex items-center gap-3">
              <Loader size={20} className="text-neon-amber animate-spin" />
              <p className="text-neon-amber">Processing video...</p>
            </div>
          )}
        </div>

        {/* Right: Notes & Results */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-300">Structured Notes</label>

          {result ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 max-h-96 overflow-y-auto pr-2"
            >
              {/* Summary */}
              {result.summary && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-neon-emerald/10 border border-neon-emerald/30"
                >
                  <h3 className="font-bold text-neon-emerald mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-emerald"></span>
                    Summary
                  </h3>
                  <p className="text-sm text-gray-300">{result.summary}</p>
                </motion.div>
              )}

              {/* Key Points */}
              {result.key_points && result.key_points.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-neon-amber/10 border border-neon-amber/30"
                >
                  <h3 className="font-bold text-neon-amber mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-amber"></span>
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {result.key_points.map((point, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="text-neon-amber mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Concepts */}
              {result.concepts && result.concepts.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-neon-crimson/10 border border-neon-crimson/30"
                >
                  <h3 className="font-bold text-neon-crimson mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-neon-crimson"></span>
                    Concepts
                  </h3>
                  <div className="space-y-2">
                    {result.concepts.map((concept, idx) => (
                      <div key={idx} className="text-sm bg-dark-slate/50 p-2 rounded">
                        <p className="text-neon-crimson font-medium">{concept.name}</p>
                        {concept.description && (
                          <p className="text-gray-300 text-xs mt-1">{concept.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Timestamp Markers */}
              {result.timestamps && result.timestamps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-dark-slate border border-dark-border"
                >
                  <h3 className="font-bold text-gray-200 mb-3">Timeline</h3>
                  <div className="space-y-2">
                    {result.timestamps.map((ts, idx) => (
                      <div key={idx} className="text-xs flex items-center gap-2">
                        <span className="font-mono text-neon-emerald">{ts.time}</span>
                        <span className="text-gray-300">{ts.label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <div className="p-8 rounded-lg bg-dark-card border border-dark-border text-center text-gray-300 h-96 flex items-center justify-center">
              <div>
                <div className="text-4xl mb-2">Notes</div>
                <p>Process a video to see structured notes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoProcessor
