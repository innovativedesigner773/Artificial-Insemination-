import type { Course, Quiz, Question } from '../types'

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
            content: 'Introduction and Definition: Artificial Insemination (AI) is a reproductive technology where sperm is collected, processed, and manually introduced into the female reproductive tract to achieve fertilization without natural mating. It is widely used in agriculture and human medicine and has transformed breeding practices across species. Why Study AI? Agricultural impact (rapid spread of superior genetics), medical applications (overcoming fertility challenges), scientific understanding (reproductive biology and genetics), and economic importance (significant value in agriculture and medicine).\n\nReproductive Biology Fundamentals (Female): Overview of the ovaries, oviducts (fallopian tubes), uterus, cervix, and vagina in relation to AI success. Emphasis on estrus detection, ovulation timing, and creating optimal conditions for fertilization.',
            videoUrl: 'https://www.youtube.com/results?search_query=artificial+insemination+introduction+overview'
          },
          {
            id: 'les2',
            title: 'Male Reproductive System',
            duration: 12,
            type: 'video',
            content: 'Historical Background and Male Reproductive Fundamentals: Early development of AI: 1780s Spallanzani (dogs), 1899 (horses, Russia), 1930s–40s (cattle standardization), 1950s (frozen semen revolution), 1978 (human birth via AI + IVF). Modern era: sophisticated semen processing, computerized breeding programs, genetic selection, and adoption across species.\n\nMale anatomy relevance to AI: testes (sperm production), epididymis (maturation), ducts and accessory glands (seminal plasma). Links to semen quality, motility, morphology, and viability for successful insemination.',
            videoUrl: 'https://www.youtube.com/results?search_query=male+reproductive+system+anatomy+artificial+insemination+context'
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
            content: 'Scientific Principles and Preparation: Fertilization steps—sperm transport, capacitation, binding and penetration of the egg, and zygote formation. Timing considerations: estrus detection, ovulation timing, and sperm viability. Genetic principles: heritability, breeding value, genetic diversity, and avoiding inbreeding.\n\nPreparation and hygiene focus: minimizing contamination, correct equipment handling, maintaining biosecurity, and SOPs that improve success rates.',
            videoUrl: 'https://www.youtube.com/results?search_query=semen+handling+thawing+AI+straws+tutorial'
          },
          {
            id: 'les4',
            title: 'Insemination Technique',
            duration: 20,
            type: 'video',
            content: 'The AI Process Step-by-Step:\nPhase 1 – Semen Collection: artificial vagina, electroejaculation, manual methods (species-dependent); quality assessment of volume, concentration, motility, morphology.\nPhase 2 – Semen Processing: evaluation, dilution with extenders, cooling, addition of cryoprotectants, packaging in straws, freezing in liquid nitrogen (−196°C).\nPhase 3 – Female Preparation: estrus synchronization, health screening, nutrition.\nPhase 4 – Insemination Procedure: thawing, loading devices, insertion, deposition at the optimal site (cervix/uterus/oviducts by technique), and documentation.\nPhase 5 – Follow-up: pregnancy detection, record keeping, and ongoing health monitoring.',
            videoUrl: 'https://www.youtube.com/results?search_query=cattle+artificial+insemination+procedure+step+by+step'
          },
          { id: 'quiz_mod2', title: 'Quick Check: Procedures', duration: 10, type: 'quiz' }
        ]
      },
      {
        id: 'mod3',
        title: 'AI Fundamentals',
        description: 'Types and scientific underpinnings of artificial insemination.',
        attachments: [],
        lessons: [
          {
            id: 'les5',
            title: 'Types of Artificial Insemination',
            duration: 16,
            type: 'video',
            content: 'Types by semen source: homologous (partner/designated male) vs heterologous (donor). Types by deposition site: intracervical insemination (ICI), intrauterine insemination (IUI), intratubal insemination. Practical considerations for complexity, preparation needs, and expected success rates for each method.',
            videoUrl: 'https://www.youtube.com/results?search_query=types+of+artificial+insemination+IUI+ICI+intracervical+intratubal'
          },
          {
            id: 'les6',
            title: 'Timing and Success Factors',
            duration: 14,
            type: 'video',
            content: 'Critical success factors: accurate estrus detection, precise ovulation timing, semen quality (motility, morphology, viability), practitioner skill, equipment readiness, and environmental management. Connections to genetic principles and breeding goals.',
            videoUrl: 'https://www.youtube.com/results?search_query=ovulation+timing+and+success+factors+artificial+insemination'
          }
        ]
      },
      {
        id: 'mod4',
        title: 'Applications, Ethics, and Future',
        description: 'Real-world applications, benefits, challenges, and future developments.',
        attachments: [],
        lessons: [
          {
            id: 'les7',
            title: 'Applications in Agriculture',
            duration: 17,
            type: 'video',
            content: 'Cattle: one bull sires thousands, rapid genetic improvement, disease control, cost efficiency; global usage and typical success rates. Other livestock: sheep/goats (seasonality, genetic gains, disease control), swine (year-round breeding, larger litters, biosecurity), horses (bloodline preservation, transport savings, performance breeding), poultry (turkey industry focus, uniformity, feed efficiency).',
            videoUrl: 'https://www.youtube.com/results?search_query=artificial+insemination+in+cattle+goats+swine+horses+applications'
          },
          {
            id: 'les8',
            title: 'Applications in Human Medicine',
            duration: 13,
            type: 'video',
            content: 'Fertility indications: male factor infertility, cervical factor, unexplained infertility, and family-building for single women and same-sex couples. Success rates per IUI cycle vary by age and etiology; donor programs, sperm banking, genetic screening, and safety protocols including quarantine and disease testing.',
            videoUrl: 'https://www.youtube.com/results?search_query=intrauterine+insemination+IUI+procedure+explained'
          },
          {
            id: 'les9',
            title: 'Advantages and Limitations',
            duration: 15,
            type: 'video',
            content: 'Advantages: genetic improvement, disease control, economic efficiency, geographic flexibility, record keeping, safety; medical advantages include fertility solutions, genetic screening, timing control, reduced infection risk, preserved fertility. Limitations: semen quality variability, processing/storage damage, equipment and facility demands, precise timing needs, costs, and species/age-related fertility differences.',
            videoUrl: 'https://www.youtube.com/results?search_query=advantages+and+limitations+artificial+insemination+livestock+and+human'
          },
          {
            id: 'les10',
            title: 'Ethics, Future, and Study Aids',
            duration: 18,
            type: 'video',
            content: 'Ethics: animal welfare (stress, handling), genetic diversity (inbreeding risk, loss of variability, conservation), and human ethics (consent, anonymity, rights of children, social and cultural perspectives, access and equity). Future: improved processing, enhanced freezing, automation, genetic marker selection, sexed semen, genomic selection, cloning integration, stem cell applications. Key terminology: capacitation, cryopreservation, estrus, extender, motility, morphology, ovulation, synchronization, viability. Study questions and conclusion summarizing AI as a cornerstone technology across agriculture, medicine, and conservation.',
            videoUrl: 'https://www.youtube.com/results?search_query=ethical+considerations+and+future+of+artificial+insemination'
          }
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
            videoUrl: 'https://www.youtube.com/results?search_query=estrus+heat+detection+cattle+tutorial'
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
        tags: ['anatomy'],
        quizId: 'quiz_mod1'
      },
      {
        id: 'q2',
        text: 'Which male organ produces sperm?',
        options: ['Testes', 'Prostate', 'Bladder', 'Urethra'],
        correctAnswerIndex: 0,
        explanation: 'Sperm is produced in the testes.',
        points: 10,
        difficulty: 'easy',
        tags: ['anatomy'],
        quizId: 'quiz_mod1'
      },
      {
        id: 'q3',
        text: 'Where does fertilization commonly occur?',
        options: ['Ovary', 'Oviduct', 'Uterus', 'Cervix'],
        correctAnswerIndex: 1,
        explanation: 'Fertilization usually occurs in the oviduct.',
        points: 10,
        difficulty: 'easy',
        tags: ['anatomy'],
        quizId: 'quiz_mod1'
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
        tags: ['procedure'],
        quizId: 'quiz_mod2'
      },
      {
        id: 'q5',
        text: 'Good timing for AI is based on:',
        options: ['Random choice', 'Estrus detection', 'Weather', 'Feed type'],
        correctAnswerIndex: 1,
        explanation: 'Estrus detection drives correct timing.',
        points: 10,
        difficulty: 'easy',
        tags: ['procedure'],
        quizId: 'quiz_mod2'
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


