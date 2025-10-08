'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface AppSettings {
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    fontSize: 'small' | 'medium' | 'large' | 'x-large'
    defaultNoteColor: string
    compactView: boolean
  }
  preferences: {
    autoSave: boolean
    confirmDelete: boolean
    showTimestamps: boolean
    sortBy: 'modified' | 'created' | 'alphabetical' | 'color'
  }
  notifications: {
    enableNotifications: boolean
    reminders: boolean
    dailySummary: boolean
  }
  privacy: {
    analyticsEnabled: boolean
    backupToCloud: boolean
  }
}

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose }) => {
  const loadSettings = (): AppSettings => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appSettings')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      appearance: {
        theme: 'light',
        fontSize: 'medium',
        defaultNoteColor: '#fef08a',
        compactView: false,
      },
      preferences: {
        autoSave: true,
        confirmDelete: true,
        showTimestamps: true,
        sortBy: 'modified',
      },
      notifications: {
        enableNotifications: false,
        reminders: false,
        dailySummary: false,
      },
      privacy: {
        analyticsEnabled: false,
        backupToCloud: false,
      },
    }
  }

  const [settings, setSettings] = useState<AppSettings>(loadSettings)
  const [activeTab, setActiveTab] = useState('appearance')
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (hasChanges && typeof window !== 'undefined') {
      localStorage.setItem('appSettings', JSON.stringify(settings))
      window.dispatchEvent(new CustomEvent('settingsChanged', { detail: settings }))
    }
  }, [settings, hasChanges])

  const updateSetting = <K extends keyof AppSettings>(
    category: K,
    key: keyof AppSettings[K],
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
    setHasChanges(true)
  }

  const handleSave = () => {
    setHasChanges(false)
    onClose()
  }

  const handleReset = () => {
    if (typeof window !== 'undefined' && window.confirm('Are you sure you want to reset all settings to default? This cannot be undone.')) {
      localStorage.removeItem('appSettings')
      setSettings(loadSettings())
      setHasChanges(true)
    }
  }

  if (!isOpen) return null

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
  ]

  const ToggleSwitch: React.FC<{
    checked: boolean
    onChange: (checked: boolean) => void
    disabled?: boolean
  }> = ({ checked, onChange, disabled = false }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 peer-disabled:opacity-50"></div>
    </label>
  )

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <h2 id="settings-title" className="text-2xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
              aria-label="Close settings"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Navigation */}
          <nav className="w-48 bg-gray-50 border-r border-gray-200 p-4" aria-label="Settings navigation">
            <ul className="space-y-2">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                  >
                    <span className="text-xl" aria-hidden="true">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>

                  {/* Theme */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Theme
                    </label>
                    <div className="flex gap-3">
                      {(['light', 'dark', 'auto'] as const).map(theme => (
                        <button
                          key={theme}
                          onClick={() => updateSetting('appearance', 'theme', theme)}
                          className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                            settings.appearance.theme === theme
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          aria-pressed={settings.appearance.theme === theme}
                        >
                          <div className="font-medium capitalize">{theme}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size
                    </label>
                    <select
                      value={settings.appearance.fontSize}
                      onChange={e => updateSetting('appearance', 'fontSize', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                      <option value="x-large">Extra Large</option>
                    </select>
                  </div>

                  {/* Default Note Color */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Note Color
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {[
                        { color: '#fef08a', name: 'Yellow' },
                        { color: '#bbf7d0', name: 'Green' },
                        { color: '#bfdbfe', name: 'Blue' },
                        { color: '#fbcfe8', name: 'Pink' },
                        { color: '#fed7aa', name: 'Orange' },
                        { color: '#e9d5ff', name: 'Purple' },
                      ].map(({ color, name }) => (
                        <button
                          key={color}
                          onClick={() => updateSetting('appearance', 'defaultNoteColor', color)}
                          className={`w-12 h-12 rounded-lg border-2 transition-all ${
                            settings.appearance.defaultNoteColor === color
                              ? 'border-gray-800 scale-110'
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color }}
                          aria-label={`Set default color to ${name}`}
                          title={name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Compact View */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">Compact View</div>
                      <div className="text-sm text-gray-500">Show more notes on screen</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.appearance.compactView}
                      onChange={checked => updateSetting('appearance', 'compactView', checked)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Auto Save</div>
                      <div className="text-sm text-gray-500">Automatically save changes as you type</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.preferences.autoSave}
                      onChange={checked => updateSetting('preferences', 'autoSave', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Confirm Before Delete</div>
                      <div className="text-sm text-gray-500">Ask for confirmation when deleting notes</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.preferences.confirmDelete}
                      onChange={checked => updateSetting('preferences', 'confirmDelete', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Show Timestamps</div>
                      <div className="text-sm text-gray-500">Display creation and modification dates</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.preferences.showTimestamps}
                      onChange={checked => updateSetting('preferences', 'showTimestamps', checked)}
                    />
                  </div>

                  <div className="py-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Sort Order
                    </label>
                    <select
                      value={settings.preferences.sortBy}
                      onChange={e => updateSetting('preferences', 'sortBy', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="modified">Last Modified</option>
                      <option value="created">Date Created</option>
                      <option value="alphabetical">Alphabetical</option>
                      <option value="color">Color</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Enable Notifications</div>
                      <div className="text-sm text-gray-500">Receive browser notifications</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.notifications.enableNotifications}
                      onChange={checked => updateSetting('notifications', 'enableNotifications', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Reminders</div>
                      <div className="text-sm text-gray-500">Get reminded about your notes</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.notifications.reminders}
                      onChange={checked => updateSetting('notifications', 'reminders', checked)}
                      disabled={!settings.notifications.enableNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Daily Summary</div>
                      <div className="text-sm text-gray-500">Receive a daily summary of your notes</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.notifications.dailySummary}
                      onChange={checked => updateSetting('notifications', 'dailySummary', checked)}
                      disabled={!settings.notifications.enableNotifications}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Settings */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Data</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Analytics</div>
                      <div className="text-sm text-gray-500">Help improve the app by sharing usage data</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.privacy.analyticsEnabled}
                      onChange={checked => updateSetting('privacy', 'analyticsEnabled', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <div className="font-medium text-gray-900">Cloud Backup</div>
                      <div className="text-sm text-gray-500">Automatically backup notes to cloud storage</div>
                    </div>
                    <ToggleSwitch
                      checked={settings.privacy.backupToCloud}
                      onChange={checked => updateSetting('privacy', 'backupToCloud', checked)}
                    />
                  </div>

                  <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
                    <p className="text-sm text-red-700 mb-4">
                      These actions are permanent and cannot be undone.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete all notes? This action cannot be undone.')) {
                          // This would need to integrate with your API
                          console.log('Delete all notes')
                        }
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Delete All Notes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
