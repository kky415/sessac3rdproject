"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { type Paper, mockPapers, type Note } from "./types"
import { useUser } from "./UserContext"

interface UserVotes {
  [userId: string]: {
    [noteId: number]: "upvote" | "downvote" | null
  }
}

interface PaperContextType {
  papers: Paper[]
  userPapers: { [userId: string]: Paper[] }
  setPapers: React.Dispatch<React.SetStateAction<Paper[]>>
  setUserPapers: React.Dispatch<React.SetStateAction<{ [userId: string]: Paper[] }>>
  toggleRead: (userId: string, id: number) => void
  toggleBookmark: (userId: string, id: number) => void
  addPaper: (userId: string, paper: Paper) => void
  getPaperById: (userId: string, id: number) => Paper | undefined
  updateNoteVote: (userId: string, paperId: number, noteId: number, voteType: "upvote" | "downvote") => void
  addPersonalNote: (userId: string, paperId: number, content: string) => void
  getPersonalNote: (userId: string, paperId: number) => string | null
  searchPapersByConcept: (userId: string, conceptName: string) => Paper[]
  getUserVoteForNote: (userId: string, noteId: number) => "upvote" | "downvote" | null
  loadUserData: (userId: number) => void
  addNote: (userId: string, paperId: number, noteContent: string) => void
  editNote: (userId: string, paperId: number, noteId: number, newContent: string) => void
}

const PaperContext = createContext<PaperContextType | undefined>(undefined)

export function PaperProvider({ children }: { children: React.ReactNode }) {
  const [papers, setPapers] = useState<Paper[]>(mockPapers)
  const [userPapers, setUserPapers] = useState<{ [userId: string]: Paper[] }>({})
  const [personalNotes, setPersonalNotes] = useState<{ [userId: string]: { [paperId: number]: string } }>({})
  const [userVotes, setUserVotes] = useState<UserVotes>({})
  const { user } = useUser()

  useEffect(() => {
    // Load papers from localStorage on initial render
    const storedPapers = localStorage.getItem("papers")
    if (storedPapers) {
      setPapers(JSON.parse(storedPapers))
    }
    // Load user papers from localStorage
    const storedUserPapers = localStorage.getItem("userPapers")
    if (storedUserPapers) {
      setUserPapers(JSON.parse(storedUserPapers))
    }
    // Load user votes from localStorage
    const storedVotes = localStorage.getItem("userVotes")
    if (storedVotes) {
      setUserVotes(JSON.parse(storedVotes))
    }
    // Load personal notes from localStorage
    const storedNotes = localStorage.getItem("personalNotes")
    if (storedNotes) {
      setPersonalNotes(JSON.parse(storedNotes))
    }
  }, [])

  useEffect(() => {
    // Save papers to localStorage whenever it changes
    localStorage.setItem("papers", JSON.stringify(papers))
  }, [papers])

  useEffect(() => {
    // Save user papers to localStorage whenever it changes
    localStorage.setItem("userPapers", JSON.stringify(userPapers))
  }, [userPapers])

  useEffect(() => {
    // Save user votes to localStorage whenever it changes
    localStorage.setItem("userVotes", JSON.stringify(userVotes))
  }, [userVotes])

  useEffect(() => {
    // Save personal notes to localStorage whenever it changes
    localStorage.setItem("personalNotes", JSON.stringify(personalNotes))
  }, [personalNotes])

  const loadUserData = (userId: number) => {
    if (!userPapers[userId]) {
      setUserPapers((prev) => ({ ...prev, [userId]: [...papers] }))
    }
  }

  const toggleRead = (userId: string, id: number) => {
    setUserPapers((prevUserPapers) => ({
      ...prevUserPapers,
      [userId]: prevUserPapers[userId].map((paper) => (paper.id === id ? { ...paper, isRead: !paper.isRead } : paper)),
    }))
  }

  const toggleBookmark = (userId: string, id: number) => {
    setUserPapers((prevUserPapers) => ({
      ...prevUserPapers,
      [userId]: prevUserPapers[userId].map((paper) =>
        paper.id === id ? { ...paper, isBookmarked: !paper.isBookmarked } : paper,
      ),
    }))
  }

  const addPaper = (userId: string, paper: Paper) => {
    setUserPapers((prevUserPapers) => {
      const userPaperList = prevUserPapers[userId] || []
      if (!userPaperList.some((p) => p.id === paper.id)) {
        return { ...prevUserPapers, [userId]: [...userPaperList, paper] }
      }
      return prevUserPapers
    })
  }

  const getPaperById = (userId: string, id: number) => {
    return userPapers[userId]?.find((paper) => paper.id === id)
  }

  const updateNoteVote = (userId: string, paperId: number, noteId: number, voteType: "upvote" | "downvote") => {
    if (!user) return // Ensure user is logged in

    const previousVote = userVotes[userId]?.[noteId] || null

    setUserVotes((prevVotes) => ({
      ...prevVotes,
      [userId]: {
        ...prevVotes[userId],
        [noteId]: voteType === previousVote ? null : voteType,
      },
    }))

    setUserPapers((prevUserPapers) => ({
      ...prevUserPapers,
      [userId]: prevUserPapers[userId].map((paper) => {
        if (paper.id === paperId) {
          return {
            ...paper,
            notes: paper.notes.map((note) => {
              if (note.id === noteId) {
                let upvotes = note.upvotes
                let downvotes = note.downvotes

                if (previousVote === "upvote" && voteType === "downvote") {
                  upvotes--
                  downvotes++
                } else if (previousVote === "downvote" && voteType === "upvote") {
                  upvotes++
                  downvotes--
                } else if (previousVote === null) {
                  if (voteType === "upvote") upvotes++
                  else downvotes++
                } else if (voteType === null) {
                  if (previousVote === "upvote") upvotes--
                  else downvotes--
                }

                return {
                  ...note,
                  upvotes,
                  downvotes,
                }
              }
              return note
            }),
          }
        }
        return paper
      }),
    }))
  }

  const addPersonalNote = (userId: string, paperId: number, content: string) => {
    setPersonalNotes((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [paperId]: content,
      },
    }))
  }

  const getPersonalNote = (userId: string, paperId: number) => {
    return personalNotes[userId]?.[paperId] || null
  }

  const searchPapersByConcept = (userId: string, conceptName: string) => {
    return (
      userPapers[userId]?.filter((paper) =>
        paper.relatedConcepts.some((concept) => concept.name.toLowerCase() === conceptName.toLowerCase()),
      ) || []
    )
  }

  const getUserVoteForNote = (userId: string, noteId: number) => {
    return userVotes[userId]?.[noteId] || null
  }

  const addNote = (userId: string, paperId: number, noteContent: string) => {
    const newNote: Note = {
      id: Date.now(), // Use timestamp as a simple unique id
      content: noteContent,
      author: userId, // Use userId as the author
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
    }

    setUserPapers((prevUserPapers) => ({
      ...prevUserPapers,
      [userId]: prevUserPapers[userId].map((paper) => {
        if (paper.id === paperId) {
          return {
            ...paper,
            notes: [...paper.notes, newNote],
          }
        }
        return paper
      }),
    }))

    // Add the note to the global paper state
    setPapers((prevPapers) =>
      prevPapers.map((paper) => (paper.id === paperId ? { ...paper, notes: [...paper.notes, newNote] } : paper)),
    )
  }

  const editNote = (userId: string, paperId: number, noteId: number, newContent: string) => {
    setUserPapers((prevUserPapers) => ({
      ...prevUserPapers,
      [userId]: prevUserPapers[userId].map((paper) => {
        if (paper.id === paperId) {
          return {
            ...paper,
            notes: paper.notes.map((note) => (note.id === noteId ? { ...note, content: newContent } : note)),
          }
        }
        return paper
      }),
    }))
  }

  return (
    <PaperContext.Provider
      value={{
        papers,
        userPapers,
        setPapers,
        setUserPapers,
        toggleRead,
        toggleBookmark,
        addPaper,
        getPaperById,
        updateNoteVote,
        addPersonalNote,
        getPersonalNote,
        searchPapersByConcept,
        getUserVoteForNote,
        loadUserData,
        addNote,
        editNote,
      }}
    >
      {children}
    </PaperContext.Provider>
  )
}

export function usePaperContext() {
  const context = useContext(PaperContext)
  if (context === undefined) {
    throw new Error("usePaperContext must be used within a PaperProvider")
  }
  return context
}

