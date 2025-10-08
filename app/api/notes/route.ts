import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET all notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }
}

// POST create new note
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, content, color, stage } = body

    const note = await prisma.note.create({
      data: {
        title,
        content,
        color: color || 'yellow',
        stage: stage || 'todo'
      }
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}
