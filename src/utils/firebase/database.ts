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
  serverTimestamp,
  writeBatch
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
  Enrollment,
  CourseContent
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

  // Debug method to get all courses regardless of published status
  async getAllCourses(): Promise<Course[]> {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    console.log('Total courses found:', coursesSnapshot.docs.length);
    coursesSnapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`Course: ${doc.id}`, {
        title: data.title,
        published: data.published,
        hasPublishedField: 'published' in data
      });
    });
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
  }

  async getCourse(courseId: string): Promise<Course> {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    
    console.log('Raw course data from database:', courseData);
    console.log('Has lessons:', !!courseData.lessons, 'Count:', courseData.lessons?.length);
    console.log('Has modules:', !!courseData.modules, 'Count:', courseData.modules?.length);
    
    // Transform the data structure to match the expected Course interface
    // Handle different database structures
    if (courseData.lessons && courseData.modules) {
      // Database has both lessons and modules, but modules might have empty lessons arrays
      // Distribute lessons to modules or create a default module
      const modules = courseData.modules.map((module: any) => ({
        ...module,
        lessons: module.lessons || []
      }));
      
      // If all modules have empty lessons, put all lessons in the first module
      const hasLessonsInModules = modules.some((module: any) => module.lessons.length > 0);
      console.log('Has lessons in modules:', hasLessonsInModules);
      console.log('Lessons count:', courseData.lessons.length);
      
      if (!hasLessonsInModules && courseData.lessons.length > 0) {
        console.log('Distributing lessons to first module');
        modules[0] = {
          ...modules[0],
          lessons: courseData.lessons
        };
      }
      
      console.log('Final modules after transformation:', modules);
      
      return {
        id: courseId,
        ...courseData,
        modules
      } as Course;
    } else if (courseData.modules && !courseData.lessons) {
      // Database has modules but no separate lessons array
      // Check if modules have lessons or if we need to create some
      const modules = courseData.modules.map((module: any) => ({
        ...module,
        lessons: module.lessons || []
      }));
      
      console.log('Modules with lessons:', modules.map((m: any) => ({ id: m.id, title: m.title, lessonCount: m.lessons.length })));
      
      // Check if any modules have lessons
      const hasAnyLessons = modules.some((module: any) => module.lessons.length > 0);
      console.log('Has any lessons in modules:', hasAnyLessons);
      
      if (!hasAnyLessons) {
        console.log('No lessons found in any module - creating sample lesson');
        // Create a sample lesson for the first module
        modules[0] = {
          ...modules[0],
          lessons: [{
            id: 'sample-lesson-1',
            title: 'Welcome to the Course',
            duration: 5,
            type: 'text',
            content: 'Welcome! This course will guide you through the learning material. Click "Next" to continue.',
            attachments: []
          }]
        };
      } else {
        // If lessons exist but not in the first module, move them to the first module
        // or ensure the first module has at least one lesson
        const firstModuleHasLessons = modules[0].lessons.length > 0;
        if (!firstModuleHasLessons) {
          console.log('First module has no lessons, but other modules do - moving lessons to first module');
          // Find the first module with lessons and move them to the first module
          const moduleWithLessons = modules.find((module: any) => module.lessons.length > 0);
          if (moduleWithLessons) {
            modules[0] = {
              ...modules[0],
              lessons: moduleWithLessons.lessons
            };
            console.log('Moved lessons to first module:', modules[0].lessons.length);
          }
        }
      }
      
      return {
        id: courseId,
        ...courseData,
        modules
      } as Course;
    } else if (courseData.lessons && !courseData.modules) {
      // Create a default module containing all lessons
      const transformedData: Course = {
        id: courseId,
        title: courseData.title || 'Untitled Course',
        description: courseData.description || '',
        difficulty: courseData.difficulty || 'beginner',
        duration: courseData.duration || 0,
        thumbnail: courseData.thumbnail || '',
        published: courseData.published || false,
        category: courseData.category || '',
        attachments: courseData.attachments || [],
        createdAt: courseData.createdAt || new Date().toISOString(),
        updatedAt: courseData.updatedAt || new Date().toISOString(),
        instructorId: courseData.instructorId || '',
        modules: [{
          id: 'default-module',
          title: 'Course Content',
          description: 'All course lessons',
          lessons: courseData.lessons || [],
          attachments: []
        }]
      };
      return transformedData;
    }
    
    return { id: courseId, ...courseData } as Course;
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
    order?: number
    timeLimit?: number
    hint?: string
    feedback?: string
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
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...(questionData.explanation && { explanation: questionData.explanation }),
      ...(questionData.imageUrl !== undefined && { imageUrl: questionData.imageUrl }),
      ...(questionData.difficulty && { difficulty: questionData.difficulty }),
      ...(questionData.tags && { tags: questionData.tags }),
      ...(questionData.order && { order: questionData.order }),
      ...(questionData.timeLimit && { timeLimit: questionData.timeLimit }),
      ...(questionData.hint && { hint: questionData.hint }),
      ...(questionData.feedback && { feedback: questionData.feedback })
    } as Question;
  }

  async getQuestions(quizId: string): Promise<Question[]> {
    const questionsSnapshot = await getDocs(
      query(
        collection(db, 'questions'), 
        where('quizId', '==', quizId),
        where('isActive', '==', true),
        orderBy('order', 'asc')
      )
    );
    
    return questionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Question[];
  }

  async getAllQuestions(quizId: string): Promise<Question[]> {
    const questionsSnapshot = await getDocs(
      query(
        collection(db, 'questions'), 
        where('quizId', '==', quizId),
        orderBy('order', 'asc')
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
    
    // Soft delete by setting isActive to false
    await updateDoc(questionRef, { 
      isActive: false,
      updatedAt: serverTimestamp()
    });
    
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

  // Enhanced quiz validation with detailed results
  async validateQuizAnswers(quizId: string, answers: Record<string, number>): Promise<{
    score: number
    totalQuestions: number
    percentage: number
    passed: boolean
    detailedResults: Array<{
      questionId: string
      questionText: string
      userAnswer: number
      correctAnswer: number
      isCorrect: boolean
      explanation?: string
      points: number
      earnedPoints: number
    }>
  }> {
    const questions = await this.getQuestions(quizId);
    
    let totalScore = 0;
    let earnedPoints = 0;
    const detailedResults = questions.map(question => {
      const userAnswer = answers[question.id] ?? -1;
      const isCorrect = userAnswer === question.correctAnswerIndex;
      const pointsEarned = isCorrect ? question.points : 0;
      
      totalScore += question.points;
      earnedPoints += pointsEarned;
      
      return {
        questionId: question.id,
        questionText: question.text,
        userAnswer,
        correctAnswer: question.correctAnswerIndex,
        isCorrect,
        explanation: question.explanation,
        points: question.points,
        earnedPoints: pointsEarned
      };
    });
    
    const percentage = totalScore > 0 ? (earnedPoints / totalScore) * 100 : 0;
    const passed = percentage >= 70;
    
    return {
      score: earnedPoints,
      totalQuestions: questions.length,
      percentage,
      passed,
      detailedResults
    };
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

  // Course Content Methods
  async createCourseContent(contentData: Omit<CourseContent, 'id' | 'createdAt' | 'updatedAt'>): Promise<CourseContent> {
    const contentRef = await addDoc(collection(db, 'courseContent'), {
      ...contentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return {
      id: contentRef.id,
      ...contentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async getCourseContentByCourseId(courseId: string): Promise<CourseContent[]> {
    const contentSnapshot = await getDocs(
      query(
        collection(db, 'courseContent'),
        where('courseId', '==', courseId),
        orderBy('createdAt', 'asc')
      )
    );
    
    return contentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CourseContent[];
  }

  async getCourseContentByModuleId(courseId: string, moduleId: string): Promise<CourseContent[]> {
    const contentSnapshot = await getDocs(
      query(
        collection(db, 'courseContent'),
        where('courseId', '==', courseId),
        where('moduleId', '==', moduleId),
        orderBy('createdAt', 'asc')
      )
    );
    
    return contentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CourseContent[];
  }

  async getCourseContent(contentId: string): Promise<CourseContent> {
    const contentDoc = await getDoc(doc(db, 'courseContent', contentId));
    if (!contentDoc.exists()) {
      throw new Error('Course content not found');
    }
    return { id: contentId, ...contentDoc.data() } as CourseContent;
  }

  async updateCourseContent(contentId: string, updates: Partial<CourseContent>): Promise<CourseContent> {
    const contentRef = doc(db, 'courseContent', contentId);
    await updateDoc(contentRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return this.getCourseContent(contentId);
  }

  async deleteCourseContent(contentId: string): Promise<void> {
    const contentRef = doc(db, 'courseContent', contentId);
    await updateDoc(contentRef, { deleted: true });
  }

  async batchCreateCourseContent(contents: Omit<CourseContent, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<CourseContent[]> {
    const batch = writeBatch(db);
    const createdContents: CourseContent[] = [];
    
    for (const content of contents) {
      const contentRef = doc(collection(db, 'courseContent'));
      batch.set(contentRef, {
        ...content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      createdContents.push({
        id: contentRef.id,
        ...content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    await batch.commit();
    return createdContents;
  }

  // Module Management Methods
  async createModule(courseId: string, moduleData: any): Promise<any> {
    const courseRef = doc(db, 'courses', courseId);
    const moduleId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    // For now, we'll store modules as part of the course document
    // In a real implementation, you might want separate module documents
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    const modules = courseData.modules || [];
    const newModule = {
      id: moduleId,
      ...moduleData,
      lessons: moduleData.lessons || []
    };
    
    await updateDoc(courseRef, {
      modules: this.cleanUndefinedValues([...modules, newModule]),
      updatedAt: serverTimestamp()
    });
    
    return newModule;
  }

  async updateModule(courseId: string, moduleId: string, moduleData: any): Promise<any> {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    const modules = courseData.modules || [];
    const updatedModules = modules.map((module: any) => 
      module.id === moduleId ? { ...module, ...moduleData } : module
    );
    
    await updateDoc(courseRef, {
      modules: this.cleanUndefinedValues(updatedModules),
      updatedAt: serverTimestamp()
    });
    
    return { id: moduleId, ...moduleData };
  }

  async deleteModule(courseId: string, moduleId: string): Promise<void> {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    const modules = courseData.modules || [];
    const updatedModules = modules.filter((module: any) => module.id !== moduleId);
    
    await updateDoc(courseRef, {
      modules: this.cleanUndefinedValues(updatedModules),
      updatedAt: serverTimestamp()
    });
  }

  // Lesson Management Methods
  async createLesson(courseId: string, moduleId: string, lessonData: any): Promise<any> {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    const modules = courseData.modules || [];
    const updatedModules = modules.map((module: any) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: [...(module.lessons || []), lessonData]
        };
      }
      return module;
    });
    
    await updateDoc(courseRef, {
      modules: this.cleanUndefinedValues(updatedModules),
      updatedAt: serverTimestamp()
    });
    
    return lessonData;
  }

  async updateLesson(courseId: string, moduleId: string, lessonId: string, lessonData: any): Promise<any> {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    const modules = courseData.modules || [];
    const updatedModules = modules.map((module: any) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.map((lesson: any) => 
            lesson.id === lessonId ? { ...lesson, ...lessonData } : lesson
          )
        };
      }
      return module;
    });
    
    await updateDoc(courseRef, {
      modules: this.cleanUndefinedValues(updatedModules),
      updatedAt: serverTimestamp()
    });
    
    return { id: lessonId, ...lessonData };
  }

  async deleteLesson(courseId: string, moduleId: string, lessonId: string): Promise<void> {
    const courseRef = doc(db, 'courses', courseId);
    const courseDoc = await getDoc(courseRef);
    if (!courseDoc.exists()) {
      throw new Error('Course not found');
    }
    
    const courseData = courseDoc.data();
    const modules = courseData.modules || [];
    const updatedModules = modules.map((module: any) => {
      if (module.id === moduleId) {
        return {
          ...module,
          lessons: module.lessons.filter((lesson: any) => lesson.id !== lessonId)
        };
      }
      return module;
    });
    
    await updateDoc(courseRef, {
      modules: this.cleanUndefinedValues(updatedModules),
      updatedAt: serverTimestamp()
    });
  }

  // Quiz Management Methods
  async getQuizzes(): Promise<Quiz[]> {
    const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
    return quizzesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Quiz[];
  }

  // File conversion utility
  convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64 string
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }

  // Utility to remove undefined values from objects before saving to Firestore
  private cleanUndefinedValues(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanUndefinedValues(item));
    }
    
    if (typeof obj === 'object') {
      const cleaned: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = this.cleanUndefinedValues(value);
        }
      }
      return cleaned;
    }
    
    return obj;
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
