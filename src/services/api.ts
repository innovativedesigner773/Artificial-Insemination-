import { authHelpers } from '../utils/firebase/auth'
import { firestoreService } from '../utils/firebase/database'
import type { 
  User, 
  Course, 
  Progress, 
  Quiz, 
  Question,
  QuizResult, 
  DashboardData,
  AuthResponse,
  SignUpData 
} from '../types'

class ApiService {
  private async getCurrentUserId(): Promise<string> {
    const { user } = await authHelpers.getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }
    return user.id
  }

  // Auth Methods
  async register(userData: SignUpData): Promise<{ user: User }> {
    const { data, error } = await authHelpers.signUp(userData)
    if (error) {
      throw new Error(error)
    }
    return { user: data!.user }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await authHelpers.signIn({ email, password })
    if (error) {
      throw new Error(error)
    }
    // Firebase doesn't use access tokens like Supabase, so we'll return a mock token
    return { 
      access_token: 'firebase-auth-token', 
      user: data!.user 
    }
  }

  // User Profile Methods
  async getProfile(): Promise<User> {
    const userId = await this.getCurrentUserId()
    return firestoreService.getProfile(userId)
  }

  // Admin User Methods
  async listUsers(): Promise<User[]> {
    return firestoreService.getAllUsers()
  }

  async setUserRole(userId: string, role: 'student' | 'instructor' | 'admin'): Promise<User> {
    return firestoreService.setUserRole(userId, role)
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return firestoreService.updateUser(userId, updates)
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const userId = await this.getCurrentUserId()
    return firestoreService.updateProfile(userId, updates)
  }

  // Course Methods
  async getCourses(): Promise<Course[]> {
    return firestoreService.getCourses()
  }

  async enrollInCourse(courseId: string): Promise<{ message: string }> {
    const userId = await this.getCurrentUserId()
    return firestoreService.enrollInCourse(userId, courseId)
  }

  // Progress Methods
  async getProgress(courseId: string): Promise<Progress> {
    const userId = await this.getCurrentUserId()
    return firestoreService.getProgress(userId, courseId)
  }

  async updateProgress(courseId: string, lessonId: string, data: {
    completed?: boolean
    timeSpent?: number
  }): Promise<Progress> {
    const userId = await this.getCurrentUserId()
    return firestoreService.updateProgress(userId, courseId, lessonId, data)
  }

  // Quiz Methods
  async createQuiz(quizData: {
    title: string
    description: string
    timeLimit: number
    courseId?: string
  }): Promise<Quiz> {
    return firestoreService.createQuiz(quizData)
  }

  async getQuiz(quizId: string): Promise<Quiz> {
    return firestoreService.getQuiz(quizId)
  }

  async getQuestions(quizId: string): Promise<Question[]> {
    return firestoreService.getQuestions(quizId)
  }

  async createQuestion(quizId: string, questionData: {
    text: string
    options: string[]
    correctAnswerIndex: number
    explanation?: string
    points: number
    imageUrl?: string | null
    difficulty?: 'easy' | 'medium' | 'hard'
    tags?: string[]
  }): Promise<Question> {
    return firestoreService.createQuestion(quizId, questionData)
  }

  async submitQuiz(quizId: string, answers: Record<string, number>, timeSpent: number): Promise<QuizResult> {
    const userId = await this.getCurrentUserId()
    return firestoreService.submitQuiz(userId, quizId, answers, timeSpent)
  }

  // Dashboard Methods
  async getDashboard(): Promise<DashboardData> {
    const userId = await this.getCurrentUserId()
    return firestoreService.getDashboard(userId)
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    }
  }
}

export const api = new ApiService()