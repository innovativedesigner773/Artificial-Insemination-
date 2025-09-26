import { useState } from 'react'
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { 
  Clock, 
  BookOpen, 
  Star, 
  Users, 
  Play,
  CheckCircle,
  Loader2,
  Sparkles,
  Brain,
  Target,
  Zap,
  Award,
  TrendingUp,
  Eye,
  ArrowRight,
  Shield,
  Lightbulb,
  Flame
} from 'lucide-react'
import type { Course } from '../../types'

interface CourseCardProps {
  course: Course
  onEnroll: (courseId: string) => Promise<void>
  isEnrolled?: boolean
  progress?: number
}

export function CourseCard({ course, onEnroll, isEnrolled = false, progress = 0 }: CourseCardProps) {
  const [enrolling, setEnrolling] = useState(false)

  const handleEnroll = async () => {
    setEnrolling(true)
    try {
      await onEnroll(course.id)
    } finally {
      setEnrolling(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalLessons = course.modules.reduce((sum, module) => sum + module.lessons.length, 0)

  return (
    <Card className="h-full flex flex-col hover-lift shadow-soft border-0 bg-white overflow-hidden group">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <ImageWithFallback
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-4 left-4">
            <Badge className={`${getDifficultyColor(course.difficulty)} shadow-soft border-0 font-semibold`}>
              <Target className="h-3 w-3 mr-1" />
              {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <Badge className="bg-white/95 text-gray-700 border-0 shadow-soft font-semibold">
              <Star className="h-3 w-3 mr-1 text-yellow-500" />
              {course.category}
            </Badge>
          </div>
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button size="sm" className="w-full bg-white/90 text-gray-900 hover:bg-white shadow-medium">
              <Eye className="h-4 w-4 mr-2" />
              Preview Course
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-6 space-y-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-bold text-xl text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
              {course.title}
            </h3>
            <div className="flex items-center gap-1 ml-2">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              <span className="text-xs font-semibold text-yellow-600">Featured</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{course.duration}h</span>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <BookOpen className="h-4 w-4" />
            <span className="font-medium">{totalLessons} lessons</span>
          </div>
          <div className="flex items-center gap-2 text-purple-600">
            <Users className="h-4 w-4" />
            <span className="font-medium">{Math.floor(Math.random() * 500) + 100} students</span>
          </div>
        </div>

        {/* Module Overview */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-green-600" />
            <h4 className="text-sm font-semibold text-gray-700">Course Modules:</h4>
          </div>
          <div className="space-y-2">
            {course.modules.slice(0, 2).map((module, index) => (
              <div key={module.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center shadow-soft">
                  <span className="text-white font-bold text-xs">{index + 1}</span>
                </div>
                <span className="flex-1 text-sm font-medium text-gray-700 truncate">{module.title}</span>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  {module.lessons.length} lessons
                </Badge>
              </div>
            ))}
            {course.modules.length > 2 && (
              <div className="flex items-center gap-2 text-sm text-gray-500 pl-9">
                <ArrowRight className="h-3 w-3" />
                <span>+{course.modules.length - 2} more modules</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress for enrolled courses */}
        {isEnrolled && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-700">4.{Math.floor(Math.random() * 9) + 1}</span>
            <span className="text-sm text-gray-500">(120 reviews)</span>
          </div>
          <div className="flex items-center gap-1 text-green-600">
            <Award className="h-4 w-4" />
            <span className="text-sm font-medium">Certified</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {isEnrolled ? (
          <Button className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-medium hover-lift rounded-xl font-semibold">
            <Play className="h-5 w-5 mr-2" />
            Continue Learning
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleEnroll} 
            className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-medium hover-lift rounded-xl font-semibold"
            disabled={enrolling}
          >
            {enrolling ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Enrolling...
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
                Enroll Now
                <Sparkles className="h-4 w-4 ml-2 animate-pulse" />
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}