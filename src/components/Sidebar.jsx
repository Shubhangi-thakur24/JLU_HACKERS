import React from 'react'
import { Brain, Clock, Video, Settings, LogOut } from 'lucide-react'

function Sidebar({ onClose, activeTab, onSelectTab, onLogout }) {
  const menuItems = [
    { icon: Brain, label: 'Brain Map', id: 'brain' },
    { icon: Clock, label: 'Study Timeline', id: 'timeline' },
    { icon: Video, label: 'Video Processor', id: 'video' },
    { icon: Settings, label: 'Settings', id: 'settings' },
  ]

  return (
    <div className="h-full bg-dark-card border-r border-dark-border flex flex-col p-6">
      {/* Logo */}
      <div className="mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-neon-purple to-neon-violet flex items-center justify-center">
            <Brain size={24} className="text-dark-bg" />
          </div>
          <h2 className="text-xl font-bold">PrepSaathi</h2>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onSelectTab(item.id)
              onClose()
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left group ${
              activeTab === item.id
                ? 'bg-neon-purple/15 text-neon-purple'
                : 'hover:bg-dark-slate'
            }`}
          >
            <item.icon
              size={20}
              className={activeTab === item.id ? 'text-neon-purple' : 'group-hover:text-neon-purple transition-colors'}
            />
            <span className={activeTab === item.id ? 'text-neon-purple' : 'group-hover:text-neon-purple transition-colors'}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-dark-border pt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-dark-slate transition-colors text-gray-300 hover:text-neon-crimson"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
