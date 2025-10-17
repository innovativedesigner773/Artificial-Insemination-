import { useState, useEffect } from 'react'
import type { Course } from '../../types'
import { CourseCard } from './CourseCard'
import { CourseFaqBot } from './CourseFaqBot'
import { useAuth } from '../../hooks/useAuth'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Skeleton } from '../ui/skeleton'
import { Switch } from '../ui/switch'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { api } from '../../services/api'
import { 
  Search, 
  Filter, 
  BookOpen, 
  Sparkles, 
  Brain, 
  Target, 
  Zap, 
  Star, 
  Award,
  SlidersHorizontal,
  Eye,
  EyeOff,
  FileText
} from 'lucide-react'

interface CourseListProps {
  onGetStarted?: (courseId: string) => void
  onEditCourse?: (course: Course) => void
}

export function CourseList({ onGetStarted, onEditCourse }: CourseListProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showDrafts, setShowDrafts] = useState(false)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    filterCourses()
  }, [courses, searchTerm, selectedDifficulty, selectedCategory, showDrafts])

  const loadCourses = async () => {
    try {
      // For admins, load all courses (including unpublished)
      // For regular users, load only published courses
      const coursesData = isAdmin ? await api.getAllCourses() : await api.getCourses()
      setCourses(coursesData)
      
      if (isAdmin) {
        console.log('Admin view: Loaded all courses including unpublished ones')
        console.log('Total courses loaded:', coursesData.length)
      }
    } catch (error) {
      console.error('Failed to load courses:', error)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const filterCourses = () => {
    let filtered = [...courses]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(course => course.difficulty === selectedDifficulty)
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Filter by draft/published status (only for admins)
    if (isAdmin) {
      if (showDrafts) {
        filtered = filtered.filter(course => !course.published)
      } else {
        filtered = filtered.filter(course => course.published)
      }
    }

    setFilteredCourses(filtered)
  }

  const handleGetStarted = (courseId: string) => {
    if (onGetStarted) {
      onGetStarted(courseId)
    } else {
      console.log('Navigate to course:', courseId)
    }
  }

  const categories = [...new Set(courses.map(course => course.category))]
  const difficulties = ['beginner', 'intermediate', 'advanced']

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-80" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3">
          <Brain className="h-8 w-8 text-green-600 animate-pulse" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Course Catalog
          </h1>
          <Sparkles className="h-8 w-8 text-yellow-500 float" />
        </div>
        <p className="text-gray-600 max-w-3xl mx-auto text-lg">
          Explore our comprehensive artificial insemination courses designed to enhance your skills and knowledge
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-green-100 text-green-700 border-green-200 px-4 py-2">
            <Target className="h-4 w-4 mr-2" />
            Expert-Led Courses
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
            <Award className="h-4 w-4 mr-2" />
            Industry Certifications
          </Badge>
          <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2">
            <Zap className="h-4 w-4 mr-2" />
            Interactive Learning
          </Badge>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 shadow-soft border border-green-100">
        <div className="flex items-center gap-3 mb-4">
          <SlidersHorizontal className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold text-gray-800">Filter Courses</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search courses, topics, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-xl"
            />
          </div>
          
          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger className="w-full md:w-48 h-12 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-xl">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-green-600" />
                <SelectValue placeholder="Difficulty Level" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      difficulty === 'beginner' ? 'bg-green-500' :
                      difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48 h-12 border-green-200 focus:border-green-400 focus:ring-green-400 rounded-xl">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-600" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Draft/Published Toggle - Only for Admins */}
        {isAdmin && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-green-600" />
                <Label htmlFor="draft-toggle" className="font-medium text-gray-700">
                  Show Drafts
                </Label>
                <Switch
                  id="draft-toggle"
                  checked={showDrafts}
                  onCheckedChange={setShowDrafts}
                />
              </div>
              <div className="flex items-center gap-2">
                {showDrafts ? (
                  <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                    <EyeOff className="h-3 w-3 mr-1" />
                    Draft Mode
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Published Mode
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {showDrafts 
                ? "Showing only draft courses that are not yet published" 
                : "Showing only published courses visible to students"
              }
            </p>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-500" />
          <span className="text-gray-600">
            {filteredCourses.length} of {courses.length} courses
          </span>
          {isAdmin && (
            <Badge className={showDrafts ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}>
              {showDrafts ? "Draft View" : "Published View"}
            </Badge>
          )}
        </div>
        
        {(searchTerm || selectedDifficulty !== 'all' || selectedCategory !== 'all' || (isAdmin && showDrafts)) && (
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filters active:</span>
            {searchTerm && (
              <Badge variant="secondary" onClick={() => setSearchTerm('')} className="cursor-pointer">
                "{searchTerm}" ×
              </Badge>
            )}
            {selectedDifficulty !== 'all' && (
              <Badge variant="secondary" onClick={() => setSelectedDifficulty('all')} className="cursor-pointer">
                {selectedDifficulty} ×
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" onClick={() => setSelectedCategory('all')} className="cursor-pointer">
                {selectedCategory} ×
              </Badge>
            )}
            {isAdmin && showDrafts && (
              <Badge variant="secondary" onClick={() => setShowDrafts(false)} className="cursor-pointer">
                Drafts ×
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters to find more courses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course} 
              onGetStarted={handleGetStarted}
              onEditCourse={onEditCourse}
              showEditButton={isAdmin}
            />
          ))}
        </div>
      )}

      {/* Course FAQ Chatbot */}
      <CourseFaqBot 
        isOpen={isChatbotOpen} 
        onToggle={() => setIsChatbotOpen(!isChatbotOpen)} 
      />
    </div>
  )
}