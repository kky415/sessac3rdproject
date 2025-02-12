import { NextResponse } from "next/server"
import { sampleNotes } from "@/lib/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const paperId = searchParams.get("paperId")

  if (!userId || !paperId) {
    return NextResponse.json({ error: "userId and paperId are required" }, { status: 400 })
  }

  const note = sampleNotes.find((note) => note.userId === Number(userId) && note.paperId === Number(paperId))

  return NextResponse.json(note || null)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newNote = {
    ...body,
    id: sampleNotes.length + 1,
  }
  sampleNotes.push(newNote)
  return NextResponse.json(newNote)
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { id, ...data } = body

  const noteIndex = sampleNotes.findIndex((note) => note.id === id)
  if (noteIndex !== -1) {
    sampleNotes[noteIndex] = { ...sampleNotes[noteIndex], ...data }
    return NextResponse.json(sampleNotes[noteIndex])
  }

  return NextResponse.json({ error: "Note not found" }, { status: 404 })
}

