"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
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

function PaperList({
  papers,
  title,
  onToggleRead,
  onToggleBookmark,
}: {
  papers: Paper[]
  title: string
  onToggleRead: (id: number) => void
  onToggleBookmark: (id: number) => void
}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)
  const itemsPerPage = 5
  const totalPages = Math.ceil(papers.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPapers = papers.slice(startIndex, endIndex)

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>
          {title} ({papers.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {papers.length === 0 ? (
          <p>No papers in this list.</p>
        ) : (
          <ul className="space-y-2">
            {currentPapers.map((paper) => (
              <li key={paper.id} className="border-b pb-2">
                <button
                  className="text-left w-full hover:bg-gray-100 p-2 rounded"
                  onClick={() => setSelectedPaper(paper)}
                >
                  <h3 className="font-semibold">{paper.title}</h3>
                  <p className="text-sm text-gray-600">{paper.authors}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      {totalPages > 1 && (
        <CardFooter className="flex justify-between">
          <Button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </CardFooter>
      )}
      <Dialog open={!!selectedPaper} onOpenChange={() => setSelectedPaper(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPaper?.title}</DialogTitle>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => selectedPaper && onToggleRead(selectedPaper.id)}
                className={selectedPaper?.isRead ? "text-green-500" : "text-gray-500"}
              >
                <BookOpen className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => selectedPaper && onToggleBookmark(selectedPaper.id)}
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
    </Card>
  )
}

export default function MainPage() {
  const router = useRouter()
  const { papers, toggleRead, toggleBookmark } = usePaperContext()

  const handleLogout = () => {
    router.push("/")
  }

  const recentlyReadPapers = papers.filter((paper) => paper.isRead)
  const bookmarkedPapers = papers.filter((paper) => paper.isBookmarked)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome to Paper Reader</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Link href="/search">
        <Button>Go to Search</Button>
      </Link>
      <PaperList
        papers={recentlyReadPapers}
        title="Recently Read Papers"
        onToggleRead={toggleRead}
        onToggleBookmark={toggleBookmark}
      />
      <PaperList
        papers={bookmarkedPapers}
        title="Bookmarked Papers"
        onToggleRead={toggleRead}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  )
}

