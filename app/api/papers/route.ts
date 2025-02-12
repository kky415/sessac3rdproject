import { NextResponse } from "next/server"
import { samplePapers } from "@/lib/sample-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")
  const author = searchParams.get("author")
  const year = searchParams.get("year")
  const category = searchParams.get("category")

  let filteredPapers = samplePapers

  if (query) {
    filteredPapers = filteredPapers.filter(
      (paper) =>
        paper.title.toLowerCase().includes(query.toLowerCase()) ||
        paper.author.toLowerCase().includes(query.toLowerCase()) ||
        paper.keywords.some((keyword) => keyword.toLowerCase().includes(query.toLowerCase())),
    )
  }

  if (author) {
    filteredPapers = filteredPapers.filter((paper) => paper.author.toLowerCase().includes(author.toLowerCase()))
  }

  if (year) {
    filteredPapers = filteredPapers.filter((paper) => paper.year.toString() === year)
  }

  if (category) {
    filteredPapers = filteredPapers.filter((paper) => paper.category.toLowerCase().includes(category.toLowerCase()))
  }

  return NextResponse.json(filteredPapers)
}

export async function POST(request: Request) {
  const body = await request.json()
  const newPaper = {
    ...body,
    id: samplePapers.length + 1,
  }
  samplePapers.push(newPaper)
  return NextResponse.json(newPaper)
}

