import { useState, useEffect } from 'react'
import { VideoPlayer } from '../lessons/VideoPlayer'
import { QuizInterface } from '../quiz/QuizInterface'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle,
  
  BookOpen,
  Trophy
} from 'lucide-react'
import { api } from '../../services/api'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '../ui/carousel'
import { getDummyCourseById } from '../../utils/dummyData'
import type { Course, Lesson, Progress as ProgressType, QuizResult } from '../../types'

interface CourseViewerProps {
  courseId: string
  onBack: () => void
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [progress, setProgress] = useState<ProgressType | null>(null)
  const [, setLessonProgress] = useState(0)
  const [loading, setLoading] = useState(true)

  // Load from dummy data to simulate backend

  useEffect(() => {
    loadCourse()
    loadProgress()
  }, [courseId])

  const loadCourse = async () => {
    try {
      const data = getDummyCourseById(courseId)
      setCourse(data)
    } catch (error) {
      console.error('Failed to load course:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async () => {
    try {
      const progressData = await api.getProgress(courseId)
      setProgress(progressData)
    } catch (error) {
      console.error('Failed to load progress:', error)
    }
  }

  const getCurrentLesson = (): Lesson | null => {
    if (!course) return null
    return course.modules[currentModuleIndex]?.lessons[currentLessonIndex] || null
  }

  const getTotalLessons = (): number => {
    if (!course) return 0
    return course.modules.reduce((sum, module) => sum + module.lessons.length, 0)
  }

  const getCurrentLessonNumber = (): number => {
    if (!course) return 0
    let count = 0
    for (let i = 0; i < currentModuleIndex; i++) {
      count += course.modules[i].lessons.length
    }
    return count + currentLessonIndex + 1
  }

  const isLessonCompleted = (moduleIndex: number, lessonIndex: number): boolean => {
    if (!course || !progress) return false
    const lesson = course.modules[moduleIndex]?.lessons[lessonIndex]
    return lesson ? progress.completedLessons.includes(lesson.id) : false
  }

  const canAccessLesson = (moduleIndex: number, lessonIndex: number): boolean => {
    // Allow access to first lesson and any completed lessons
    if (moduleIndex === 0 && lessonIndex === 0) return true
    
    // Check if previous lesson is completed
    if (lessonIndex > 0) {
      return isLessonCompleted(moduleIndex, lessonIndex - 1)
    } else if (moduleIndex > 0) {
      const prevModule = course?.modules[moduleIndex - 1]
      if (prevModule) {
        return isLessonCompleted(moduleIndex - 1, prevModule.lessons.length - 1)
      }
    }
    
    return false
  }

  const navigateToLesson = (moduleIndex: number, lessonIndex: number) => {
    if (canAccessLesson(moduleIndex, lessonIndex)) {
      setCurrentModuleIndex(moduleIndex)
      setCurrentLessonIndex(lessonIndex)
      setLessonProgress(0)
    }
  }

  const nextLesson = () => {
    if (!course) return
    
    const currentModule = course.modules[currentModuleIndex]
    if (currentLessonIndex < currentModule.lessons.length - 1) {
      setCurrentLessonIndex(prev => prev + 1)
    } else if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(prev => prev + 1)
      setCurrentLessonIndex(0)
    }
    setLessonProgress(0)
  }

  const previousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(prev => prev - 1)
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(prev => prev - 1)
      const prevModule = course?.modules[currentModuleIndex - 1]
      if (prevModule) {
        setCurrentLessonIndex(prevModule.lessons.length - 1)
      }
    }
    setLessonProgress(0)
  }

  const handleLessonProgress = (progress: number) => {
    setLessonProgress(progress)
  }

  const handleLessonComplete = () => {
    setLessonProgress(100)
    // Automatically advance to next lesson after a short delay
    setTimeout(() => {
      nextLesson()
    }, 2000)
  }

  const handleQuizComplete = (result: QuizResult) => {
    if (result.passed) {
      handleLessonComplete()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p>Course not found</p>
        <Button onClick={onBack} className="mt-4">
          Back to Courses
        </Button>
      </div>
    )
  }

  const currentLesson = getCurrentLesson()
  const totalLessons = getTotalLessons()
  const currentLessonNumber = getCurrentLessonNumber()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-semibold">{course.title}</h1>
              <p className="text-sm text-gray-600">
                Lesson {currentLessonNumber} of {totalLessons}: {currentLesson?.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Progress: {Math.round((progress?.completedLessons.length || 0) / totalLessons * 100)}%
            </div>
            <Progress 
              value={(progress?.completedLessons.length || 0) / totalLessons * 100} 
              className="w-32"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Course Content */}
          <div className="lg:col-span-3">
            {currentLesson && (
              <div className="space-y-6">
                {/* Lesson Content */}
                {currentLesson.type === 'video' && (
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent className="items-stretch">
                        {(currentLesson.content || '')
                          .split(/\n\s*\n/)
                          .filter(Boolean)
                          .map((chunk, idx) => (
                            <CarouselItem key={`text-${idx}`} className="max-w-3xl mx-auto">
                              <Card className="border rounded-lg shadow-sm bg-white">
                                <CardHeader>
                                  <CardTitle className="text-blue-700">Lesson Slide {idx + 1}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="prose max-w-none whitespace-pre-line">
                                    {chunk}
                                  </div>
                                </CardContent>
                              </Card>
                            </CarouselItem>
                          ))}
                        <CarouselItem key="video" className="max-w-5xl mx-auto">
                          <Card className="border rounded-lg shadow-sm bg-white overflow-hidden">
                            <CardHeader>
                              <CardTitle className="text-blue-700">Lesson Video</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                              <VideoPlayer
                                lesson={currentLesson}
                                courseId={courseId}
                                onProgress={handleLessonProgress}
                                onComplete={handleLessonComplete}
                              />
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      </CarouselContent>
                      <CarouselPrevious className="left-2 md:left-4 bg-white/90 border shadow-sm" />
                      <CarouselNext className="right-2 md:right-4 bg-white/90 border shadow-sm" />
                    </Carousel>
                  </div>
                )}

                {currentLesson.type === 'quiz' && (
                  <QuizInterface
                    quizId={currentLesson.id}
                    onComplete={handleQuizComplete}
                  />
                )}

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={previousLesson}
                    disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <Button
                    onClick={nextLesson}
                    disabled={currentModuleIndex === course.modules.length - 1 && 
                             currentLessonIndex === course.modules[currentModuleIndex].lessons.length - 1}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Course Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Modules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="space-y-2">
                    <h4 className="font-medium">{module.title}</h4>
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isCompleted = isLessonCompleted(moduleIndex, lessonIndex)
                        const canAccess = canAccessLesson(moduleIndex, lessonIndex)
                        const isCurrent = currentModuleIndex === moduleIndex && currentLessonIndex === lessonIndex

                        return (
                          <Button
                            key={lesson.id}
                            variant={isCurrent ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => navigateToLesson(moduleIndex, lessonIndex)}
                            disabled={!canAccess}
                            className={`w-full justify-start h-auto p-3 ${
                              isCompleted ? 'bg-green-50 border-green-200' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 w-full">
                              {lesson.type === 'video' ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <Trophy className="h-4 w-4" />
                              )}
                              <div className="flex-1 text-left">
                                <div className="text-sm">{lesson.title}</div>
                                <div className="text-xs text-gray-500">
                                  {lesson.duration} min
                                </div>
                              </div>
                              {isCompleted && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                            </div>
                          </Button>
                        )
                      })}
                    </div>
                    {moduleIndex < course.modules.length - 1 && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {progress?.completedLessons.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalLessons}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {Math.floor((progress?.timeSpent || 0) / 60)}h {(progress?.timeSpent || 0) % 60}m
                  </div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}