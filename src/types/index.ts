// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'instructor' | 'admin'
  organization?: string
  created_at?: string
}

export interface UserProfile extends User {
  progress: Record<string, any>
  enrollments: Enrollment[]
}

// Course Types
export interface Course {
  id: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number // hours
  thumbnail: string
  modules: Module[]
  published: boolean
  category: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  duration: number // minutes
  type: 'video' | 'interactive' | 'quiz' | 'text'
  content?: string
  videoUrl?: string
}

// Progress Types
export interface Progress {
  courseId: string
  userId: string
  completedLessons: string[]
  overallProgress: number
  timeSpent: number
  lastAccessed?: string
}

export interface Enrollment {
  courseId: string
  enrolledAt: string
  progress: number
  status: 'active' | 'completed' | 'paused'
  timeSpent?: number
  completedLessons?: number
}

// Quiz Types
export interface Quiz {
  id: string
  title: string
  description: string
  timeLimit: number // minutes
  questions: Question[]
}

export interface Question {
  id: string
  type: 'multiple_choice' | 'true_false' | 'drag_drop'
  question: string
  options: QuestionOption[]
  points: number
  explanation?: string
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizResult {
  quizId: string
  userId: string
  score: number
  totalQuestions: number
  percentage: number
  passed: boolean
  timeSpent: number
  submittedAt: string
}

// Dashboard Types
export interface DashboardData {
  enrollments: Enrollment[]
  totalCourses: number
  completedCourses: number
  totalTimeSpent: number
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  access_token: string
  user: User
}

// Firebase-specific types
export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  organization?: string
}

export interface SignInData {
  email: string
  password: string
}