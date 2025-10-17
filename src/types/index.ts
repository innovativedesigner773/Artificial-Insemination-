// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'student' | 'instructor' | 'admin'
  organization?: string
  selectedPlan?: string // The pricing plan selected during registration
  created_at?: string
  accessExpiresAt?: string // ISO date string for when access expires
  accessDuration?: number // Duration in days
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
  attachments?: UploadedFile[]
  createdAt?: string
  updatedAt?: string
  instructorId?: string
}

export interface Module {
  id: string
  title: string
  description?: string
  lessons: Lesson[]
  attachments?: UploadedFile[]
}

export interface Lesson {
  id: string
  title: string
  duration: number // minutes
  type: 'video' | 'interactive' | 'quiz' | 'text' | 'document' | 'presentation' | 'mixed'
  content?: string
  // Deprecated: use videoSources instead
  videoUrl?: string
  // Per-language video sources (URL to YouTube/Vimeo or file URL)
  videoSources?: Partial<Record<
    | 'Afrikaans'
    | 'English'
    | 'IsiNdebele'
    | 'IsiXhosa'
    | 'IsiZulu'
    | 'Sesotho'
    | 'Sepedi'
    | 'Setswana'
    | 'SiSwati'
    | 'Tshivenda'
    | 'Xitsonga',
    string
  >>
  attachments?: UploadedFile[]
  quizId?: string // Reference to quiz document for quiz lessons
  contentBlocks?: ContentBlock[] // For mixed content lessons
}

export interface ContentBlock {
  id: string
  type: 'video' | 'text' | 'quiz' | 'document' | 'interactive'
  title: string
  content?: string
  videoUrl?: string
  quizId?: string
  attachments?: UploadedFile[]
  order: number // Order within the lesson
  duration?: number // Duration for this specific block in minutes
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

// Quiz Types - Simplified Firestore Data Model
export interface Quiz {
  id: string
  title: string
  description: string
  timeLimit: number // in seconds
  totalQuestions: number
  createdAt: string
  courseId?: string // optional reference to course
}

export interface Question {
  id: string
  text: string
  options: string[] // Array of option strings
  correctAnswerIndex: number // Index of correct option
  explanation?: string
  points: number
  imageUrl?: string | null // optional for image-based questions
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
  quizId: string // Reference to the quiz this question belongs to
  createdAt?: string // When the question was created
  updatedAt?: string // When the question was last updated
  isActive?: boolean // Whether the question is active (for soft deletion)
  order?: number // Order of the question within the quiz
  timeLimit?: number // Time limit for this specific question in seconds
  hint?: string // Optional hint for the question
  feedback?: string // Feedback shown after answering
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

// File Types
export interface UploadedFile {
  id: string
  name: string
  type: string
  size: number
  data?: string // base64 encoded file data (optional, not stored in course documents)
  url?: string // optional URL for downloaded files
}

// Firebase-specific types
export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  organization?: string
  accessExpiresAt?: string
  accessDuration?: number
  selectedPlan?: string // Plan selected during registration
  role?: 'student' | 'instructor' | 'admin' // Optional role override
}

export interface SignInData {
  email: string
  password: string
}

// Course Content Types
export interface CourseContent {
  id: string
  courseId: string
  moduleId: string
  lessonId: string
  title: string
  type: 'video' | 'interactive' | 'quiz' | 'text' | 'document' | 'presentation' | 'mixed'
  duration: number // minutes
  content?: string
  videoUrl?: string
  videoSources?: Partial<Record<
    | 'Afrikaans'
    | 'English'
    | 'IsiNdebele'
    | 'IsiXhosa'
    | 'IsiZulu'
    | 'Sesotho'
    | 'Sepedi'
    | 'Setswana'
    | 'SiSwati'
    | 'Tshivenda'
    | 'Xitsonga',
    string
  >>
  attachments?: UploadedFile[]
  quizId?: string
  contentBlocks?: ContentBlock[]
  createdAt: string
  updatedAt: string
}