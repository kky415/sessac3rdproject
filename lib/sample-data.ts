export interface Paper {
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
  paper_vector: number[]
}

export interface Note {
  id: number
  userId: number
  paperId: number
  noteContent: string
}

export const samplePapers: Paper[] = [
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
    paper_vector: [0.1, 0.2, 0.3, 0.4, 0.5],
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
    paper_vector: [0.2, 0.3, 0.4, 0.5, 0.6],
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
    paper_vector: [0.3, 0.4, 0.5, 0.6, 0.7],
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
    paper_vector: [0.15, 0.25, 0.35, 0.45, 0.55],
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
    paper_vector: [0.4, 0.5, 0.6, 0.7, 0.8],
  },
]

export const sampleNotes: Note[] = [
  {
    id: 1,
    userId: 1,
    paperId: 1,
    noteContent: "Interesting overview of ML algorithms. Follow up on section 3.2 about neural networks.",
  },
]

