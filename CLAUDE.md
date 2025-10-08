# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A sticky notes application built with Next.js 14 (App Router) featuring drag-and-drop Kanban board functionality, dark mode support, and persistent storage using Prisma with SQLite.

## Tech Stack

- **Framework**: Next.js 14.0.4 (App Router)
- **Database**: Prisma ORM with SQLite
- **UI**: Tailwind CSS with shadcn/ui components
- **Drag & Drop**: @dnd-kit (core, sortable, utilities)
- **Animation**: Framer Motion
- **State Management**: React hooks + localStorage for settings

## Development Commands

### Running the Application
```bash
npm run dev     # Start development server (default port 3000)
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

### Database Commands
```bash
npx prisma migrate dev    # Create and apply migrations
npx prisma studio         # Open Prisma Studio GUI
npx prisma generate       # Regenerate Prisma Client
```

## Architecture

### Database Schema (Prisma)

The application uses a single `Note` model with the following fields:
- `id`: Auto-incrementing integer primary key
- `title`: Note title (String)
- `content`: Note content (String)
- `color`: Note color (String, default: "yellow")
- `stage`: Kanban stage (String, default: "todo")
- `isDone`: Completion status (Boolean, default: false)
- `createdAt`: Timestamp (DateTime, auto-generated)

**Important**: The Prisma client is instantiated as a singleton in `/lib/prisma.ts` to prevent connection pool exhaustion in development.

### Kanban Board System

The app implements a 4-stage Kanban board:
1. **To Do** (stage: "todo")
2. **In Progress** (stage: "in-progress")
3. **Review** (stage: "review")
4. **Done** (stage: "done")

**Drag & Drop Flow**:
- Uses `@dnd-kit` with `PointerSensor` (8px activation distance)
- `handleDragStart`: Sets active note in state
- `handleDragOver`: Optimistically updates note stage in UI
- `handleDragEnd`: Persists stage change to database via PUT request

**Key Implementation Details**:
- Notes use `useSortable` hook from `@dnd-kit/sortable`
- Stage columns use `useDroppable` hook
- Each note's `id` is converted to string for DnD context
- The `DragOverlay` component shows a rotated copy during drag

### API Routes

Located in `/app/api/notes/`:

**GET /api/notes**
- Fetches all notes ordered by `createdAt` DESC
- Returns array of Note objects

**POST /api/notes**
- Creates new note
- Body: `{ title, content, color?, stage? }`
- Defaults: color="yellow", stage="todo"

**PUT /api/notes/[id]**
- Updates existing note (all fields)
- Used for both form edits and drag-drop stage updates

**DELETE /api/notes/[id]**
- Deletes note by ID

### Component Architecture

**Page Components** (`/app`):
- `page.tsx`: Main Kanban board with drag-drop context
- `notes/new/page.tsx`: Create new note form
- `notes/[id]/page.tsx`: Edit/view single note

**UI Components** (`/components`):
- `NoteCard.tsx`: Draggable note card with color gradients, uses `useSortable`
- `StageColumn.tsx`: Droppable column container, uses `useDroppable` and `SortableContext`
- `NoteForm.tsx`: Reusable form for create/edit operations
- `Settings.tsx`: Settings modal with 4 tabs (Appearance, Preferences, Notifications, Privacy)
- `SettingsButton.tsx`: Gear icon button to open settings
- `ui/*`: shadcn/ui components (Button, Card, Input, Select, Dialog, etc.)

**Hooks** (`/hooks`):
- `useSettings.ts`: Manages app settings with localStorage persistence

### Settings & Theme System

**Settings Structure** (stored in localStorage as "appSettings"):
```typescript
{
  appearance: { theme, fontSize, defaultNoteColor, compactView },
  preferences: { autoSave, confirmDelete, showTimestamps, sortBy },
  notifications: { enableNotifications, reminders, dailySummary },
  privacy: { analyticsEnabled, backupToCloud }
}
```

**Theme Implementation**:
- Dark mode uses class-based strategy (`dark:` Tailwind prefix)
- Theme persistence via localStorage
- FOUC prevention with inline script in `layout.tsx`
- Supports 3 modes: "light", "dark", "auto" (system preference)

### Color System

Note colors are predefined with gradient classes:
- `yellow`: from-yellow-100 to-yellow-200
- `pink`: from-pink-100 to-pink-200
- `blue`: from-blue-100 to-blue-200
- `green`: from-green-100 to-green-200
- `purple`: from-purple-100 to-purple-200

Dark mode variants automatically applied via Tailwind's `dark:` prefix.

## Common Patterns

### Fetching Notes
Always use `fetchNotes()` helper in page components:
```typescript
const fetchNotes = async () => {
  const response = await fetch('/api/notes')
  const data = await response.json()
  setNotes(data)
}
```

### Creating/Updating Notes
Use fetch with proper headers:
```typescript
await fetch('/api/notes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(noteData)
})
```

### Routing
Use Next.js `useRouter` from `next/navigation`:
```typescript
const router = useRouter()
router.push('/notes/new')
router.back()
```

## Database Location

SQLite database file: `/prisma/dev.db`

This is a local file that persists across restarts. Do not commit to version control.

## Important Notes

- Always regenerate Prisma Client after schema changes
- The app uses client-side components (`'use client'` directive) for interactivity
- Framer Motion animations are configured with reasonable defaults (0.2s duration)
- DnD sensors require 8px distance to prevent accidental drags during clicks
- Settings are client-side only (no database persistence)