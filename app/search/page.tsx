"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Bookmark, BookOpen } from "lucide-react"
import { usePaperContext } from "../PaperContext"

interface Paper {
  id: number
  title: string
  authors: string
  abstract: string
  publishedDate: string
  isRead: boolean
  isBookmarked: boolean
}

// Mock function to simulate paper search
function searchPapers(keyword: string): Paper[] {
  // In a real application, this would be an API call
  return [
    {
      id: Date.now(),
      title: `Paper about ${keyword} 1`,
      authors: "Author A, Author B",
      abstract: "This is the abstract for Paper 1...",
      publishedDate: "2023-05-01",
      isRead: false,
      isBookmarked: false,
    },
    {
      id: Date.now() + 1,
      title: `Paper about ${keyword} 2`,
      authors: "Author C, Author D",
      abstract: "This is the abstract for Paper 2...",
      publishedDate: "2023-04-15",
      isRead: false,
      isBookmarked: false,
    },
    {
      id: Date.now() + 2,
      title: `Paper about ${keyword} 3`,
      authors: "Author E, Author F",
      abstract: "This is the abstract for Paper 3...",
      publishedDate: "2023-03-20",
      isRead: false,
      isBookmarked: false,
    },
  ]
}

export default function SearchPage() {
  const [keyword, setKeyword] = useState("")
  const [searchResults, setSearchResults] = useState<Paper[]>([])
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const { papers, toggleRead, toggleBookmark, addPaper } = usePaperContext()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const results = searchPapers(keyword)
    setSearchResults(results)
    results.forEach((paper) => addPaper(paper))
  }

  useEffect(() => {
    // Update search results when papers in context change
    setSearchResults((prevResults) =>
      prevResults.map((paper) => {
        const updatedPaper = papers.find((p) => p.id === paper.id)
        return updatedPaper || paper
      }),
    )
  }, [papers])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Search Papers</h1>
      <Link href="/main">
        <Button variant="outline">Back to Main</Button>
      </Link>
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword"
          className="flex-grow"
        />
        <Button type="submit">Search</Button>
      </form>
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {searchResults.map((paper) => (
                <li key={paper.id} className="border-b pb-2">
                  <button
                    className="text-left w-full hover:bg-gray-100 p-2 rounded"
                    onClick={() => setSelectedPaper(paper)}
                  >
                    <h3 className="font-semibold">{paper.title}</h3>
                    <p className="text-sm text-gray-600">{paper.authors}</p>
                    <p className="text-xs text-gray-500">Published: {paper.publishedDate}</p>
                    <div className="mt-1">
                      {paper.isRead && <span className="text-green-500 mr-2">Read</span>}
                      {paper.isBookmarked && <span className="text-yellow-500">Bookmarked</span>}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPaper?.title}</DialogTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => selectedPaper && toggleRead(selectedPaper.id)}
                className={selectedPaper?.isRead ? "text-green-500" : "text-gray-500"}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => selectedPaper && toggleBookmark(selectedPaper.id)}
                className={selectedPaper?.isBookmarked ? "text-yellow-500" : "text-gray-500"}
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="mt-2">
            <div className="text-sm text-gray-600 mb-2">{selectedPaper?.authors}</div>
            <div className="text-sm text-gray-600 mb-4">Published: {selectedPaper?.publishedDate}</div>
            <div className="text-sm">{selectedPaper?.abstract}</div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

