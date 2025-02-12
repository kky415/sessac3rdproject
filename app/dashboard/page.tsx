"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, X, Bookmark } from "lucide-react"
import type { Paper, Note } from "@/lib/sample-data"

// 코사인 유사도 계산 함수
function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dotProduct = vecA.reduce((acc, val, i) => acc + val * vecB[i], 0)
  const magnitudeA = Math.sqrt(vecA.reduce((acc, val) => acc + val * val, 0))
  const magnitudeB = Math.sqrt(vecB.reduce((acc, val) => acc + val * val, 0))
  return dotProduct / (magnitudeA * magnitudeB)
}

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [author, setAuthor] = useState("")
  const [year, setYear] = useState("")
  const [category, setCategory] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [searchResults, setSearchResults] = useState<Paper[]>([])
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const [bookmarkedPapers, setBookmarkedPapers] = useState<number[]>([])
  const [recentlyReadPapers, setRecentlyReadPapers] = useState<Paper[]>([])
  const [papers, setPapers] = useState<Paper[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState("")
  const [recommendedPapers, setRecommendedPapers] = useState<Paper[]>([])

  // Assume we have a logged-in user with ID 1
  const currentUserId = 1

  useEffect(() => {
    fetchPapers()
  }, [])

  useEffect(() => {
    setRecentlyReadPapers(papers.slice(0, 3))
  }, [papers])

  const fetchPapers = async () => {
    const response = await fetch("/api/papers")
    const data = await response.json()
    setPapers(data)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const queryParams = new URLSearchParams({
      query: searchQuery,
      author,
      year,
      category,
    }).toString()
    const response = await fetch(`/api/papers?${queryParams}`)
    const results = await response.json()
    setSearchResults(results)
  }

  const openPaperDetails = (paper: Paper) => {
    setSelectedPaper(paper)
    updateRecentlyRead(paper)
    fetchNote(paper.id)
    findSimilarPapers(paper)
  }

  const closePaperDetails = () => {
    setSelectedPaper(null)
    setCurrentNote("")
    setRecommendedPapers([])
  }

  const updateRecentlyRead = (paper: Paper) => {
    setRecentlyReadPapers((prevPapers) => {
      const updatedPapers = [paper, ...prevPapers.filter((p) => p.id !== paper.id)].slice(0, 3)
      return updatedPapers
    })
  }

  const toggleBookmark = (paperId: number) => {
    setBookmarkedPapers((prevBookmarks) =>
      prevBookmarks.includes(paperId) ? prevBookmarks.filter((id) => id !== paperId) : [...prevBookmarks, paperId],
    )
  }

  const saveNote = async () => {
    if (selectedPaper) {
      const noteData = {
        userId: currentUserId,
        paperId: selectedPaper.id,
        noteContent: currentNote,
      }

      const existingNote = notes.find((note) => note.userId === currentUserId && note.paperId === selectedPaper.id)

      if (existingNote) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...noteData, id: existingNote.id }),
        })
        const updatedNote = await response.json()
        setNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noteData),
        })
        const newNote = await response.json()
        setNotes((prevNotes) => [...prevNotes, newNote])
      }
    }
  }

  const fetchNote = async (paperId: number) => {
    const response = await fetch(`/api/notes?userId=${currentUserId}&paperId=${paperId}`)
    const data = await response.json()
    if (data) {
      setCurrentNote(data.noteContent)
    } else {
      setCurrentNote("")
    }
  }

  const findSimilarPapers = (paper: Paper) => {
    const similarities = papers
      .filter((p) => p.id !== paper.id)
      .map((p) => ({
        paper: p,
        similarity: cosineSimilarity(paper.paper_vector, p.paper_vector),
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)

    setRecommendedPapers(similarities.map((s) => s.paper))
  }

  return (
    <div className="min-h-screen p-8 relative">
      <h1 className="text-4xl font-bold mb-8">Research Paper Dashboard</h1>

      <form onSubmit={handleSearch} className="mb-8 space-y-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search papers by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-grow px-3 py-2 text-sm leading-tight text-gray-700 border rounded-l shadow appearance-none focus:outline-none focus:shadow-outline"
          />
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-3 py-2 text-sm font-bold text-white bg-blue-500 rounded-r hover:bg-blue-600 focus:outline-none focus:shadow-outline"
          >
            {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <input
              type="number"
              placeholder="Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:shadow-outline"
        >
          Search
        </button>
      </form>

      {searchResults.length > 0 ? (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <ul className="space-y-4">
            {searchResults.map((paper) => (
              <li
                key={paper.id}
                className="border p-4 rounded shadow cursor-pointer hover:bg-gray-50"
                onClick={() => openPaperDetails(paper)}
              >
                <h3 className="text-xl font-semibold">{paper.title}</h3>
                <p>Author: {paper.author}</p>
                <p>Year: {paper.year}</p>
                <p>Category: {paper.category}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No results found. Try adjusting your search criteria.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Recently Read Papers</h2>
          <ul className="space-y-2">
            {recentlyReadPapers.map((paper) => (
              <li key={paper.id} className="cursor-pointer hover:underline" onClick={() => openPaperDetails(paper)}>
                {paper.title} - {paper.author}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Bookmarked Papers</h2>
          <ul className="space-y-2">
            {papers
              .filter((paper) => bookmarkedPapers.includes(paper.id))
              .map((paper) => (
                <li key={paper.id} className="cursor-pointer hover:underline" onClick={() => openPaperDetails(paper)}>
                  {paper.title} - {paper.author}
                </li>
              ))}
          </ul>
        </div>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none focus:shadow-outline"
      >
        Logout
      </Link>

      {selectedPaper && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{selectedPaper.title}</h2>
              <div className="flex items-center">
                <button
                  onClick={() => toggleBookmark(selectedPaper.id)}
                  className={`mr-2 p-1 rounded ${bookmarkedPapers.includes(selectedPaper.id) ? "text-yellow-500" : "text-gray-500"} hover:bg-gray-100`}
                >
                  <Bookmark size={24} />
                </button>
                <button
                  onClick={closePaperDetails}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            <p>
              <strong>Author:</strong> {selectedPaper.author}
            </p>
            <p>
              <strong>Year:</strong> {selectedPaper.year}
            </p>
            <p>
              <strong>Category:</strong> {selectedPaper.category}
            </p>
            <p>
              <strong>Journal:</strong> {selectedPaper.journal}
            </p>
            <p>
              <strong>DOI:</strong> {selectedPaper.doi}
            </p>
            <p>
              <strong>Citations:</strong> {selectedPaper.citations}
            </p>
            <p>
              <strong>Keywords:</strong> {selectedPaper.keywords.join(", ")}
            </p>
            <p className="mt-4">
              <strong>Abstract:</strong>
            </p>
            <p>{selectedPaper.abstract}</p>
            <div className="mt-4">
              <p>
                <strong>Notes:</strong>
              </p>
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                className="w-full h-32 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add your notes here..."
              />
              <button
                onClick={saveNote}
                className="mt-2 px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600 focus:outline-none focus:shadow-outline"
              >
                Save Note
              </button>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-bold mb-2">Recommended Papers</h3>
              <ul className="space-y-2">
                {recommendedPapers.map((paper) => (
                  <li key={paper.id} className="cursor-pointer hover:underline" onClick={() => openPaperDetails(paper)}>
                    {paper.title} - {paper.author}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

