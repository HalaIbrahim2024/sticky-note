'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import StageColumn from '@/components/StageColumn'
import NoteCard from '@/components/NoteCard'
import { Button } from '@/components/ui/button'
import Settings from '@/components/Settings'
import SettingsButton from '@/components/SettingsButton'
import { useSettings } from '@/hooks/useSettings'

interface Note {
  id: number
  title: string
  content: string
  color: string
  stage: string
  isDone: boolean
  createdAt: Date
}

const stages = [
  { id: 'todo', title: 'To Do', color: 'slate' },
  { id: 'in-progress', title: 'In Progress', color: 'blue' },
  { id: 'review', title: 'Review', color: 'amber' },
  { id: 'done', title: 'Done', color: 'green' }
]

export default function Home() {
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const { settings } = useSettings()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes')
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const note = notes.find(n => n.id.toString() === event.active.id)
    setActiveNote(note || null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id.toString()
    const overId = over.id.toString()

    const activeNote = notes.find(n => n.id.toString() === activeId)
    if (!activeNote) return

    // Check if dragging over a stage column
    let targetStage = stages.find(s => s.id === overId)

    // If not over a stage, check if over another note and get its stage
    if (!targetStage) {
      const overNote = notes.find(n => n.id.toString() === overId)
      if (overNote) {
        targetStage = stages.find(s => s.id === overNote.stage)
      }
    }

    if (targetStage && activeNote.stage !== targetStage.id) {
      setNotes(notes.map(note =>
        note.id.toString() === activeId
          ? { ...note, stage: targetStage.id }
          : note
      ))
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveNote(null)

    if (!over) return

    const activeId = active.id.toString()
    const activeNote = notes.find(n => n.id.toString() === activeId)
    if (!activeNote) return

    // Update the note in the database
    try {
      await fetch(`/api/notes/${activeNote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeNote)
      })
    } catch (error) {
      console.error('Failed to update note:', error)
      fetchNotes() // Refetch on error
    }
  }

  const getNotesByStage = (stageId: string) => {
    return notes.filter(note => note.stage === stageId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sticky Notes Board
            </h1>
            <p className="text-gray-600 mt-2">Organize your tasks with drag and drop</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button
              onClick={() => router.push('/notes/new')}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Note
            </Button>
            <SettingsButton onClick={() => setShowSettings(true)} />
          </div>
        </motion.div>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4">
            {stages.map(stage => (
              <StageColumn
                key={stage.id}
                stage={stage.id}
                title={stage.title}
                notes={getNotesByStage(stage.id)}
                color={stage.color}
              >
                {getNotesByStage(stage.id).map(note => (
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    content={note.content}
                    color={note.color}
                    stage={note.stage}
                    isDone={note.isDone}
                    onClick={() => router.push(`/notes/${note.id}`)}
                  />
                ))}
              </StageColumn>
            ))}
          </div>

          <DragOverlay>
            {activeNote ? (
              <div className="rotate-3">
                <NoteCard
                  id={activeNote.id}
                  title={activeNote.title}
                  content={activeNote.content}
                  color={activeNote.color}
                  stage={activeNote.stage}
                  isDone={activeNote.isDone}
                  onClick={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Settings Modal */}
        <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </div>
  )
}
