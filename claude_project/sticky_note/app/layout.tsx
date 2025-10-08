import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Sticky Notes App',
  description: 'A simple sticky notes application built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
