import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';
import type { 
  User, 
  Course, 
  Progress, 
  Quiz, 
  Question,
  QuizResult, 
  DashboardData,
  Enrollment
} from '../../types';

class FirestoreService {
  // User Profile Methods
  async getProfile(userId: string): Promise<User> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    return { id: userId, ...userDoc.data() } as User;
  }

  // Admin: List and manage users
  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'))
    return usersSnapshot.docs.map(d => ({ id: d.id, email: '', firstName: d.data().firstName || '', lastName: d.data().lastName || '', role: d.data().role || 'student', organization: d.data().organization, created_at: d.data().created_at })) as User[]
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, updates as any)
    return this.getProfile(userId)
  }

  async setUserRole(userId: string, role: 'student' | 'instructor' | 'admin'): Promise<User> {
    return this.updateUser(userId, { role })
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
    return this.getProfile(userId);
  }

  // Course Methods
  async getCourses(): Promise<Course[]> {
    const coursesSnapshot = await getDocs(
      query(collection(db, 'courses'), where('published', '==', true))
    );
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  }

  async getCourse(courseId: string): Promise<Course> {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    return { id: courseId, ...courseDoc.data() } as Course;
  }

  async createCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    const courseRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: courseRef.id,
      ...courseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async updateCourse(courseId: string, updates: Partial<Course>): Promise<Course> {
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return this.getCourse(courseId);
  }

  async deleteCourse(courseId: string): Promise<void> {
    const courseRef = doc(db, 'courses', courseId);
    await updateDoc(courseRef, { published: false });
  }

  async enrollInCourse(userId: string, courseId: string): Promise<{ message: string }> {
    const enrollmentData = {
      userId,
      courseId,
      enrolledAt: serverTimestamp(),
      progress: 0,
      status: 'active',
      timeSpent: 0,
      completedLessons: 0
    };
    
    await addDoc(collection(db, 'enrollments'), enrollmentData);
    return { message: 'Successfully enrolled in course' };
  }

  // Progress Methods
  async getProgress(userId: string, courseId: string): Promise<Progress> {
    const progressDoc = await getDoc(doc(db, 'progress', `${userId}_${courseId}`));
    if (!progressDoc.exists()) {
      // Create initial progress
      const initialProgress: Progress = {
        courseId,
        userId,
        completedLessons: [],
        overallProgress: 0,
        timeSpent: 0,
        lastAccessed: new Date().toISOString()
      };
      await setDoc(doc(db, 'progress', `${userId}_${courseId}`), initialProgress);
      return initialProgress;
    }
    const data = progressDoc.data();
    return { 
      ...data 
    } as Progress;
  }

  async updateProgress(userId: string, courseId: string, lessonId: string, data: {
    completed?: boolean;
    timeSpent?: number;
  }): Promise<Progress> {
    const progressRef = doc(db, 'progress', `${userId}_${courseId}`);
    const progressDoc = await getDoc(progressRef);
    
    if (!progressDoc.exists()) {
      throw new Error('Progress not found');
    }
    
    const currentProgress = progressDoc.data() as Progress;
    const completedLessons = [...currentProgress.completedLessons];
    
    if (data.completed && !completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }
    
    const updates = {
      completedLessons,
      timeSpent: currentProgress.timeSpent + (data.timeSpent || 0),
      lastAccessed: serverTimestamp()
    };
    
    await updateDoc(progressRef, updates);
    return this.getProgress(userId, courseId);
  }

  // Quiz Methods - Updated for new data structure
  async createQuiz(quizData: {
    title: string
    description: string
    timeLimit: number
    courseId?: string
  }): Promise<Quiz> {
    // Filter out undefined values
    const cleanQuizData = Object.fromEntries(
      Object.entries(quizData).filter(([_, value]) => value !== undefined)
    );
    
    const quizRef = await addDoc(collection(db, 'quizzes'), {
      ...cleanQuizData,
      totalQuestions: 0, // Will be updated when questions are added
      createdAt: serverTimestamp()
    });
    
    return {
      id: quizRef.id,
      title: quizData.title,
      description: quizData.description,
      timeLimit: quizData.timeLimit,
      totalQuestions: 0,
      createdAt: new Date().toISOString(),
      ...(quizData.courseId && { courseId: quizData.courseId })
    } as Quiz;
  }

  async getQuiz(quizId: string): Promise<Quiz> {
    const quizDoc = await getDoc(doc(db, 'quizzes', quizId));
    if (!quizDoc.exists()) {
      throw new Error('Quiz not found');
    }
    return { id: quizId, ...quizDoc.data() } as Quiz;
  }

  async updateQuiz(quizId: string, updates: Partial<Quiz>): Promise<Quiz> {
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, updates);
    return this.getQuiz(quizId);
  }

  async deleteQuiz(quizId: string): Promise<void> {
    const quizRef = doc(db, 'quizzes', quizId);
    await updateDoc(quizRef, { deleted: true });
  }

  // Question Methods - Main collection with quizId reference
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
    // Filter out undefined values and add quizId reference
    const cleanQuestionData = Object.fromEntries(
      Object.entries({
        ...questionData,
        quizId
      }).filter(([_, value]) => value !== undefined)
    );
    
    const questionRef = await addDoc(collection(db, 'questions'), cleanQuestionData);
    
    // Update quiz totalQuestions count
    const quiz = await this.getQuiz(quizId);
    await this.updateQuiz(quizId, { totalQuestions: quiz.totalQuestions + 1 });
    
    return {
      id: questionRef.id,
      text: questionData.text,
      options: questionData.options,
      correctAnswerIndex: questionData.correctAnswerIndex,
      points: questionData.points,
      quizId: quizId,
      ...(questionData.explanation && { explanation: questionData.explanation }),
      ...(questionData.imageUrl !== undefined && { imageUrl: questionData.imageUrl }),
      ...(questionData.difficulty && { difficulty: questionData.difficulty }),
      ...(questionData.tags && { tags: questionData.tags })
    } as Question;
  }

  async getQuestions(quizId: string): Promise<Question[]> {
    const questionsSnapshot = await getDocs(
      query(
        collection(db, 'questions'), 
        where('quizId', '==', quizId),
        orderBy('createdAt', 'asc')
      )
    );
    
    return questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];
  }

  async updateQuestion(questionId: string, updates: Partial<Question>): Promise<Question> {
    const questionRef = doc(db, 'questions', questionId);
    await updateDoc(questionRef, updates);
    
    const questionDoc = await getDoc(questionRef);
    return { id: questionId, ...questionDoc.data() } as Question;
  }

  async deleteQuestion(questionId: string): Promise<void> {
    const questionRef = doc(db, 'questions', questionId);
    const questionDoc = await getDoc(questionRef);
    
    if (!questionDoc.exists()) {
      throw new Error('Question not found');
    }
    
    const questionData = questionDoc.data();
    const quizId = questionData.quizId;
    
    await updateDoc(questionRef, { deleted: true });
    
    // Update quiz totalQuestions count
    const quiz = await this.getQuiz(quizId);
    await this.updateQuiz(quizId, { totalQuestions: Math.max(0, quiz.totalQuestions - 1) });
  }

  async submitQuiz(userId: string, quizId: string, answers: Record<string, number>, timeSpent: number): Promise<QuizResult> {
    const questions = await this.getQuestions(quizId);
    
    // Calculate score
    let correctAnswers = 0;
    const totalQuestions = questions.length;
    
    questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswerIndex) {
        correctAnswers++;
      }
    });
    
    const score = correctAnswers;
    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;
    const passed = percentage >= 70; // 70% passing grade
    
    const result: QuizResult = {
      quizId,
      userId,
      score,
      totalQuestions,
      percentage,
      passed,
      timeSpent,
      submittedAt: new Date().toISOString()
    };
    
    // Save result
    await addDoc(collection(db, 'quizResults'), result);
    
    return result;
  }

  // Dashboard Methods
  async getDashboard(userId: string): Promise<DashboardData> {
    // Get enrollments
    const enrollmentsSnapshot = await getDocs(
      query(collection(db, 'enrollments'), where('userId', '==', userId))
    );
    
    const enrollments: Enrollment[] = enrollmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        courseId: data.courseId,
        enrolledAt: data.enrolledAt,
        progress: data.progress,
        status: data.status,
        timeSpent: data.timeSpent,
        completedLessons: data.completedLessons
      } as Enrollment;
    });
    
    // Get progress data
    const progressSnapshot = await getDocs(
      query(collection(db, 'progress'), where('userId', '==', userId))
    );
    
    const progressData = progressSnapshot.docs.map(doc => doc.data());
    
    const totalCourses = enrollments.length;
    const completedCourses = progressData.filter(p => p.overallProgress === 100).length;
    const totalTimeSpent = progressData.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    
    return {
      enrollments,
      totalCourses,
      completedCourses,
      totalTimeSpent
    };
  }

  // Enrollment Methods
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const enrollmentsSnapshot = await getDocs(
      query(collection(db, 'enrollments'), where('userId', '==', userId))
    );
    
    return enrollmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        courseId: data.courseId,
        enrolledAt: data.enrolledAt,
        progress: data.progress,
        status: data.status,
        timeSpent: data.timeSpent,
        completedLessons: data.completedLessons
      } as Enrollment;
    });
  }

  // Course enrollment check
  async isEnrolled(userId: string, courseId: string): Promise<boolean> {
    const enrollmentSnapshot = await getDocs(
      query(
        collection(db, 'enrollments'), 
        where('userId', '==', userId),
        where('courseId', '==', courseId)
      )
    );
    
    return !enrollmentSnapshot.empty;
  }
}

// Utility function to convert file to base64
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

// Utility function to download base64 file
export const downloadBase64File = (base64Data: string, fileName: string, mimeType: string) => {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const firestoreService = new FirestoreService();
