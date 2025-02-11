interface RelatedConcept {
  name: string
  isPrerequisite: boolean
}

interface RelatedPaper {
  id: number
  title: string
}

interface Note {
  id: number
  content: string
  author: string
  createdAt: string
  upvotes: number
  downvotes: number
  userVote?: "upvote" | "downvote" | null
}

export interface Paper {
  id: number
  title: string
  authors: string
  abstract: string
  publishedDate: string
  isRead: boolean
  isBookmarked: boolean
  summary: string
  koreanSummary: string
  relatedConcepts: RelatedConcept[]
  relatedPapers: RelatedPaper[]
  notes: Note[]
}

export const mockPapers: Paper[] = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    authors: "John Doe, Jane Smith",
    abstract: "This paper provides an overview of machine learning concepts and techniques.",
    publishedDate: "2023-01-15",
    isRead: false,
    isBookmarked: false,
    summary:
      "A comprehensive introduction to various machine learning algorithms and their applications in real-world scenarios.",
    koreanSummary: "다양한 기계 학습 알고리즘과 실제 시나리오에서의 응용에 대한 포괄적인 소개.",
    relatedConcepts: [
      { name: "Supervised Learning", isPrerequisite: false },
      { name: "Unsupervised Learning", isPrerequisite: false },
      { name: "Linear Algebra", isPrerequisite: true },
      { name: "Statistics", isPrerequisite: true },
    ],
    relatedPapers: [
      { id: 2, title: "Deep Learning Fundamentals" },
      { id: 3, title: "Neural Networks Explained" },
      { id: 4, title: "Introduction to Data Science" },
      { id: 5, title: "Statistical Learning Theory" },
      { id: 6, title: "Reinforcement Learning Basics" },
    ],
    notes: [
      {
        id: 1,
        content: "Great introduction to machine learning concepts!",
        author: "Alice",
        createdAt: "2023-05-01T12:00:00Z",
        upvotes: 5,
        downvotes: 1,
        userVote: null,
      },
      {
        id: 2,
        content: "The section on supervised learning could use more examples.",
        author: "Bob",
        createdAt: "2023-05-02T14:30:00Z",
        upvotes: 3,
        downvotes: 0,
        userVote: null,
      },
    ],
  },
  {
    id: 2,
    title: "Deep Learning Fundamentals",
    authors: "Alice Johnson, Bob Williams",
    abstract: "An in-depth look at the core concepts of deep learning and neural networks.",
    publishedDate: "2023-02-20",
    isRead: false,
    isBookmarked: false,
    summary:
      "This paper explores the fundamental principles of deep learning, including neural network architectures and training methodologies.",
    koreanSummary: "이 논문은 신경망 아키텍처와 훈련 방법론을 포함한 딥 러닝의 기본 원리를 탐구합니다.",
    relatedConcepts: [
      { name: "Neural Networks", isPrerequisite: false },
      { name: "Backpropagation", isPrerequisite: false },
      { name: "Gradient Descent", isPrerequisite: true },
      { name: "Activation Functions", isPrerequisite: false },
    ],
    relatedPapers: [
      { id: 1, title: "Introduction to Machine Learning" },
      { id: 3, title: "Neural Networks Explained" },
      { id: 7, title: "Convolutional Neural Networks" },
      { id: 8, title: "Recurrent Neural Networks" },
      { id: 9, title: "Transfer Learning in Deep Neural Networks" },
    ],
    notes: [
      {
        id: 3,
        content: "The explanation of backpropagation is very clear and helpful.",
        author: "Charlie",
        createdAt: "2023-05-03T10:15:00Z",
        upvotes: 7,
        downvotes: 2,
        userVote: null,
      },
      {
        id: 4,
        content: "I found the section on activation functions particularly insightful.",
        author: "Diana",
        createdAt: "2023-05-04T16:45:00Z",
        upvotes: 4,
        downvotes: 1,
        userVote: null,
      },
    ],
  },
  // Add more mock papers as needed
]

