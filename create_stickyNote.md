# 📌 Sticky Notes App – Claude Plan

This file describes the full plan for building a **Sticky Notes App** using **Next.js + Prisma + SQLite + Tailwind CSS**.
Claude should use this plan to scaffold the application step by step.

---

## 1. Tech Stack

* **Next.js 14 (App Router)** – frontend & backend
* **Prisma** – ORM for database
* **SQLite** – local lightweight DB
* **Tailwind CSS** – styling

---

## 2. Database Schema (`prisma/schema.prisma`)

```prisma
model Note {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  color     String   @default("yellow")
  isDone    Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

## 3. Project Structure

```
sticky-notes-app/
│── prisma/
│   └── schema.prisma        # Prisma schema
│
│── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # List all notes (grid)
│   │
│   ├── api/
│   │   └── notes/
│   │       ├── route.ts     # POST/GET/DELETE/PUT notes
│   │
│   └── notes/
│       ├── new/page.tsx     # Create new note form
│       ├── [id]/page.tsx    # View/edit a single note
│
│── components/
│   ├── NoteCard.tsx         # Display a single note
│   └── NoteForm.tsx         # Form for creating/editing notes
│
│── styles/
│   └── globals.css          # Tailwind base styles
│
│── package.json
│── tailwind.config.js
│── postcss.config.js
│── tsconfig.json
│── .env                     # DATABASE_URL="file:./dev.db"
```

---

## 4. API Routes

* `GET /api/notes` → fetch all notes
* `POST /api/notes` → create a new note
* `PUT /api/notes/:id` → update note (title, content, color, isDone)
* `DELETE /api/notes/:id` → delete note

---

## 5. Core Features

✅ Add new notes
✅ Edit existing notes
✅ Mark notes as done/undone (toggle)
✅ Display notes in a grid layout
✅ Colorful sticky notes using Tailwind

---

## 6. Frontend Pages

* **Home (`/`)**

  * Show all notes in a grid
  * Each note is a `NoteCard`
* **New (`/notes/new`)**

  * Form to create new note
* **Edit (`/notes/[id]`)**

  * Form to edit existing note
  * Toggle `isDone`
  * Option to delete

---

## 7. Components

* **NoteCard**

  * Props: `id`, `title`, `content`, `color`, `isDone`
  * Displays note with background color
  * Shows "done" with strikethrough/fade
* **NoteForm**

  * Fields: `title`, `content`, `color dropdown`, `isDone checkbox`
  * Reused for create and edit

---

## 8. Styling (Tailwind)

* Notes styled like sticky notes:

  * `rounded-lg shadow-md p-4`
* Grid layout:

  * `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`
* Colors (`color` field):

  * `bg-yellow-200`, `bg-pink-200`, `bg-blue-200`, `bg-green-200`, `bg-purple-200`

---

## 9. Instructions for Claude

1. Generate Prisma schema and migration setup.
2. Build API routes in Next.js for CRUD operations.
3. Create `NoteCard` and `NoteForm` components.
4. Implement pages (`/`, `/notes/new`, `/notes/[id]`).
5. Style with Tailwind for a colorful sticky notes grid.
6. Ensure `isDone` toggle updates correctly.

---
