import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Label } from '../ui/label'
import { toast } from 'sonner'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Trophy,
  RotateCcw
} from 'lucide-react'
import { firestoreService } from '../../utils/firebase/database'
import { getDummyQuiz } from '../../utils/dummyData'
import type { Quiz, Question, QuizResult } from '../../types'

interface QuizInterfaceProps {
  quizId: string
  onComplete: (result: QuizResult) => void
}

export function QuizInterface({ quizId, onComplete }: QuizInterfaceProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({}) // Changed to number (option index)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    loadQuiz()
  }, [quizId])

  useEffect(() => {
    if (quiz && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quiz, timeLeft])

  const loadQuiz = async () => {
    try {
      // Try dummy quiz first by id; fallback to firestore if needed
      const dummy = getDummyQuiz(quizId)
      if (dummy) {
        setQuiz(dummy.quiz)
        setQuestions(dummy.questions)
        setTimeLeft(dummy.quiz.timeLimit)
        setStartTime(new Date())
      } else {
        const quizData = await firestoreService.getQuiz(quizId)
        const questionsData = await firestoreService.getQuestions(quizId)
        setQuiz(quizData)
        setQuestions(questionsData)
        setTimeLeft(quizData.timeLimit)
        setStartTime(new Date())
      }
    } catch (error) {
      console.error('Failed to load quiz:', error)
      toast.error('Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }

  const handleTimeUp = async () => {
    toast.warning('Time is up! Submitting your answers...')
    await submitQuiz()
  }

  const handleAnswerChange = (questionId: string, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const nextQuestion = () => {
    if (questions && currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitQuiz = async () => {
    if (!quiz || !startTime) return

    setIsSubmitting(true)
    try {
      const timeSpent = Math.floor((new Date().getTime() - startTime.getTime()) / 1000)
      // Compute result locally for dummy quizzes
      const totalQuestions = questions.length
      let score = 0
      questions.forEach(q => {
        if (answers[q.id] === q.correctAnswerIndex) score += 1
      })
      const percentage = totalQuestions ? (score / totalQuestions) * 100 : 0
      const passed = percentage >= 70
      const localResult = { 
        quizId, 
        userId: '', // Will be set on server
        score, 
        totalQuestions, 
        percentage, 
        passed, 
        timeSpent,
        submittedAt: new Date().toISOString()
      }
      setQuizResult(localResult)
      setShowResults(true)
      onComplete(localResult)
      toast.success(passed ? 'Congratulations! You passed!' : 'Quiz completed')
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercent = () => {
    if (!questions.length) return 0
    return ((currentQuestion + 1) / questions.length) * 100
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setQuizResult(null)
    setStartTime(new Date())
    if (quiz) {
      setTimeLeft(quiz.timeLimit)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p>Loading quiz...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p>Failed to load quiz. Please try again.</p>
          <Button onClick={loadQuiz} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (showResults && quizResult) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {quizResult.passed ? (
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Trophy className="h-8 w-8 text-green-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {quizResult.passed ? 'Congratulations!' : 'Try Again'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{quizResult.score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{Math.round(quizResult.percentage)}%</div>
              <div className="text-sm text-gray-600">Percentage</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Your Score</span>
              <span>{quizResult.score} / {quizResult.totalQuestions}</span>
            </div>
            <Progress value={quizResult.percentage} className="h-3" />
            <div className="text-center text-sm text-gray-600">
              {quizResult.passed ? 'Passing score: 70%' : 'You need 70% to pass'}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={resetQuiz} variant="outline" className="w-full">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button className="w-full">
              Continue to Next Lesson
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Quiz Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{quiz.title}</CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatTime(timeLeft)}
              </Badge>
              <Badge variant="outline">
                Question {currentQuestion + 1} of {questions.length}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{getAnsweredCount()} / {questions.length} answered</span>
            </div>
            <Progress value={getProgressPercent()} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Current Question */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <div className="text-sm text-gray-500 mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </div>
              <h3 className="text-lg font-medium mb-4">{question.text}</h3>
            </div>

            <div className="space-y-3">
              <RadioGroup
                value={answers[question.id]?.toString() || ''}
                onValueChange={(value: string) => handleAnswerChange(question.id, parseInt(value))}
              >
                {question.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={index.toString()} id={`${question.id}_${index}`} />
                    <Label htmlFor={`${question.id}_${index}`} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>

              <div className="flex gap-2">
                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={submitQuiz}
                    disabled={isSubmitting || getAnsweredCount() === 0}
                    className="min-w-24"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                  </Button>
                ) : (
                  <Button
                    onClick={nextQuestion}
                    disabled={answers[question.id] === undefined}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigator */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <Button
                key={index}
                variant={index === currentQuestion ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 ${
                  answers[question.id] !== undefined
                    ? 'bg-green-100 border-green-300' 
                    : ''
                }`}
              >
                {answers[question.id] !== undefined && (
                  <CheckCircle className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                )}
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}