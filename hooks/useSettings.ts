'use client'

import { useState, useEffect } from 'react'

export interface AppSettings {
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

const defaultSettings: AppSettings = {
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

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appSettings')
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          console.error('Failed to parse settings:', e)
          return defaultSettings
        }
      }
    }
    return defaultSettings
  })

  useEffect(() => {
    const handleSettingsChange = (event: CustomEvent<AppSettings>) => {
      setSettings(event.detail)
    }

    window.addEventListener('settingsChanged', handleSettingsChange as EventListener)
    return () => window.removeEventListener('settingsChanged', handleSettingsChange as EventListener)
  }, [])

  const getSetting = <K extends keyof AppSettings>(
    category: K,
    key: keyof AppSettings[K]
  ): AppSettings[K][keyof AppSettings[K]] => {
    return settings[category][key]
  }

  const updateSetting = <K extends keyof AppSettings>(
    category: K,
    key: keyof AppSettings[K],
    value: AppSettings[K][keyof AppSettings[K]]
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [key]: value,
      },
    }
    setSettings(newSettings)
    if (typeof window !== 'undefined') {
      localStorage.setItem('appSettings', JSON.stringify(newSettings))
      window.dispatchEvent(new CustomEvent('settingsChanged', { detail: newSettings }))
    }
  }

  return {
    settings,
    getSetting,
    updateSetting,
  }
}
