'use client'

import { motion } from 'framer-motion'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { GripVertical } from 'lucide-react'

interface NoteCardProps {
  id: number
  title: string
  content: string
  color: string
  stage: string
  isDone: boolean
  onClick: () => void
}

const colorClasses: { [key: string]: string } = {
  yellow: 'bg-gradient-to-br from-yellow-100 to-yellow-200 border-yellow-300',
  pink: 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-300',
  blue: 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300',
  green: 'bg-gradient-to-br from-green-100 to-green-200 border-green-300',
  purple: 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300'
}

export default function NoteCard({ id, title, content, color, stage, isDone, onClick }: NoteCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const colorClass = colorClasses[color] || colorClasses.yellow

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0, scale: isDragging ? 1.05 : 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02, rotate: isDragging ? 0 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`${colorClass} cursor-pointer hover:shadow-lg transition-all border-2 ${isDone ? 'opacity-60' : ''} ${isDragging ? 'shadow-2xl z-50' : ''}`}
        onClick={onClick}
      >
        <div className="p-4">
          <div className="flex items-start gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing mt-1 hover:bg-black/5 rounded p-1 transition-colors"
            >
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-bold text-lg mb-2 ${isDone ? 'line-through' : ''}`}>
                {title}
              </h3>
              <p className={`text-gray-700 whitespace-pre-wrap text-sm ${isDone ? 'line-through' : ''}`}>
                {content.length > 100 ? content.substring(0, 100) + '...' : content}
              </p>
              {isDone && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full"
                >
                  <span>✓</span> Done
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
