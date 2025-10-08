'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Plus, Search, X } from 'lucide-react'
import StageColumn from '@/components/StageColumn'
import NoteCard from '@/components/NoteCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filterColor, setFilterColor] = useState<string>('all')
  const [filterStage, setFilterStage] = useState<string>('all')
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

  const getFilteredNotes = () => {
    return notes.filter(note => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())

      // Color filter
      const matchesColor = filterColor === 'all' || note.color === filterColor

      // Stage filter
      const matchesStage = filterStage === 'all' || note.stage === filterStage

      return matchesSearch && matchesColor && matchesStage
    })
  }

  const getNotesByStage = (stageId: string) => {
    const filteredNotes = getFilteredNotes()
    return filteredNotes.filter(note => note.stage === stageId)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilterColor('all')
    setFilterStage('all')
  }

  const hasActiveFilters = searchQuery !== '' || filterColor !== 'all' || filterStage !== 'all'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sticky Notes Board
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Organize your tasks with drag and drop</p>
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
          </div>

          {/* Search and Filter Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex gap-4 items-center flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search notes by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <Select value={filterColor} onValueChange={setFilterColor}>
              <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Filter by color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colors</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="pink">Pink</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="purple">Purple</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStage} onValueChange={setFilterStage}>
              <SelectTrigger className="w-[180px] dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Filter by stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="dark:bg-gray-700 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {getFilteredNotes().length} of {notes.length} notes
            </div>
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
