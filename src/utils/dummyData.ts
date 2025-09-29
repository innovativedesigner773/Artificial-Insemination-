import type { Course, Module, Lesson, Quiz, Question } from '../types'

export const dummyCourses: Course[] = [
  {
    id: 'ai_basics',
    title: 'Artificial Insemination Basics',
    description: 'Foundations of AI procedures, safety, and farm best practices.',
    difficulty: 'beginner',
    duration: 8,
    thumbnail: 'https://images.unsplash.com/photo-1559757175-08fda9f3fdfb?w=1200&auto=format&fit=crop&q=60',
    published: true,
    category: 'Breeding Management',
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instructorId: 'demo_instructor',
    modules: [
      {
        id: 'mod1',
        title: 'Reproductive Anatomy',
        description: 'Understand basic anatomy relevant to AI.',
        attachments: [],
        lessons: [
          {
            id: 'les1',
            title: 'Female Reproductive System',
            duration: 15,
            type: 'video',
            content: 'Intro to female anatomy',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          },
          {
            id: 'les2',
            title: 'Male Reproductive System',
            duration: 12,
            type: 'video',
            content: 'Intro to male anatomy',
            videoUrl: 'https://youtu.be/aqz-KE-bpKQ'
          },
          { id: 'quiz_mod1', title: 'Quick Check: Anatomy', duration: 8, type: 'quiz' }
        ]
      },
      {
        id: 'mod2',
        title: 'AI Procedures',
        description: 'Step-by-step procedures and hygiene.',
        attachments: [],
        lessons: [
          {
            id: 'les3',
            title: 'Preparation and Hygiene',
            duration: 18,
            type: 'video',
            content: 'Preparation procedures',
            videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U'
          },
          {
            id: 'les4',
            title: 'Insemination Technique',
            duration: 20,
            type: 'video',
            content: 'Technique overview',
            videoUrl: 'https://youtu.be/5qap5aO4i9A'
          },
          { id: 'quiz_mod2', title: 'Quick Check: Procedures', duration: 10, type: 'quiz' }
        ]
      }
    ]
  },
  {
    id: 'ai_advanced',
    title: 'Advanced AI & Farm Management',
    description: 'Advanced skills, troubleshooting, and farm management strategies.',
    difficulty: 'intermediate',
    duration: 10,
    thumbnail: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&auto=format&fit=crop&q=60',
    published: true,
    category: 'Farm Management',
    attachments: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    instructorId: 'demo_instructor',
    modules: [
      {
        id: 'modA',
        title: 'Troubleshooting',
        description: 'Common issues and solutions.',
        attachments: [],
        lessons: [
          {
            id: 'lesA1',
            title: 'Detecting Estrus',
            duration: 14,
            type: 'video',
            content: 'Estrus detection tips',
            videoUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g'
          },
          { id: 'quiz_modA', title: 'Quick Check: Troubleshooting', duration: 8, type: 'quiz' }
        ]
      }
    ]
  }
]

export const dummyQuizzes: Record<string, Quiz & { questions: Question[] }> = {
  quiz_mod1: {
    id: 'quiz_mod1',
    title: 'Quick Check: Anatomy',
    description: 'Answer a few questions to check your understanding.',
    timeLimit: 300,
    totalQuestions: 3,
    createdAt: new Date().toISOString()
  , questions: [
      {
        id: 'q1',
        text: 'Which structure is essential for sperm transport in females?',
        options: ['Oviduct', 'Kidney', 'Liver', 'Pancreas'],
        correctAnswerIndex: 0,
        explanation: 'Fertilization typically occurs in the oviduct.',
        points: 10,
        difficulty: 'easy',
        tags: ['anatomy']
      },
      {
        id: 'q2',
        text: 'Which male organ produces sperm?',
        options: ['Testes', 'Prostate', 'Bladder', 'Urethra'],
        correctAnswerIndex: 0,
        explanation: 'Sperm is produced in the testes.',
        points: 10,
        difficulty: 'easy',
        tags: ['anatomy']
      },
      {
        id: 'q3',
        text: 'Where does fertilization commonly occur?',
        options: ['Ovary', 'Oviduct', 'Uterus', 'Cervix'],
        correctAnswerIndex: 1,
        explanation: 'Fertilization usually occurs in the oviduct.',
        points: 10,
        difficulty: 'easy',
        tags: ['anatomy']
      }
    ]
  },
  quiz_mod2: {
    id: 'quiz_mod2',
    title: 'Quick Check: Procedures',
    description: 'Short assessment after procedure videos.',
    timeLimit: 300,
    totalQuestions: 2,
    createdAt: new Date().toISOString()
  , questions: [
      {
        id: 'q4',
        text: 'Before AI, you should always:',
        options: ['Skip hygiene', 'Sterilize equipment', 'Ignore heat signs', 'Guess timing'],
        correctAnswerIndex: 1,
        explanation: 'Sterilization and hygiene are critical.',
        points: 10,
        difficulty: 'easy',
        tags: ['procedure']
      },
      {
        id: 'q5',
        text: 'Good timing for AI is based on:',
        options: ['Random choice', 'Estrus detection', 'Weather', 'Feed type'],
        correctAnswerIndex: 1,
        explanation: 'Estrus detection drives correct timing.',
        points: 10,
        difficulty: 'easy',
        tags: ['procedure']
      }
    ]
  }
}

export function getDummyCourses(): Course[] {
  return dummyCourses
}

export function getDummyCourseById(courseId: string): Course | null {
  return dummyCourses.find(c => c.id === courseId) || null
}

export function getDummyQuiz(quizId: string): { quiz: Quiz, questions: Question[] } | null {
  const entry = dummyQuizzes[quizId]
  if (!entry) return null
  const { questions, ...quiz } = entry
  return { quiz, questions }
}


