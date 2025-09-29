import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { firestoreService } from '../../utils/firebase/database'
import { 
  Plus,
  X,
  Save,
  Target,
  Clock,
  Brain,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Hash
} from 'lucide-react'
import type { Quiz, Question } from '../../types'

interface QuizCreatorProps {
  courseId?: string
  onQuizCreated?: (quiz: Quiz) => void
  onCancel?: () => void
}

interface QuizFormData {
  title: string
  description: string
  timeLimit: number // in seconds
  questions: QuestionFormData[]
}

interface QuestionFormData {
  id: string
  text: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
  points: number
  difficulty: 'easy' | 'medium' | 'hard'
  tags: string[]
}

export function QuizCreator({ courseId, onQuizCreated, onCancel }: QuizCreatorProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    title: '',
    description: '',
    timeLimit: 300, // 5 minutes default
    questions: []
  })

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: 0,
    explanation: '',
    points: 10,
    difficulty: 'medium' as const,
    tags: [] as string[]
  })

  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof QuizFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddQuestion = () => {
    if (!newQuestion.text.trim()) {
      toast.error('Question text is required')
      return
    }

    if (newQuestion.options.filter(opt => opt.trim()).length < 2) {
      toast.error('At least 2 options are required')
      return
    }

    const questionId = `question_${Date.now()}`
    const question: QuestionFormData = {
      id: questionId,
      ...newQuestion,
      options: newQuestion.options.filter(opt => opt.trim()) // Remove empty options
    }

    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, question]
    }))

    // Reset form
    setNewQuestion({
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0,
      explanation: '',
      points: 10,
      difficulty: 'medium',
      tags: []
    })
  }

  const handleRemoveQuestion = (questionId: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }))
  }

  const handleOptionChange = (index: number, value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }))
  }

  const handleAddOption = () => {
    setNewQuestion(prev => ({
      ...prev,
      options: [...prev.options, '']
    }))
  }

  const handleRemoveOption = (index: number) => {
    if (newQuestion.options.length > 2) {
      setNewQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswerIndex: prev.correctAnswerIndex >= index ? 
          Math.max(0, prev.correctAnswerIndex - 1) : prev.correctAnswerIndex
      }))
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !newQuestion.tags.includes(newTag.trim())) {
      setNewQuestion(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setNewQuestion(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Quiz title is required')
      return
    }

    if (!formData.description.trim()) {
      toast.error('Quiz description is required')
      return
    }

    if (formData.questions.length === 0) {
      toast.error('At least one question is required')
      return
    }

    setIsSubmitting(true)

    try {
      // Create quiz data object
      const quizData = {
        title: formData.title,
        description: formData.description,
        timeLimit: formData.timeLimit,
        ...(courseId && { courseId }) // Only include courseId if it's defined
      }
      
      const quiz = await firestoreService.createQuiz(quizData)

      // Create questions
      for (const questionData of formData.questions) {
        await firestoreService.createQuestion(quiz.id, {
          text: questionData.text,
          options: questionData.options,
          correctAnswerIndex: questionData.correctAnswerIndex,
          explanation: questionData.explanation,
          points: questionData.points,
          difficulty: questionData.difficulty,
          tags: questionData.tags
        })
      }

      toast.success('Quiz created successfully!')
      
      if (onQuizCreated) {
        onQuizCreated(quiz)
      }
    } catch (error) {
      console.error('Error creating quiz:', error)
      toast.error('Failed to create quiz. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTimeLimit = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-8 w-8 text-orange-600" />
            Create Quiz
          </h1>
          <p className="text-gray-600">Design assessment questions for your course</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeLimit(formData.timeLimit)}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Hash className="h-3 w-3" />
            {formData.questions.length} questions
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Quiz Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Quiz Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter quiz title"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={formData.timeLimit}
                  onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
                  placeholder="300"
                  min="60"
                  max="3600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this quiz covers"
                rows={3}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Add Question Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-green-600" />
              Add Question
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Question Text *</Label>
              <Textarea
                id="questionText"
                value={newQuestion.text}
                onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your question here"
                rows={3}
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <Label>Answer Options *</Label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctAnswer"
                      checked={newQuestion.correctAnswerIndex === index}
                      onChange={() => setNewQuestion(prev => ({ ...prev, correctAnswerIndex: index }))}
                      className="text-green-600"
                    />
                    <span className="text-sm font-medium w-8">{index + 1}.</span>
                  </div>
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {newQuestion.options.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Option
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="points">Points</Label>
                <Input
                  id="points"
                  type="number"
                  value={newQuestion.points}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                  placeholder="10"
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty">Difficulty</Label>
                <Select 
                  value={newQuestion.difficulty} 
                  onValueChange={(value: any) => setNewQuestion(prev => ({ ...prev, difficulty: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="explanation">Explanation</Label>
                <Input
                  id="explanation"
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                  placeholder="Optional explanation"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {newQuestion.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
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

            <Button type="button" onClick={handleAddQuestion} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </CardContent>
        </Card>

        {/* Questions List */}
        {formData.questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                Quiz Questions ({formData.questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <Badge variant={question.difficulty === 'easy' ? 'default' : question.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                          {question.difficulty}
                        </Badge>
                        <Badge variant="outline">{question.points} pts</Badge>
                      </div>
                      <p className="font-medium mb-2">{question.text}</p>
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2 text-sm">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              optIndex === question.correctAnswerIndex 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {optIndex === question.correctAnswerIndex ? <CheckCircle className="h-3 w-3" /> : optIndex + 1}
                            </span>
                            <span className={optIndex === question.correctAnswerIndex ? 'font-medium text-green-800' : ''}>
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                      {question.explanation && (
                        <p className="text-sm text-gray-600 mt-2 italic">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      )}
                      {question.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveQuestion(question.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Quiz
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
