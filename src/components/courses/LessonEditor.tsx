import { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { toast } from 'sonner'
import { firestoreService } from '../../utils/firebase/database'
import { 
  Save,
  X,
  Play,
  Trophy,
  FileText,
  Video,
  Brain,
  Target,
  Upload,
  Trash2,
  Globe,
  BookOpen
} from 'lucide-react'
import type { Lesson, UploadedFile, Quiz } from '../../types'

interface LessonEditorProps {
  courseId: string
  moduleId: string
  lesson?: Lesson | null
  onSaved: (lesson: Lesson) => void
  onCancel: () => void
}

const lessonTypes = [
  { value: 'video', label: 'Video Lesson', icon: Play, description: 'Video content with optional text' },
  { value: 'quiz', label: 'Quiz', icon: Trophy, description: 'Interactive quiz or assessment' },
  { value: 'text', label: 'Text Lesson', icon: FileText, description: 'Text-based content and reading' },
  { value: 'document', label: 'Document', icon: FileText, description: 'PDF or document-based content' },
  { value: 'presentation', label: 'Presentation', icon: Video, description: 'Slide presentation or slideshow' },
  { value: 'interactive', label: 'Interactive', icon: Brain, description: 'Interactive content or simulation' },
  { value: 'mixed', label: 'Mixed Content', icon: Target, description: 'Combination of different content types' }
]

const languages = [
  'English', 'Afrikaans', 'IsiZulu', 'IsiXhosa', 'Sesotho', 'Setswana', 
  'SiSwati', 'IsiNdebele', 'Sepedi', 'Tshivenda', 'Xitsonga'
]

export function LessonEditor({ courseId, moduleId, lesson, onSaved, onCancel }: LessonEditorProps) {
  const [formData, setFormData] = useState({
    title: lesson?.title || '',
    duration: lesson?.duration || 0,
    type: lesson?.type || 'video',
    content: lesson?.content || '',
    videoUrl: lesson?.videoUrl || '',
  })
  const [videoSources, setVideoSources] = useState<Record<string, string>>(lesson?.videoSources || {})
  const [attachments, setAttachments] = useState<UploadedFile[]>(lesson?.attachments || [])
  const [availableQuizzes, setAvailableQuizzes] = useState<Quiz[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string>(lesson?.quizId || '')
  const [loading, setLoading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState(false)

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      const quizzes = await firestoreService.getQuizzes()
      setAvailableQuizzes(quizzes)
    } catch (error) {
      console.error('Failed to load quizzes:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Lesson title is required')
      return
    }

    if (formData.duration <= 0) {
      toast.error('Lesson duration must be greater than 0')
      return
    }

    try {
      setLoading(true)
      
      // Build lesson data and filter out undefined values
      const lessonData: any = {
        id: lesson?.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: formData.title.trim(),
        duration: formData.duration,
        type: formData.type as any,
        content: formData.content.trim(),
      }

      // Only add optional fields if they have values
      if (formData.videoUrl.trim()) {
        lessonData.videoUrl = formData.videoUrl.trim()
      }
      
      if (Object.keys(videoSources).length > 0) {
        lessonData.videoSources = videoSources
      }
      
      if (attachments.length > 0) {
        lessonData.attachments = attachments
      }
      
      if (selectedQuizId) {
        lessonData.quizId = selectedQuizId
      }

      let savedLesson: Lesson
      
      if (lesson) {
        // Update existing lesson
        savedLesson = await firestoreService.updateLesson(courseId, moduleId, lesson.id, lessonData)
      } else {
        // Create new lesson
        savedLesson = await firestoreService.createLesson(courseId, moduleId, lessonData)
      }

      onSaved(savedLesson)
    } catch (error) {
      console.error('Failed to save lesson:', error)
      toast.error('Failed to save lesson')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    try {
      setUploadingFiles(true)
      
      for (const file of Array.from(files)) {
        const base64Data = await firestoreService.convertFileToBase64(file)
        const uploadedFile: UploadedFile = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: base64Data
        }
        
        setAttachments(prev => [...prev, uploadedFile])
      }
      
      toast.success('Files uploaded successfully')
    } catch (error) {
      console.error('Failed to upload files:', error)
      toast.error('Failed to upload files')
    } finally {
      setUploadingFiles(false)
    }
  }

  const handleRemoveAttachment = (fileId: string) => {
    setAttachments(prev => prev.filter(file => file.id !== fileId))
  }

  const handleVideoSourceChange = (language: string, value: string) => {
    setVideoSources(prev => ({
      ...prev,
      [language]: value
    }))
  }


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Lesson Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-semibold">
                Lesson Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-semibold">
                Duration (minutes) *
              </Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="Enter duration in minutes"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Lesson Type *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lessonTypes.map((type) => {
                const Icon = type.icon
                return (
                  <div
                    key={type.value}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.type === type.value
                        ? 'border-primary-green bg-primary-green/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, type: type.value as any }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        formData.type === type.value ? 'bg-primary-green text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{type.label}</h4>
                        <p className="text-xs text-gray-500">{type.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content based on type */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label htmlFor="content" className="text-sm font-semibold">
                  Lesson Content
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Enter the main content for this lesson..."
                  className="w-full min-h-[200px]"
                  rows={8}
                />
                <p className="text-xs text-gray-500">
                  Use markdown formatting for rich text. Include headings, lists, and formatting as needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Label htmlFor="videoUrl" className="text-sm font-semibold">
                  Video URL
                </Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="YouTube, Vimeo, or direct video URL"
                />
                <p className="text-xs text-gray-500">
                  Enter a YouTube, Vimeo, or direct video URL for this lesson.
                </p>

                {/* Multi-language Video Sources */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <Label className="text-sm font-semibold">Multi-language Video Sources</Label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Provide video URLs in different languages for better accessibility.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {languages.map((language) => (
                      <div key={language} className="space-y-1">
                        <Label className="text-xs font-medium">{language}</Label>
                        <Input
                          value={videoSources[language] || ''}
                          onChange={(e) => handleVideoSourceChange(language, e.target.value)}
                          placeholder={`Video URL for ${language}`}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Lesson Materials
                  </h3>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingFiles}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingFiles}
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {uploadingFiles ? 'Uploading...' : 'Add Files'}
                    </Button>
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Attached files:</p>
                    {attachments.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">
                              {(file.size / 1024).toFixed(1)} KB • {file.type}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveAttachment(file.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {attachments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No files attached yet</p>
                    <p className="text-xs">Upload documents, images, or other materials for this lesson</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quiz Selection for Quiz Lessons */}
      {formData.type === 'quiz' && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Label className="text-sm font-semibold">Select Quiz</Label>
              <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a quiz for this lesson" />
                </SelectTrigger>
                <SelectContent>
                  {availableQuizzes.map((quiz) => (
                    <SelectItem key={quiz.id} value={quiz.id}>
                      {quiz.title} ({quiz.totalQuestions} questions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableQuizzes.length === 0 && (
                <p className="text-sm text-gray-500">
                  No quizzes available. Create a quiz first in the Quiz Creator.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !formData.title.trim() || formData.duration <= 0}
          className="bg-primary-green hover:bg-secondary-green"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {lesson ? 'Update Lesson' : 'Create Lesson'}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
