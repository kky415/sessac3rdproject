"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { usePaperContext } from "../PaperContext"
import { PaperDetailsDialog } from "../components/PaperDetailsDialog"
import type { Paper } from "../types"
import { useUser } from "../UserContext"

function PaperList({
  papers,
  title,
  onPaperClick,
}: {
  papers: Paper[]
  title: string
  onPaperClick: (paper: Paper) => void
}) {
  const [currentPage, setCurrentPage] = useState(1)
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
                <button className="text-left w-full hover:bg-gray-100 p-2 rounded" onClick={() => onPaperClick(paper)}>
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
    </Card>
  )
}

export default function MainPage() {
  const router = useRouter()
  const { user } = useUser()
  const { userPapers } = usePaperContext()
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null)

  const handleLogout = () => {
    router.push("/")
  }

  if (!user) {
    router.push("/")
    return null
  }

  const papers = userPapers[user.id] || []
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
      <PaperList papers={recentlyReadPapers} title="Recently Read Papers" onPaperClick={setSelectedPaper} />
      <PaperList papers={bookmarkedPapers} title="Bookmarked Papers" onPaperClick={setSelectedPaper} />
      {selectedPaper && (
        <PaperDetailsDialog paper={selectedPaper} onOpenChange={(open) => !open && setSelectedPaper(null)} />
      )}
    </div>
  )
}

