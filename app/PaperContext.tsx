"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"

interface Paper {
  id: number
  title: string
  authors: string
  abstract: string
  publishedDate: string
  isRead: boolean
  isBookmarked: boolean
}

interface PaperContextType {
  papers: Paper[]
  setPapers: React.Dispatch<React.SetStateAction<Paper[]>>
  toggleRead: (id: number) => void
  toggleBookmark: (id: number) => void
  addPaper: (paper: Paper) => void
}

const PaperContext = createContext<PaperContextType | undefined>(undefined)

export function PaperProvider({ children }: { children: React.ReactNode }) {
  const [papers, setPapers] = useState<Paper[]>([])

  useEffect(() => {
    // Load papers from localStorage on initial render
    const storedPapers = localStorage.getItem("papers")
    if (storedPapers) {
      setPapers(JSON.parse(storedPapers))
    }
  }, [])

  useEffect(() => {
    // Save papers to localStorage whenever it changes
    localStorage.setItem("papers", JSON.stringify(papers))
  }, [papers])

  const toggleRead = (id: number) => {
    setPapers((prevPapers) =>
      prevPapers.map((paper) => (paper.id === id ? { ...paper, isRead: !paper.isRead } : paper)),
    )
  }

  const toggleBookmark = (id: number) => {
    setPapers((prevPapers) =>
      prevPapers.map((paper) => (paper.id === id ? { ...paper, isBookmarked: !paper.isBookmarked } : paper)),
    )
  }

  const addPaper = (paper: Paper) => {
    setPapers((prevPapers) => {
      if (!prevPapers.some((p) => p.id === paper.id)) {
        return [...prevPapers, paper]
      }
      return prevPapers
    })
  }

  return (
    <PaperContext.Provider value={{ papers, setPapers, toggleRead, toggleBookmark, addPaper }}>
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

