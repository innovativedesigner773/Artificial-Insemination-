import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { downloadBase64File } from '../../utils/firebase/database'
import { getDummyCourseById } from '../../utils/dummyData'
import { toast } from 'sonner'
import { 
  ArrowLeft,
  ArrowRight,
  Clock,
  BookOpen,
  Star,
  Users,
  Play,
  Download,
  FileText,
  Video,
  File,
  CheckCircle,
  Award,
  Target,
  Brain,
  Zap,
  TrendingUp,
  Eye
} from 'lucide-react'
import { CourseFaqBot } from './CourseFaqBot'
import type { Course } from '../../types'

interface CourseDetailViewProps {
  courseId: string
  onBack: () => void
  onStartLearning: (courseId: string) => void
}

export function CourseDetailView({ courseId, onBack, onStartLearning }: CourseDetailViewProps) {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<string | null>(null)

  useEffect(() => {
    loadCourse()
  }, [courseId])

  const loadCourse = async () => {
    try {
      setLoading(true)
      const courseData = getDummyCourseById(courseId)
      setCourse(courseData)
      if (courseData && courseData.modules.length > 0) {
        setSelectedModule(courseData.modules[0].id)
      }
    } catch (error) {
      console.error('Failed to load course:', error)
      toast.error('Failed to load course details')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4 text-red-500" />
      case 'quiz': return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'document': return <FileText className="h-4 w-4 text-green-500" />
      case 'presentation': return <FileText className="h-4 w-4 text-purple-500" />
      default: return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const totalLessons = course?.modules.reduce((sum, module) => sum + module.lessons.length, 0) || 0
  const totalDuration = course?.modules.reduce((sum, module) => 
    sum + module.lessons.reduce((moduleSum, lesson) => moduleSum + lesson.duration, 0), 0
  ) || 0

  const viewFile = (file: any) => {
    // Create a blob URL for viewing
    const byteCharacters = atob(file.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: file.type });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course not found</h3>
          <p className="text-gray-500 mb-4">The course you're looking for doesn't exist or has been removed.</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </div>
      </div>
    )
  }

  const currentModule = course.modules.find(m => m.id === selectedModule)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Courses
        </Button>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" />
          <span className="text-sm text-gray-600">Course Details</span>
        </div>
      </div>

      {/* Course Hero Section */}
      <Card className="overflow-hidden">
        <div className="relative">
          <ImageWithFallback
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-6 left-6 right-6">
            <div className="flex items-start justify-between">
              <Badge className={`${getDifficultyColor(course.difficulty)} shadow-soft border font-semibold`}>
                <Target className="h-3 w-3 mr-1" />
                {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
              </Badge>
              <Badge className="bg-white/95 text-gray-700 border shadow-soft font-semibold">
                <Star className="h-3 w-3 mr-1 text-yellow-500" />
                {course.category}
              </Badge>
            </div>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-3xl font-bold text-white mb-2">{course.title}</h1>
            <p className="text-white/90 text-lg leading-relaxed">{course.description}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-600" />
                Course Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-700">{Math.round(totalDuration / 60)}h</div>
                  <div className="text-sm text-green-600">Duration</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-700">{course.modules.length}</div>
                  <div className="text-sm text-blue-600">Modules</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Video className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">{totalLessons}</div>
                  <div className="text-sm text-purple-600">Lessons</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Users className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-700">1.2k</div>
                  <div className="text-sm text-yellow-600">Students</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Course Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.modules.map((module, index) => (
                  <div
                    key={module.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedModule === module.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                    }`}
                    onClick={() => setSelectedModule(module.id)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="font-semibold text-gray-900">{module.title}</h3>
                    </div>
                    {module.description && (
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Video className="h-4 w-4" />
                        {module.lessons.length} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {Math.round(module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0) / 60)}h
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Module Details */}
          {currentModule && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    {currentModule.title} - Lessons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentModule.lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              {getLessonIcon(lesson.type)}
                              {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {lesson.duration} min
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Module Attachments */}
              {currentModule.attachments && currentModule.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-600" />
                      {currentModule.title} - Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentModule.attachments.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900 truncate max-w-32">{file.name}</p>
                              <p className="text-xs text-gray-500">{Math.round(file.size / 1024)}KB</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs"
                              onClick={() => viewFile(file)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 px-3 text-xs"
                              onClick={() => file.data && downloadBase64File(file.data, file.name, file.type)}
                            
                            >
                              <Download className="h-3 w-3 mr-1" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Course Roadmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                Course Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {course.modules.map((m, mi) => (
                  <div key={m.id} className="relative pl-8">
                    <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200" />
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 rounded-full bg-green-500 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{mi + 1}. {m.title}</h4>
                          <Badge variant="outline" className="text-xs">{m.lessons.length} lessons</Badge>
                        </div>
                        {m.description && (
                          <p className="text-sm text-gray-600">{m.description}</p>
                        )}
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                          {m.lessons.slice(0, 4).map((l, li) => (
                            <div key={l.id} className="text-sm text-gray-700 flex items-center gap-2">
                              <span className="text-gray-400">{mi + 1}.{li + 1}</span>
                              <span className="truncate">{l.title}</span>
                              <span className="text-gray-400">• {l.duration}m</span>
                            </div>
                          ))}
                          {m.lessons.length > 4 && (
                            <div className="text-sm text-gray-500">+{m.lessons.length - 4} more…</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Get Started
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => onStartLearning(courseId)}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-medium hover-lift rounded-xl font-semibold"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              
              <div className="text-center text-sm text-gray-600">
                <span className="flex items-center justify-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Free to enroll
                </span>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Bot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-green-600" />
                FAQs & Help
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CourseFaqBot />
            </CardContent>
          </Card>

          {/* Course Materials */}
          {course.attachments && course.attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Course Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate max-w-32">{file.name}</p>
                          <p className="text-xs text-gray-500">{Math.round(file.size / 1024)}KB</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          onClick={() => viewFile(file)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-3 text-xs"
                          onClick={() => file.data && downloadBase64File(file.data, file.name, file.type)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Course Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Rating</span>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">4.8</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reviews</span>
                <span className="font-medium">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completion Rate</span>
                <span className="font-medium">94%</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Updated</span>
                <span className="text-sm font-medium">
                  {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() : 'Recently'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
