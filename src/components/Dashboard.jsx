import React, { useState } from 'react'
import BrainMap from './BrainMap'
import Timeline from './Timeline'
import VideoProcessor from './VideoProcessor'
import SettingsPanel from './SettingsPanel'

function Dashboard({ activeTab = 'brain', onTabChange }) {
  const [internalTab, setInternalTab] = useState('brain')
  const currentTab = onTabChange ? activeTab : internalTab

  const setTab = (tabId) => {
    if (onTabChange) {
      onTabChange(tabId)
      return
    }
    setInternalTab(tabId)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b border-dark-border">
        {[
          { id: 'brain', label: 'Cognitive Brain Map' },
          { id: 'timeline', label: 'Study Timeline' },
          { id: 'video', label: 'Video Processor' },
          { id: 'settings', label: 'Settings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setTab(tab.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-all ${
              currentTab === tab.id
                ? 'border-neon-purple text-neon-purple'
                : 'border-transparent text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {currentTab === 'brain' && <BrainMap />}
        {currentTab === 'timeline' && <Timeline />}
        {currentTab === 'video' && <VideoProcessor />}
        {currentTab === 'settings' && <SettingsPanel />}
      </div>
    </div>
  )
}

export default Dashboard
