import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import { firestoreService } from '../../utils/firebase/database'
import { ModuleEditor } from './ModuleEditor'
import { LessonEditor } from './LessonEditor'
import { 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Play,
  Trophy,
  FileText,
  Video,
  Brain,
  Target
} from 'lucide-react'
import type { Course, Module, Lesson } from '../../types'

interface CourseContentManagerProps {
  course: Course
  onBack: () => void
  onContentUpdated?: (courseId: string) => void
}

export function CourseContentManager({ course, onBack }: CourseContentManagerProps) {
  const [modules, setModules] = useState<Module[]>(course.modules || [])
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [showModuleEditor, setShowModuleEditor] = useState(false)
  const [showLessonEditor, setShowLessonEditor] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddModule = () => {
    setEditingModule(null)
    setShowModuleEditor(true)
  }

  const handleEditModule = (module: Module) => {
    setEditingModule(module)
    setShowModuleEditor(true)
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm('Are you sure you want to delete this module? This will also delete all lessons in this module.')) {
      try {
        setLoading(true)
        await firestoreService.deleteModule(course.id, moduleId)
        setModules(prev => prev.filter(m => m.id !== moduleId))
        toast.success('Module deleted successfully')
      } catch (error) {
        console.error('Failed to delete module:', error)
        toast.error('Failed to delete module')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddLesson = (module: Module) => {
    setSelectedModule(module)
    setEditingLesson(null)
    setShowLessonEditor(true)
  }

  const handleEditLesson = (module: Module, lesson: Lesson) => {
    setSelectedModule(module)
    setEditingLesson(lesson)
    setShowLessonEditor(true)
  }

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
      try {
        setLoading(true)
        await firestoreService.deleteLesson(course.id, moduleId, lessonId)
        setModules(prev => prev.map(module => 
          module.id === moduleId 
            ? { ...module, lessons: module.lessons.filter(l => l.id !== lessonId) }
            : module
        ))
        toast.success('Lesson deleted successfully')
      } catch (error) {
        console.error('Failed to delete lesson:', error)
        toast.error('Failed to delete lesson')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleModuleSaved = (savedModule: Module) => {
    if (editingModule) {
      // Update existing module
      setModules(prev => prev.map(m => m.id === savedModule.id ? savedModule : m))
      toast.success('Module updated successfully')
    } else {
      // Add new module
      setModules(prev => [...prev, savedModule])
      toast.success('Module created successfully')
    }
    setShowModuleEditor(false)
    setEditingModule(null)
  }

  const handleLessonSaved = (savedLesson: Lesson) => {
    if (editingLesson) {
      // Update existing lesson
      setModules(prev => prev.map(module => 
        module.id === selectedModule?.id 
          ? { ...module, lessons: module.lessons.map(l => l.id === savedLesson.id ? savedLesson : l) }
          : module
      ))
      toast.success('Lesson updated successfully')
    } else {
      // Add new lesson
      setModules(prev => prev.map(module => 
        module.id === selectedModule?.id 
          ? { ...module, lessons: [...module.lessons, savedLesson] }
          : module
      ))
      toast.success('Lesson created successfully')
    }
    setShowLessonEditor(false)
    setSelectedModule(null)
    setEditingLesson(null)
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4" />
      case 'quiz':
        return <Trophy className="h-4 w-4" />
      case 'text':
        return <FileText className="h-4 w-4" />
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'presentation':
        return <Video className="h-4 w-4" />
      case 'interactive':
        return <Brain className="h-4 w-4" />
      case 'mixed':
        return <Target className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getLessonTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'quiz':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'text':
        return 'bg-gray-100 text-gray-700 border-gray-200'
      case 'document':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'presentation':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'interactive':
        return 'bg-pink-100 text-pink-700 border-pink-200'
      case 'mixed':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="hover:bg-gray-100">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">Manage course content and structure</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-green-100 text-green-700 border-green-200">
                {modules.length} Modules
              </Badge>
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                {modules.reduce((sum, module) => sum + module.lessons.length, 0)} Lessons
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Add Module Button */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-primary-green transition-colors">
            <CardContent className="p-6">
              <Button 
                onClick={handleAddModule}
                className="w-full h-16 bg-transparent hover:bg-primary-green/5 border-0 text-primary-green hover:text-primary-green font-semibold"
                variant="outline"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New Module
              </Button>
            </CardContent>
          </Card>

          {/* Modules List */}
          {modules.map((module) => (
            <Card key={module.id} className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary-green to-secondary-green text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
                      {module.description && (
                        <p className="text-white/80 text-sm mt-1">{module.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {module.lessons.length} Lessons
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditModule(module)}
                      className="text-white hover:bg-white/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteModule(module.id)}
                      className="text-white hover:bg-red-500/20"
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Add Lesson Button */}
                  <Button 
                    onClick={() => handleAddLesson(module)}
                    className="w-full bg-primary-green/10 hover:bg-primary-green/20 text-primary-green border-primary-green/20"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Lesson to {module.title}
                  </Button>

                  {/* Lessons List */}
                  {module.lessons.length > 0 ? (
                    <div className="space-y-3">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-lg ${getLessonTypeColor(lesson.type)}`}>
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                                <Badge className={getLessonTypeColor(lesson.type)}>
                                  {lesson.type}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {lesson.duration} min
                                </span>
                                {lesson.videoUrl && (
                                  <span className="flex items-center gap-1">
                                    <Video className="h-3 w-3" />
                                    Video
                                  </span>
                                )}
                                {lesson.quizId && (
                                  <span className="flex items-center gap-1">
                                    <Trophy className="h-3 w-3" />
                                    Quiz
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditLesson(module, lesson)}
                              className="text-gray-600 hover:text-primary-green"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteLesson(module.id, lesson.id)}
                              className="text-gray-600 hover:text-red-600"
                              disabled={loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>No lessons in this module yet</p>
                      <p className="text-sm">Click "Add Lesson" to get started</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {modules.length === 0 && (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Modules Yet</h3>
                <p className="text-gray-500 mb-4">Start building your course by adding your first module</p>
                <Button onClick={handleAddModule} className="bg-primary-green hover:bg-secondary-green">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Module
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Module Editor Dialog */}
      <Dialog open={showModuleEditor} onOpenChange={setShowModuleEditor}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingModule ? 'Edit Module' : 'Create New Module'}
            </DialogTitle>
          </DialogHeader>
          <ModuleEditor
            courseId={course.id}
            module={editingModule}
            onSaved={handleModuleSaved}
            onCancel={() => setShowModuleEditor(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Lesson Editor Dialog */}
      <Dialog open={showLessonEditor} onOpenChange={setShowLessonEditor}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? 'Edit Lesson' : 'Create New Lesson'}
            </DialogTitle>
          </DialogHeader>
          {selectedModule && (
            <LessonEditor
              courseId={course.id}
              moduleId={selectedModule.id}
              lesson={editingLesson}
              onSaved={handleLessonSaved}
              onCancel={() => setShowLessonEditor(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
