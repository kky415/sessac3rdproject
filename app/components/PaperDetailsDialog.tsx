"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bookmark, BookOpen, ThumbsUp, ThumbsDown, Edit, Save } from "lucide-react"
import type { Paper, Note } from "../types"
import { usePaperContext } from "../PaperContext"
import { useUser } from "../UserContext"

interface PaperDetailsDialogProps {
  paper: Paper | null
  onOpenChange: (open: boolean) => void
}

export function PaperDetailsDialog({ paper, onOpenChange }: PaperDetailsDialogProps) {
  const {
    toggleRead,
    toggleBookmark,
    getPaperById,
    updateNoteVote,
    addPersonalNote,
    getPersonalNote,
    searchPapersByConcept,
    getUserVoteForNote,
    addNote,
    editNote,
  } = usePaperContext()
  const { user } = useUser()
  const [personalNote, setPersonalNote] = useState("")
  const [currentPaper, setCurrentPaper] = useState<Paper | null>(paper)
  const [searchResults, setSearchResults] = useState<Paper[]>([])
  const [summaryLanguage, setSummaryLanguage] = useState<"english" | "korean">("english")
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingNoteContent, setEditingNoteContent] = useState("")

  useEffect(() => {
    if (paper && user) {
      const updatedPaper = getPaperById(user.id, paper.id)
      if (updatedPaper) {
        setCurrentPaper(updatedPaper)
      }
    }
  }, [paper, user, getPaperById])

  const handleRelatedPaperClick = (id: number) => {
    if (!user) return
    const relatedPaper = getPaperById(user.id, id)
    if (relatedPaper) {
      onOpenChange(false)
      setTimeout(() => {
        onOpenChange(true)
        setCurrentPaper(relatedPaper)
      }, 0)
    }
  }

  const handleSavePersonalNote = () => {
    if (currentPaper && user) {
      addPersonalNote(user.id, currentPaper.id, personalNote)
      addNote(user.id, currentPaper.id, personalNote)
      setPersonalNote("") // Clear the input after saving

      // Update the currentPaper state with the new note
      const updatedPaper = getPaperById(user.id, currentPaper.id)
      if (updatedPaper) {
        setCurrentPaper(updatedPaper)
      }
    }
  }

  const handleEditNote = (noteId: number, content: string) => {
    setEditingNoteId(noteId)
    setEditingNoteContent(content)
  }

  const handleSaveEditedNote = () => {
    if (currentPaper && user && editingNoteId !== null) {
      editNote(user.id, currentPaper.id, editingNoteId, editingNoteContent)
      setEditingNoteId(null)
      setEditingNoteContent("")

      // Update the currentPaper state with the edited note
      const updatedPaper = getPaperById(user.id, currentPaper.id)
      if (updatedPaper) {
        setCurrentPaper(updatedPaper)
      }
    }
  }

  const handleConceptClick = (conceptName: string) => {
    if (user) {
      const results = searchPapersByConcept(user.id, conceptName)
      setSearchResults(results)
    }
  }

  useEffect(() => {
    if (paper && user) {
      const updatedPaper = getPaperById(user.id, paper.id) || paper
      setCurrentPaper(updatedPaper)
      const existingNote = getPersonalNote(user.id, paper.id)
      setPersonalNote(existingNote || "")
    }
  }, [paper, user, getPaperById, getPersonalNote])

  if (!currentPaper || !user) return null

  const userNote = currentPaper.notes.find((note) => note.author === user.id)
  const otherNotes = currentPaper.notes
    .filter((note) => note.author !== user.id)
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3)

  return (
    <Dialog open={!!currentPaper} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{currentPaper.title}</DialogTitle>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleRead(user.id, currentPaper.id)}
              className={currentPaper.isRead ? "text-green-500" : "text-gray-500"}
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => toggleBookmark(user.id, currentPaper.id)}
              className={currentPaper.isBookmarked ? "text-yellow-500" : "text-gray-500"}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4 overflow-y-auto flex-grow">
          <div>
            <h3 className="text-lg font-semibold">Summary</h3>
            <div className="flex space-x-2 mb-2">
              <Button
                variant={summaryLanguage === "english" ? "default" : "outline"}
                onClick={() => setSummaryLanguage("english")}
              >
                English
              </Button>
              <Button
                variant={summaryLanguage === "korean" ? "default" : "outline"}
                onClick={() => setSummaryLanguage("korean")}
              >
                한글
              </Button>
            </div>
            <p>{summaryLanguage === "english" ? currentPaper.summary : currentPaper.koreanSummary}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Notes</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-md font-semibold mb-2">Your Personal Note</h4>
                {userNote ? (
                  <div className="bg-gray-100 p-4 rounded-lg mb-2">
                    {editingNoteId === userNote.id ? (
                      <>
                        <Textarea
                          value={editingNoteContent}
                          onChange={(e) => setEditingNoteContent(e.target.value)}
                          className="mb-2"
                        />
                        <Button onClick={handleSaveEditedNote}>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <p>{userNote.content}</p>
                        <Button onClick={() => handleEditNote(userNote.id, userNote.content)} className="mt-2">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Textarea
                      value={personalNote}
                      onChange={(e) => setPersonalNote(e.target.value)}
                      placeholder="Add your personal note here..."
                      className="mb-2"
                    />
                    <Button onClick={handleSavePersonalNote}>Save Personal Note</Button>
                  </>
                )}
              </div>
              <div>
                <h4 className="text-md font-semibold">Top 3 Notes from Others</h4>
                {otherNotes.length === 0 ? (
                  <p>No notes from other users yet.</p>
                ) : (
                  otherNotes.map((note: Note) => (
                    <div key={note.id} className="bg-gray-100 p-4 rounded-lg mb-2">
                      <p>{note.content}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-500">
                          By {note.author} on {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateNoteVote(user.id, currentPaper.id, note.id, "upvote")}
                            className={getUserVoteForNote(user.id, note.id) === "upvote" ? "bg-green-100" : ""}
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {note.upvotes}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateNoteVote(user.id, currentPaper.id, note.id, "downvote")}
                            className={getUserVoteForNote(user.id, note.id) === "downvote" ? "bg-red-100" : ""}
                          >
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {note.downvotes}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Authors</h3>
            <p>{currentPaper.authors}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Published Date</h3>
            <p>{currentPaper.publishedDate}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Related Concepts</h3>
            <div className="flex flex-wrap gap-2">
              {currentPaper.relatedConcepts.map((concept, index) => (
                <button
                  key={index}
                  onClick={() => handleConceptClick(concept.name)}
                  className={`px-2 py-1 rounded-full text-sm ${
                    concept.isPrerequisite ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                  } hover:opacity-80 transition-opacity`}
                >
                  {concept.name}
                </button>
              ))}
            </div>
          </div>
          {searchResults.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Search Results</h3>
              <ul className="list-disc list-inside">
                {searchResults.map((paper) => (
                  <li key={paper.id}>
                    <button className="text-blue-600 hover:underline" onClick={() => handleRelatedPaperClick(paper.id)}>
                      {paper.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold">Abstract</h3>
            <p>{currentPaper.abstract}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Related Papers</h3>
            <ul className="list-disc list-inside">
              {currentPaper.relatedPapers.map((relatedPaper) => (
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

