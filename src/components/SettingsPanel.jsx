import React, { useEffect, useState } from 'react'
import { Bell, Moon, User, Save } from 'lucide-react'

const SETTINGS_KEY = 'synapseSettings'

function SettingsPanel() {
  const [settings, setSettings] = useState({
    displayName: '',
    emailNotifications: true,
    studyReminders: true,
    compactMode: false,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const rawUser = localStorage.getItem('synapseUser')
    const rawSettings = localStorage.getItem(SETTINGS_KEY)

    let initialName = 'Learner'
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser)
        initialName = user.username || user.name || initialName
      } catch {
        initialName = 'Learner'
      }
    }

    if (rawSettings) {
      try {
        const parsed = JSON.parse(rawSettings)
        setSettings((prev) => ({ ...prev, ...parsed, displayName: parsed.displayName || initialName }))
        return
      } catch {
        // If parsing fails, fall back to user-derived defaults.
      }
    }

    setSettings((prev) => ({ ...prev, displayName: initialName }))
  }, [])

  const updateSetting = (key, value) => {
    setSaved(false)
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))

    const rawUser = localStorage.getItem('synapseUser')
    if (rawUser) {
      try {
        const user = JSON.parse(rawUser)
        const updatedUser = {
          ...user,
          username: settings.displayName || user.username || user.name || 'Learner',
          name: settings.displayName || user.name || 'Learner',
        }
        localStorage.setItem('synapseUser', JSON.stringify(updatedUser))
      } catch {
        // Ignore malformed user payload and keep settings save behavior.
      }
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div className="p-6 rounded-xl border border-dark-border bg-dark-card space-y-6">
      <div>
        <h3 className="text-2xl font-semibold text-neon-purple mb-1">Settings</h3>
        <p className="text-gray-300">Manage your profile and learning experience preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-dark-border bg-dark-slate/60">
          <label className="text-sm text-gray-300 mb-2 block">Display Name</label>
          <div className="relative">
            <User size={16} className="absolute left-3 top-3 text-neon-purple" />
            <input
              value={settings.displayName}
              onChange={(e) => updateSetting('displayName', e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-dark-bg border border-dark-border focus:border-neon-purple outline-none"
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="p-4 rounded-lg border border-dark-border bg-dark-slate/60">
          <p className="text-sm text-gray-300 mb-2">Interface</p>
          <label className="flex items-center justify-between py-2">
            <span className="flex items-center gap-2 text-gray-200"><Moon size={16} /> Compact Mode</span>
            <input
              type="checkbox"
              checked={settings.compactMode}
              onChange={(e) => updateSetting('compactMode', e.target.checked)}
              className="accent-neon-purple"
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg border border-dark-border bg-dark-slate/60">
          <label className="flex items-center justify-between py-2">
            <span className="flex items-center gap-2 text-gray-200"><Bell size={16} /> Email Notifications</span>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) => updateSetting('emailNotifications', e.target.checked)}
              className="accent-neon-purple"
            />
          </label>
        </div>

        <div className="p-4 rounded-lg border border-dark-border bg-dark-slate/60">
          <label className="flex items-center justify-between py-2">
            <span className="text-gray-200">Daily Study Reminders</span>
            <input
              type="checkbox"
              checked={settings.studyReminders}
              onChange={(e) => updateSetting('studyReminders', e.target.checked)}
              className="accent-neon-purple"
            />
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={saveSettings}
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-neon-purple to-neon-violet text-dark-bg font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save size={16} /> Save Settings
        </button>
        {saved && <span className="text-green-400 text-sm">Saved successfully</span>}
      </div>
    </div>
  )
}

export default SettingsPanel
