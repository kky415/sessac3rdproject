import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Bookmark, BookOpen } from "lucide-react"
import type { Paper } from "../types"
import { usePaperContext } from "../PaperContext"

interface PaperDetailsDialogProps {
  paper: Paper | null
  onOpenChange: (open: boolean) => void
}

export function PaperDetailsDialog({ paper, onOpenChange }: PaperDetailsDialogProps) {
  const { toggleRead, toggleBookmark, getPaperById } = usePaperContext()

  const handleRelatedPaperClick = (id: number) => {
    const relatedPaper = getPaperById(id)
    if (relatedPaper) {
      onOpenChange(false)
      setTimeout(() => {
        onOpenChange(true)
      }, 0)
    }
  }

  if (!paper) return null

  return (
    <Dialog open={!!paper} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{paper.title}</DialogTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleRead(paper.id)}
              className={paper.isRead ? "text-green-500" : "text-gray-500"}
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleBookmark(paper.id)}
              className={paper.isBookmarked ? "text-yellow-500" : "text-gray-500"}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Authors</h3>
            <p>{paper.authors}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Published Date</h3>
            <p>{paper.publishedDate}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Summary</h3>
            <p>{paper.summary}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Related Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {paper.relatedConcepts.map((concept, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded-full text-sm ${
                    concept.isPrerequisite ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {concept.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Abstract</h3>
            <p>{paper.abstract}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Related Papers</h3>
            <ul className="list-disc list-inside">
              {paper.relatedPapers.map((relatedPaper) => (
                <li key={relatedPaper.id}>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleRelatedPaperClick(relatedPaper.id)}
                  >
                    {relatedPaper.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

