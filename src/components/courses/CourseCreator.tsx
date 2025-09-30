import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog'
import { toast } from 'sonner'
import { firestoreService, convertFileToBase64 } from '../../utils/firebase/database'
import { useAuth } from '../../hooks/useAuth'
import { QuizCreator } from '../quiz/QuizCreator'
import { 
  ArrowLeft,
  Save,
  Plus,
  X,
  Upload,
  Video,
  FileText,
  BookOpen,
  Clock,
  Target,
  Tag,
  Eye,
  EyeOff,
  Brain,
  Zap,
  File,
  FileImage,
  FileVideo,
  FileText as FilePdf,
  Download,
  Trash2,
  Microscope
} from 'lucide-react'

interface CourseFormData {
  title: string
  description: string
  shortDescription: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  category: string
  tags: string[]
  thumbnail: string
  isPublished: boolean
  modules: ModuleFormData[]
  attachments: UploadedFile[]
}

interface ModuleFormData {
  id: string
  title: string
  description: string
  lessons: LessonFormData[]
  attachments: UploadedFile[]
}

interface LessonFormData {
  id: string
  title: string
  type: 'video' | 'interactive' | 'quiz' | 'text' | 'document' | 'presentation' | 'mixed'
  duration: number
  content: string
  videoUrl?: string
  videoSources?: Partial<Record<
    | 'Afrikaans'
    | 'English'
    | 'IsiNdebele'
    | 'IsiXhosa'
    | 'IsiZulu'
    | 'Sesotho'
    | 'Sepedi'
    | 'Setswana'
    | 'SiSwati'
    | 'Tshivenda'
    | 'Xitsonga',
    string
  >>
  attachments: UploadedFile[]
  quizId?: string // Reference to quiz document for quiz lessons
  contentBlocks?: ContentBlockFormData[] // For mixed content lessons
}

interface ContentBlockFormData {
  id: string
  type: 'video' | 'text' | 'quiz' | 'document' | 'interactive'
  title: string
  content?: string
  videoUrl?: string
  quizId?: string
  attachments: UploadedFile[]
  order: number
  duration?: number
}

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  data: string
  url?: string
  uploadedAt?: Date
}

interface CourseCreatorProps {
  onBack: () => void
  onCourseCreated?: (courseId: string) => void
}

export function CourseCreator({ onBack, onCourseCreated }: CourseCreatorProps) {
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    shortDescription: '',
    difficulty: 'beginner',
    duration: 0,
    category: '',
    tags: [],
    thumbnail: '',
    isPublished: false,
    modules: [],
    attachments: []
  })

  const [newTag, setNewTag] = useState('')
  const [newModule, setNewModule] = useState({ title: '', description: '' })
  const [newLesson, setNewLesson] = useState<{ title: string; type: 'video' | 'quiz' | 'mixed'; duration: number; content: string; videoSources?: any }>({ title: '', type: 'video', duration: 0, content: '' })
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [showQuizCreator, setShowQuizCreator] = useState(false)
  const [currentQuizLesson, setCurrentQuizLesson] = useState<{ moduleId: string; lessonId: string } | null>(null)
  const [showContentBlockCreator, setShowContentBlockCreator] = useState(false)
  const [currentMixedLesson, setCurrentMixedLesson] = useState<{ moduleId: string; lessonId: string } | null>(null)
  const [newContentBlock, setNewContentBlock] = useState({ title: '', type: 'video' as const, content: '', duration: 0 })
  
  const southAfricanLanguages = [
    'Afrikaans',
    'English',
    'IsiNdebele',
    'IsiXhosa',
    'IsiZulu',
    'Sesotho',
    'Sepedi',
    'Setswana',
    'SiSwati',
    'Tshivenda',
    'Xitsonga'
  ] as const
  
  const { user } = useAuth()
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const moduleFileInputRef = useRef<HTMLInputElement>(null)
  const lessonFileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    'Breeding Management',
    'Reproductive Physiology',
    'Semen Collection & Processing',
    'Fertility Assessment',
    'Breeding Records & Documentation',
    'Animal Health & Welfare',
    'Genetic Selection',
    'Breeding Technologies',
    'Farm Management',
    'Veterinary Procedures'
  ]

  const allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/avi',
    'video/mov',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  const maxFileSize = 50 * 1024 * 1024 // 50MB

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <FileImage className="h-4 w-4 text-blue-500" />
    if (fileType.startsWith('video/')) return <FileVideo className="h-4 w-4 text-red-500" />
    if (fileType === 'application/pdf') return <FilePdf className="h-4 w-4 text-red-600" />
    return <File className="h-4 w-4 text-gray-500" />
  }

  const handleFileUpload = async (files: FileList, target: 'course' | 'module' | 'lesson', moduleId?: string, lessonId?: string) => {
    const validFiles: File[] = []
    const invalidFiles: string[] = []

    Array.from(files).forEach(file => {
      if (!allowedFileTypes.includes(file.type)) {
        invalidFiles.push(`${file.name} (unsupported file type)`)
        return
      }
      if (file.size > maxFileSize) {
        invalidFiles.push(`${file.name} (file too large)`)
        return
      }
      validFiles.push(file)
    })

    if (invalidFiles.length > 0) {
      toast.error(`Invalid files: ${invalidFiles.join(', ')}`)
    }

    if (validFiles.length === 0) return

    setUploadingFiles(true)
    setUploadProgress(0)

    try {
      const uploadedFiles: UploadedFile[] = []
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i]
        setUploadProgress((i / validFiles.length) * 100)
        
        // Convert file to base64
        const base64Data = await convertFileToBase64(file)
        
        const uploadedFile: UploadedFile = {
          id: `file_${Date.now()}_${i}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: base64Data
        }
        
        uploadedFiles.push(uploadedFile)
      }

      // Add files to appropriate target
      if (target === 'course') {
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, ...uploadedFiles]
        }))
      } else if (target === 'module' && moduleId) {
        setFormData(prev => ({
          ...prev,
          modules: prev.modules.map(module => 
            module.id === moduleId 
              ? { ...module, attachments: [...module.attachments, ...uploadedFiles] }
              : module
          )
        }))
      } else if (target === 'lesson' && moduleId && lessonId) {
        setFormData(prev => ({
          ...prev,
          modules: prev.modules.map(module => 
            module.id === moduleId 
              ? {
                  ...module, 
                  lessons: module.lessons.map(lesson => 
                    lesson.id === lessonId 
                      ? { ...lesson, attachments: [...lesson.attachments, ...uploadedFiles] }
                      : lesson
                  )
                }
              : module
          )
        }))
      }

      toast.success(`${uploadedFiles.length} file(s) uploaded successfully`)
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploadingFiles(false)
      setUploadProgress(0)
    }
  }

  const handleRemoveFile = (fileId: string, target: 'course' | 'module' | 'lesson', moduleId?: string, lessonId?: string) => {
    if (target === 'course') {
      setFormData(prev => ({
        ...prev,
        attachments: prev.attachments.filter(file => file.id !== fileId)
      }))
    } else if (target === 'module' && moduleId) {
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.map(module => 
          module.id === moduleId 
            ? { ...module, attachments: module.attachments.filter(file => file.id !== fileId) }
            : module
        )
      }))
    } else if (target === 'lesson' && moduleId && lessonId) {
      setFormData(prev => ({
        ...prev,
        modules: prev.modules.map(module => 
          module.id === moduleId 
            ? {
                ...module, 
                lessons: module.lessons.map(lesson => 
                  lesson.id === lessonId 
                    ? { ...lesson, attachments: lesson.attachments.filter(file => file.id !== fileId) }
                    : lesson
                )
              }
            : module
        )
      }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddModule = () => {
    if (newModule.title.trim()) {
      const moduleId = `module_${Date.now()}`
      const module: ModuleFormData = {
        id: moduleId,
        title: newModule.title,
        description: newModule.description,
        lessons: [],
        attachments: []
      }
      
      setFormData(prev => ({
        ...prev,
        modules: [...prev.modules, module]
      }))
      
      setNewModule({ title: '', description: '' })
      setSelectedModuleId(moduleId)
    }
  }

  const handleAddLesson = () => {
    if (selectedModuleId && newLesson.title.trim()) {
      const lessonId = `lesson_${Date.now()}`
      const lesson: LessonFormData = {
        id: lessonId,
        title: newLesson.title,
        type: newLesson.type,
        duration: newLesson.duration,
        content: newLesson.content,
        attachments: []
      }

      // If it's a quiz lesson, open the quiz creator
      if (newLesson.type === 'quiz') {
        setCurrentQuizLesson({ moduleId: selectedModuleId, lessonId })
        setShowQuizCreator(true)
        // Don't add the lesson yet, wait for quiz creation
        return
      }

      // If it's a mixed content lesson, open the content block creator
      if (newLesson.type === 'mixed') {
        setCurrentMixedLesson({ moduleId: selectedModuleId, lessonId })
        setShowContentBlockCreator(true)
        // Don't add the lesson yet, wait for content blocks to be added
        return
      }

      setFormData(prev => ({
        ...prev,
        modules: prev.modules.map(module => 
          module.id === selectedModuleId 
            ? { ...module, lessons: [...module.lessons, lesson] }
            : module
        )
      }))

      setNewLesson({ title: '', type: 'video', duration: 0, content: '' })
    }
  }

  const handleQuizCreated = (quiz: any) => {
    if (currentQuizLesson) {
      const lessonId = currentQuizLesson.lessonId
      const moduleId = currentQuizLesson.moduleId
      
      const lesson: LessonFormData = {
        id: lessonId,
        title: newLesson.title,
        type: newLesson.type,
        duration: newLesson.duration,
        content: newLesson.content,
        attachments: [],
        quizId: quiz.id // Link the quiz to the lesson
      }

      setFormData(prev => ({
        ...prev,
        modules: prev.modules.map(module => 
          module.id === moduleId 
            ? { ...module, lessons: [...module.lessons, lesson] }
            : module
        )
      }))

      setNewLesson({ title: '', type: 'video', duration: 0, content: '' })
      setCurrentQuizLesson(null)
      setShowQuizCreator(false)
      
      toast.success('Quiz lesson added successfully!')
    }
  }

  const handleQuizCreationCancel = () => {
    setCurrentQuizLesson(null)
    setShowQuizCreator(false)
    // Reset the lesson form since quiz creation was cancelled
    setNewLesson({ title: '', type: 'video', duration: 0, content: '' })
  }

  const handleContentBlockCreated = () => {
    if (currentMixedLesson) {
      const lessonId = currentMixedLesson.lessonId
      const moduleId = currentMixedLesson.moduleId
      
      const lesson: LessonFormData = {
        id: lessonId,
        title: newLesson.title,
        type: newLesson.type,
        duration: newLesson.duration,
        content: newLesson.content,
        attachments: [],
        contentBlocks: [] // Will be populated when content blocks are added
      }

      setFormData(prev => ({
        ...prev,
        modules: prev.modules.map(module => 
          module.id === moduleId 
            ? { ...module, lessons: [...module.lessons, lesson] }
            : module
        )
      }))

      setNewLesson({ title: '', type: 'video', duration: 0, content: '' })
      setCurrentMixedLesson(null)
      setShowContentBlockCreator(false)
      
      toast.success('Mixed content lesson added successfully!')
    }
  }

  const handleContentBlockCreationCancel = () => {
    setCurrentMixedLesson(null)
    setShowContentBlockCreator(false)
    // Reset the lesson form since content block creation was cancelled
    setNewLesson({ title: '', type: 'video', duration: 0, content: '' })
  }

  const handleRemoveModule = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.filter(module => module.id !== moduleId)
    }))
    if (selectedModuleId === moduleId) {
      setSelectedModuleId(null)
    }
  }

  const handleRemoveLesson = (moduleId: string, lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      modules: prev.modules.map(module => 
        module.id === moduleId 
          ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
          : module
      )
    }))
  }

  const calculateTotalDuration = () => {
    return formData.modules.reduce((total, module) => {
      return total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.duration, 0)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Course title is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Course description is required')
      return
    }

    if (formData.modules.length === 0) {
      toast.error('At least one module is required')
      return
    }

    setIsSubmitting(true)

    try {
      // Calculate total duration from modules and lessons
      const totalDuration = formData.modules.reduce((total, module) => {
        return total + module.lessons.reduce((moduleTotal, lesson) => moduleTotal + lesson.duration, 0)
      }, 0) / 60 // Convert minutes to hours

      // Create course data without large attachments to avoid payload size limits
      const courseData = {
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        duration: Math.round(totalDuration * 10) / 10, // Round to 1 decimal place
        thumbnail: formData.thumbnail || '/api/placeholder/400/200',
        modules: formData.modules.map(module => ({
          ...module,
          attachments: module.attachments.map(file => ({
            id: file.id,
            name: file.name,
            size: file.size,
            type: file.type,
            // Don't include the base64 data in the course document
            // Store only metadata, actual file data should be stored separately
          })),
          lessons: module.lessons.map(lesson => ({
            ...lesson,
            attachments: lesson.attachments.map(file => ({
              id: file.id,
              name: file.name,
              size: file.size,
              type: file.type,
              // Don't include the base64 data in the course document
            }))
          }))
        })),
        published: formData.isPublished,
        category: formData.category,
        attachments: formData.attachments.map(file => ({
          id: file.id,
          name: file.name,
          size: file.size,
          type: file.type,
          // Don't include the base64 data in the course document
        })),
        instructorId: user?.id || 'anonymous'
      }
      
      const createdCourse = await firestoreService.createCourse(courseData)
      
      toast.success('Course created successfully! Note: File attachments are stored as metadata only.')
      
      if (onCourseCreated) {
        onCourseCreated(createdCourse.id)
      } else {
        onBack()
      }
    } catch (error) {
      console.error('Error creating course:', error)
      toast.error('Failed to create course. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // const selectedModule = formData.modules.find(m => m.id === selectedModuleId)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Microscope className="h-8 w-8 text-green-600" />
              Create AI Course
            </h1>
            <p className="text-gray-600">Design and publish your artificial insemination course content</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {calculateTotalDuration()} min
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {formData.modules.length} modules
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter course title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Brief description (1-2 sentences)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Full Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detailed course description"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select value={formData.difficulty} onValueChange={(value: any) => handleInputChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail URL</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="isPublished">Status</Label>
                <Select value={formData.isPublished.toString()} onValueChange={(value: string) => handleInputChange('isPublished', value === 'true')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">Draft</SelectItem>
                    <SelectItem value="true">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Attachments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <File className="h-5 w-5 text-purple-600" />
              Course Materials & Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload Course Materials</h3>
              <p className="text-gray-600 mb-4">
                Upload documents, videos, images, and other resources for your AI course
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'course')}
                className="hidden"
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFiles}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {uploadingFiles ? 'Uploading...' : 'Choose Files'}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Supported: PDF, DOC, PPT, XLS, Images, Videos (Max 50MB each)
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Note: Files are stored as metadata only to prevent payload size limits.
              </p>
            </div>

            {uploadingFiles && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading files...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}

            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Uploaded Files ({formData.attachments.length})</h4>
                <div className="space-y-2">
                  {formData.attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(file.id, 'course')}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Course Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Course Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Module */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <h3 className="font-medium mb-4">Add New Module</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="moduleTitle">Module Title</Label>
                  <Input
                    id="moduleTitle"
                    value={newModule.title}
                    onChange={(e) => setNewModule(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter module title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moduleDescription">Module Description</Label>
                  <Input
                    id="moduleDescription"
                    value={newModule.description}
                    onChange={(e) => setNewModule(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief module description"
                  />
                </div>
              </div>
              <Button type="button" onClick={handleAddModule} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            </div>

            {/* Modules List */}
            {formData.modules.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Course Modules</h3>
                {formData.modules.map((module) => (
                  <div key={module.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        <p className="text-xs text-gray-500">{module.lessons.length} lessons</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedModuleId(module.id)}
                        >
                          {selectedModuleId === module.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveModule(module.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Add Lesson to Selected Module */}
                    {selectedModuleId === module.id && (
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-3">Add Lesson to this Module</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <Label htmlFor="lessonTitle">Lesson Title</Label>
                            <Input
                              id="lessonTitle"
                              value={newLesson.title}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Enter lesson title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lessonType">Lesson Type</Label>
                            <Select value={newLesson.type} onValueChange={(value: any) => setNewLesson(prev => ({ ...prev, type: value }))}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">Video Lesson</SelectItem>
                                <SelectItem value="interactive">Interactive Demo</SelectItem>
                                <SelectItem value="quiz">Assessment Quiz</SelectItem>
                                <SelectItem value="text">Reading Material</SelectItem>
                                <SelectItem value="document">Document Review</SelectItem>
                                <SelectItem value="presentation">Presentation</SelectItem>
                                <SelectItem value="mixed">Mixed Content (Video + Quiz, etc.)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lessonDuration">Duration (minutes)</Label>
                            <Input
                              id="lessonDuration"
                              type="number"
                              value={newLesson.duration}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                              placeholder="0"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="lessonContent">Content/Description</Label>
                            <Input
                              id="lessonContent"
                              value={newLesson.content}
                              onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                              placeholder="Lesson content description"
                            />
                          </div>
                        </div>
                        {/* Per-language video sources for Video lessons */}
                        {newLesson.type === 'video' && (
                          <div className="space-y-4 mt-2">
                            <div className="rounded-md border p-3">
                              <div className="mb-2 font-medium text-sm">Video sources per language</div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {southAfricanLanguages.map((lang) => (
                                  <div key={lang} className="space-y-1">
                                    <Label>{lang}</Label>
                                    <Input
                                      placeholder={`Paste YouTube URL or file URL for ${lang}`}
                                      value={(newLesson.videoSources && newLesson.videoSources[lang as keyof typeof newLesson.videoSources]) || ''}
                                      onChange={(e) => setNewLesson(prev => ({
                                        ...prev,
                                        videoSources: {
                                          ...(prev.videoSources || {}),
                                          [lang]: e.target.value
                                        }
                                      }))}
                                    />
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Provide any that you have; learners will be able to switch languages in the player.</p>
                            </div>
                          </div>
                        )}

                        <Button type="button" onClick={handleAddLesson} className="flex items-center gap-2 mt-2">
                          <Plus className="h-4 w-4" />
                          Add Lesson
                        </Button>
                      </div>
                    )}

                    {/* Module File Upload */}
                    <div className="border-t pt-4 mt-4">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <File className="h-4 w-4" />
                        Module Materials
                      </h4>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <input
                          ref={moduleFileInputRef}
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                          onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'module', module.id)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => moduleFileInputRef.current?.click()}
                          disabled={uploadingFiles}
                          className="flex items-center gap-2"
                        >
                          <Upload className="h-4 w-4" />
                          Upload Files
                        </Button>
                      </div>
                      
                      {module.attachments.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <h5 className="font-medium text-sm">Module Files ({module.attachments.length})</h5>
                          {module.attachments.map((file) => (
                            <div key={file.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div className="flex items-center gap-2">
                                {getFileIcon(file.type)}
                                <span className="text-sm">{file.name}</span>
                                <Badge variant="outline" className="text-xs">
                                  {formatFileSize(file.size)}
                                </Badge>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveFile(file.id, 'module', module.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Module Lessons */}
                    {module.lessons.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h5 className="font-medium text-sm">Lessons in this module:</h5>
                        {module.lessons.map((lesson) => (
                          <div key={lesson.id} className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  {lesson.type === 'video' && <Video className="h-3 w-3 text-blue-600" />}
                                  {lesson.type === 'interactive' && <Zap className="h-3 w-3 text-green-600" />}
                                  {lesson.type === 'quiz' && <Target className="h-3 w-3 text-orange-600" />}
                                  {lesson.type === 'text' && <FileText className="h-3 w-3 text-purple-600" />}
                                  {lesson.type === 'document' && <FilePdf className="h-3 w-3 text-red-600" />}
                                  {lesson.type === 'presentation' && <File className="h-3 w-3 text-indigo-600" />}
                                </div>
                                <span className="text-sm font-medium">{lesson.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {lesson.duration} min
                                </Badge>
                                {lesson.type === 'quiz' && lesson.quizId && (
                                  <Badge variant="secondary" className="text-xs">
                                    Quiz Linked
                                  </Badge>
                                )}
                                {lesson.type === 'mixed' && lesson.contentBlocks && (
                                  <Badge variant="outline" className="text-xs">
                                    {lesson.contentBlocks.length} Content Blocks
                                  </Badge>
                                )}
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveLesson(module.id, lesson.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Lesson File Upload */}
                            <div className="ml-8 border-l-2 border-gray-200 pl-4">
                              <div className="flex items-center gap-2 mb-2">
                                <File className="h-3 w-3" />
                                <span className="text-xs font-medium">Lesson Materials</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  ref={lessonFileInputRef}
                                  type="file"
                                  multiple
                                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mov"
                                  onChange={(e) => e.target.files && handleFileUpload(e.target.files, 'lesson', module.id, lesson.id)}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => lessonFileInputRef.current?.click()}
                                  disabled={uploadingFiles}
                                  className="text-xs"
                                >
                                  <Upload className="h-3 w-3 mr-1" />
                                  Add Files
                                </Button>
                                {lesson.attachments.length > 0 && (
                                  <span className="text-xs text-gray-500">
                                    ({lesson.attachments.length} files)
                                  </span>
                                )}
                              </div>
                              
                              {lesson.attachments.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {lesson.attachments.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-1 bg-white rounded text-xs">
                                      <div className="flex items-center gap-1">
                                        {getFileIcon(file.type)}
                                        <span>{file.name}</span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleRemoveFile(file.id, 'lesson', module.id, lesson.id)}
                                        className="text-red-600 hover:text-red-700 h-4 w-4 p-0"
                                      >
                                        <X className="h-2 w-2" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create AI Course
              </>
            )}
          </Button>
        </div>
      </form>

      {/* Quiz Creator Dialog */}
      <Dialog open={showQuizCreator} onOpenChange={setShowQuizCreator}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Quiz for Lesson</DialogTitle>
            <p className="text-sm text-gray-600">
              Create an assessment quiz that will be linked to this lesson.
            </p>
          </DialogHeader>
          <QuizCreator
            courseId={undefined} // Will be set when course is created
            onQuizCreated={handleQuizCreated}
            onCancel={handleQuizCreationCancel}
          />
        </DialogContent>
      </Dialog>

      {/* Content Block Creator Dialog */}
      <Dialog open={showContentBlockCreator} onOpenChange={setShowContentBlockCreator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Mixed Content Lesson</DialogTitle>
            <p className="text-sm text-gray-600">
              Create a lesson with multiple content types (e.g., video followed by quiz).
            </p>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium">Lesson: {newLesson.title}</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="blockTitle">Content Block Title</Label>
                    <Input
                      id="blockTitle"
                      value={newContentBlock.title}
                      onChange={(e) => setNewContentBlock(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Introduction Video"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="blockType">Content Type</Label>
                    <Select 
                      value={newContentBlock.type} 
                      onValueChange={(value: any) => setNewContentBlock(prev => ({ ...prev, type: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="text">Text Content</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="document">Document</SelectItem>
                        <SelectItem value="interactive">Interactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blockContent">Content/Description</Label>
                  <Input
                    id="blockContent"
                    value={newContentBlock.content}
                    onChange={(e) => setNewContentBlock(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Description of this content block"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleContentBlockCreationCancel}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    onClick={handleContentBlockCreated}
                  >
                    Create Mixed Lesson
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
