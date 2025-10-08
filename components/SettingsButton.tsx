'use client'

import React from 'react'
import { Settings as SettingsIcon } from 'lucide-react'

interface SettingsButtonProps {
  onClick: () => void
  className?: string
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 ${className}`}
      aria-label="Open settings"
      title="Settings"
    >
      <SettingsIcon
        className="w-6 h-6 text-gray-700 group-hover:rotate-90 transition-transform duration-300"
      />
    </button>
  )
}

export default SettingsButton
