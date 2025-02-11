"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { usePaperContext } from "../PaperContext"
import { PaperDetailsDialog } from "../components/PaperDetailsDialog"
import type { Paper } from "../types"
import { useUser } from "../UserContext"

// Updated search function
function searchPapers(keyword: string, allPapers: Paper[]): Paper[] {
  const lowercasedKeyword = keyword.toLowerCase()
  return allPapers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(lowercasedKeyword) ||
      paper.authors.toLowerCase().includes(lowercasedKeyword) ||
      paper.abstract.toLowerCase().includes(lowercasedKeyword) ||
      paper.summary.toLowerCase().includes(lowercasedKeyword) ||
      paper.relatedConcepts.some((concept) => concept.name.toLowerCase().includes(lowercasedKeyword)),
  )
}

export default function SearchPage() {
  const [keyword, setKeyword] = useState("")
  const [searchResults, setSearchResults] = useState<Paper[]>([])
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const { user } = useUser()
  const { userPapers, addPaper } = usePaperContext()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    const results = searchPapers(keyword, userPapers[user.id] || [])
    setSearchResults(results)
    // Ensure all search results are added to the context
    results.forEach((paper) => addPaper(user.id, paper))
  }

  useEffect(() => {
    // Update search results when papers in context change
    if (user) {
      setSearchResults((prevResults) =>
        prevResults.map((paper) => {
          const updatedPaper = userPapers[user.id]?.find((p) => p.id === paper.id)
          return updatedPaper || paper
        }),
      )
    }
  }, [userPapers, user])

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
      {selectedPaper && (
        <PaperDetailsDialog paper={selectedPaper} onOpenChange={(open) => !open && setSelectedPaper(null)} />
      )}
    </div>
  )
}

