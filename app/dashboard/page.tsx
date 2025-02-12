"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp, X, Bookmark } from "lucide-react"

interface Paper {
  id: number
  title: string
  author: string
  year: number
  category: string
  abstract: string
  doi: string
  journal: string
  citations: number
  keywords: string[]
}

interface Note {
  userId: number
  paperId: number
  noteContent: string
}

// Sample data for testing
const samplePapers: Paper[] = [
  {
    id: 1,
    title: "Machine Learning Algorithms",
    author: "John Doe",
    year: 2021,
    category: "AI",
    abstract: "This paper explores various machine learning algorithms and their applications in real-world scenarios.",
    doi: "10.1234/ml.2021.01",
    journal: "Journal of Artificial Intelligence",
    citations: 45,
    keywords: ["machine learning", "algorithms", "AI applications"],
  },
  {
    id: 2,
    title: "Quantum Computing Basics",
    author: "Jane Smith",
    year: 2020,
    category: "Quantum Physics",
    abstract:
      "An introduction to the fundamental concepts of quantum computing and its potential impact on computational power.",
    doi: "10.5678/qc.2020.02",
    journal: "Quantum Computing Review",
    citations: 32,
    keywords: ["quantum computing", "quantum physics", "computational power"],
  },
  {
    id: 3,
    title: "Climate Change Effects",
    author: "Bob Johnson",
    year: 2022,
    category: "Environmental Science",
    abstract: "A comprehensive study on the current and projected effects of climate change on global ecosystems.",
    doi: "10.9101/cc.2022.03",
    journal: "Environmental Science Journal",
    citations: 28,
    keywords: ["climate change", "global warming", "ecosystems"],
  },
  {
    id: 4,
    title: "Neural Networks in Practice",
    author: "Alice Brown",
    year: 2021,
    category: "AI",
    abstract:
      "This paper discusses practical implementations of neural networks in various industries and their performance.",
    doi: "10.1122/nn.2021.04",
    journal: "Applied AI Journal",
    citations: 37,
    keywords: ["neural networks", "deep learning", "AI applications"],
  },
  {
    id: 5,
    title: "Sustainable Energy Solutions",
    author: "Charlie Green",
    year: 2023,
    category: "Environmental Science",
    abstract:
      "An overview of emerging sustainable energy technologies and their potential to address global energy challenges.",
    doi: "10.3344/se.2023.05",
    journal: "Renewable Energy Studies",
    citations: 15,
    keywords: ["sustainable energy", "renewable energy", "green technology"],
  },
]

// Sample notes data
const sampleNotes: Note[] = [
  {
    userId: 1,
    paperId: 1,
    noteContent: "Interesting overview of ML algorithms. Follow up on section 3.2 about neural networks.",
  },
]

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
  const [papers, setPapers] = useState<Paper[]>(samplePapers)
  const [notes, setNotes] = useState<Note[]>(sampleNotes)
  const [currentNote, setCurrentNote] = useState("")

  // Assume we have a logged-in user with ID 1
  const currentUserId = 1

  useEffect(() => {
    setRecentlyReadPapers(papers.slice(0, 3))
  }, [papers])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const results = papers.filter((paper) => {
      const matchesKeyword =
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.keywords.some((keyword) => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesAuthor = author ? paper.author.toLowerCase().includes(author.toLowerCase()) : true
      const matchesYear = year ? paper.year.toString() === year : true
      const matchesCategory = category ? paper.category.toLowerCase().includes(category.toLowerCase()) : true

      return matchesKeyword && matchesAuthor && matchesYear && matchesCategory
    })
    setSearchResults(results)
  }

  const openPaperDetails = (paper: Paper) => {
    setSelectedPaper(paper)
    updateRecentlyRead(paper)
    const existingNote = notes.find((note) => note.userId === currentUserId && note.paperId === paper.id)
    setCurrentNote(existingNote ? existingNote.noteContent : "")
  }

  const closePaperDetails = () => {
    setSelectedPaper(null)
    setCurrentNote("")
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

  const saveNote = () => {
    if (selectedPaper) {
      setNotes((prevNotes) => {
        const existingNoteIndex = prevNotes.findIndex(
          (note) => note.userId === currentUserId && note.paperId === selectedPaper.id,
        )
        if (existingNoteIndex !== -1) {
          // Update existing note
          const updatedNotes = [...prevNotes]
          updatedNotes[existingNoteIndex] = { ...updatedNotes[existingNoteIndex], noteContent: currentNote }
          return updatedNotes
        } else {
          // Add new note
          return [...prevNotes, { userId: currentUserId, paperId: selectedPaper.id, noteContent: currentNote }]
        }
      })
    }
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
          </div>
        </div>
      )}
    </div>
  )
}

