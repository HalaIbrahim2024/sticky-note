'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'

interface Note {
  id: number
  title: string
  content: string
  color: string
  stage: string
  isDone: boolean
}

interface StageColumnProps {
  stage: string
  title: string
  notes: Note[]
  color: string
  children: React.ReactNode
}

const stageColors: { [key: string]: { bg: string; border: string; text: string } } = {
  todo: {
    bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
    border: 'border-slate-300',
    text: 'text-slate-700'
  },
  'in-progress': {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-700'
  },
  review: {
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    border: 'border-amber-300',
    text: 'text-amber-700'
  },
  done: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    border: 'border-green-300',
    text: 'text-green-700'
  }
}

export default function StageColumn({ stage, title, notes, color, children }: StageColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage,
  })

  const colors = stageColors[stage] || stageColors.todo

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 min-w-[300px]"
    >
      <Card className={`h-full ${colors.bg} ${colors.border} border-2 transition-all ${isOver ? 'ring-4 ring-blue-400 ring-opacity-50 scale-[1.02]' : ''}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-xl font-bold ${colors.text}`}>
              {title}
            </h2>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`${colors.text} bg-white/60 px-3 py-1 rounded-full text-sm font-semibold`}
            >
              {notes.length}
            </motion.span>
          </div>

          <div
            ref={setNodeRef}
            className="space-y-3 min-h-[200px]"
          >
            <SortableContext
              items={notes.map(note => note.id.toString())}
              strategy={verticalListSortingStrategy}
            >
              {children}
            </SortableContext>

            {notes.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-32 text-gray-400 text-sm"
              >
                Drop notes here
              </motion.div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
