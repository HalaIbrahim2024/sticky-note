import { notFound } from 'next/navigation'
import NoteForm from '@/components/NoteForm'
import { prisma } from '@/lib/prisma'

async function getNote(id: string) {
  const note = await prisma.note.findUnique({
    where: { id: parseInt(id) }
  })
  return note
}

export default async function EditNotePage({ params }: { params: { id: string } }) {
  const note = await getNote(params.id)

  if (!note) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <NoteForm
        id={note.id}
        initialTitle={note.title}
        initialContent={note.content}
        initialColor={note.color}
        initialStage={note.stage}
        initialIsDone={note.isDone}
      />
    </div>
  )
}
