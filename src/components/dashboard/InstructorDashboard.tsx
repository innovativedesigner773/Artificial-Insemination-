import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Users, BookOpen, Trophy, BarChart3, Search, ChevronRight, Clock, Sparkles, Target, Zap, Activity, Flame, CheckCircle, AlertCircle, LogIn, Calendar, Video, FileText, MessageSquare, Download, HelpCircle, TrendingUp, Monitor } from 'lucide-react'
import { getDummyCourses } from '../../utils/dummyData'

type StudentProgressRow = {
  studentId: string
  name: string
  email: string
  courseId: string
  courseTitle: string
  status: 'not_started' | 'in_progress' | 'completed'
  overallProgress: number
  currentModuleIndex: number
  currentLessonIndex: number
  timeSpentMinutes: number
  lastActiveAt: string
  quizzesTaken: number
  averageScore: number
  passRate: number
  // Enhanced usage analytics
  totalLogins: number
  lastLoginAt: string
  averageSessionDuration: number
  timeSpentOnVideos: number
  timeSpentOnReading: number
  timeSpentOnQuizzes: number
  timeSpentOnDiscussions: number
  mostActiveDay: string
  preferredLearningTime: string
  streakDays: number
  notesTaken: number
  resourcesDownloaded: number
  forumPosts: number
  helpRequests: number
}

function generateDummyStudentsForCourse(courseId: string, courseTitle: string, count: number): StudentProgressRow[] {
  const names = [
    'Thabo Nkosi', 'Lerato Mokoena', 'Sipho Dlamini', 'Nandi Khumalo', 'Boitumelo Mashaba',
    'Kgalalelo Mthembu', 'Anele Zulu', 'Karabo Molefe', 'Ayanda Ndlovu', 'Sibusiso Maseko',
    'Mandla Khumalo', 'Precious Mthembu', 'Sizwe Dlamini', 'Nomsa Zulu', 'Thandeka Molefe'
  ]
  const rows: StudentProgressRow[] = []
  
  // Create more realistic status distribution
  const statusDistribution = [
    { status: 'not_started' as const, weight: 3 },    // 20% not started
    { status: 'in_progress' as const, weight: 7 },     // 47% in progress  
    { status: 'completed' as const, weight: 3 }       // 33% completed
  ]
  
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length]
    
    // Weighted random status selection
    const random = Math.random() * 13 // Total weight
    let cumulativeWeight = 0
    let selectedStatus: StudentProgressRow['status'] = 'not_started'
    
    for (const item of statusDistribution) {
      cumulativeWeight += item.weight
      if (random <= cumulativeWeight) {
        selectedStatus = item.status
        break
      }
    }
    
    // Generate progress based on status
    let progress: number
    let currentModuleIndex: number
    let currentLessonIndex: number
    let timeSpentMinutes: number
    let quizzesTaken: number
    let averageScore: number
    let passRate: number
    // Enhanced analytics data
    let totalLogins: number
    let lastLoginAt: string
    let averageSessionDuration: number
    let timeSpentOnVideos: number
    let timeSpentOnReading: number
    let timeSpentOnQuizzes: number
    let timeSpentOnDiscussions: number
    let mostActiveDay: string
    let preferredLearningTime: string
    let streakDays: number
    let notesTaken: number
    let resourcesDownloaded: number
    let forumPosts: number
    let helpRequests: number
    
    // Generate additional usage data
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const times = ['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-24)', 'Night (0-6)']
    
    switch (selectedStatus) {
      case 'not_started':
        progress = 0
        currentModuleIndex = 0
        currentLessonIndex = 0
        timeSpentMinutes = 0
        quizzesTaken = 0
        averageScore = 0
        passRate = 0
        totalLogins = Math.floor(1 + Math.random() * 3)
        lastLoginAt = new Date(Date.now() - Math.floor(Math.random() * 3) * 24 * 60 * 60 * 1000).toISOString()
        averageSessionDuration = Math.floor(5 + Math.random() * 15)
        timeSpentOnVideos = 0
        timeSpentOnReading = 0
        timeSpentOnQuizzes = 0
        timeSpentOnDiscussions = 0
        mostActiveDay = days[Math.floor(Math.random() * days.length)]
        preferredLearningTime = times[Math.floor(Math.random() * times.length)]
        streakDays = 0
        notesTaken = 0
        resourcesDownloaded = 0
        forumPosts = 0
        helpRequests = Math.floor(Math.random() * 2)
        break
      case 'in_progress':
        progress = Math.floor(10 + Math.random() * 80) // 10-90%
        currentModuleIndex = Math.max(0, Math.min(3, Math.floor(progress / 25)))
        currentLessonIndex = Math.max(0, Math.min(3, Math.floor((progress % 25) / 8)))
        timeSpentMinutes = Math.floor(progress * (15 + Math.random() * 10))
        quizzesTaken = Math.floor(progress / 25) + Math.floor(Math.random() * 2)
        averageScore = Math.floor(65 + Math.random() * 30)
        passRate = Math.floor(60 + Math.random() * 35)
        totalLogins = Math.floor(15 + Math.random() * 30)
        lastLoginAt = new Date(Date.now() - Math.floor(Math.random() * 2) * 24 * 60 * 60 * 1000).toISOString()
        averageSessionDuration = Math.floor(20 + Math.random() * 40)
        timeSpentOnVideos = Math.floor(timeSpentMinutes * (0.4 + Math.random() * 0.3))
        timeSpentOnReading = Math.floor(timeSpentMinutes * (0.2 + Math.random() * 0.3))
        timeSpentOnQuizzes = Math.floor(timeSpentMinutes * (0.1 + Math.random() * 0.2))
        timeSpentOnDiscussions = Math.floor(timeSpentMinutes * (0.05 + Math.random() * 0.15))
        mostActiveDay = days[Math.floor(Math.random() * days.length)]
        preferredLearningTime = times[Math.floor(Math.random() * times.length)]
        streakDays = Math.floor(1 + Math.random() * 7)
        notesTaken = Math.floor(progress / 10 + Math.random() * 5)
        resourcesDownloaded = Math.floor(progress / 15 + Math.random() * 3)
        forumPosts = Math.floor(progress / 20 + Math.random() * 3)
        helpRequests = Math.floor(Math.random() * 4)
        break
      case 'completed':
        progress = 100
        currentModuleIndex = 3 // Last module
        currentLessonIndex = 3 // Last lesson
        timeSpentMinutes = Math.floor(120 + Math.random() * 60) // 2-3 hours
        quizzesTaken = 4 + Math.floor(Math.random() * 2) // 4-5 quizzes
        averageScore = Math.floor(75 + Math.random() * 20)
        passRate = Math.floor(80 + Math.random() * 15)
        totalLogins = Math.floor(40 + Math.random() * 20)
        lastLoginAt = new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString()
        averageSessionDuration = Math.floor(35 + Math.random() * 25)
        timeSpentOnVideos = Math.floor(timeSpentMinutes * (0.45 + Math.random() * 0.2))
        timeSpentOnReading = Math.floor(timeSpentMinutes * (0.25 + Math.random() * 0.2))
        timeSpentOnQuizzes = Math.floor(timeSpentMinutes * (0.15 + Math.random() * 0.15))
        timeSpentOnDiscussions = Math.floor(timeSpentMinutes * (0.1 + Math.random() * 0.1))
        mostActiveDay = days[Math.floor(Math.random() * days.length)]
        preferredLearningTime = times[Math.floor(Math.random() * times.length)]
        streakDays = Math.floor(5 + Math.random() * 15)
        notesTaken = Math.floor(15 + Math.random() * 10)
        resourcesDownloaded = Math.floor(8 + Math.random() * 7)
        forumPosts = Math.floor(8 + Math.random() * 12)
        helpRequests = Math.floor(Math.random() * 3)
        break
    }
    
    rows.push({
      studentId: `student_${courseId}_${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.edu`,
      courseId,
      courseTitle,
      status: selectedStatus,
      overallProgress: progress,
      currentModuleIndex,
      currentLessonIndex,
      timeSpentMinutes,
      lastActiveAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
      quizzesTaken,
      averageScore,
      passRate,
      // Enhanced analytics
      totalLogins,
      lastLoginAt,
      averageSessionDuration,
      timeSpentOnVideos,
      timeSpentOnReading,
      timeSpentOnQuizzes,
      timeSpentOnDiscussions,
      mostActiveDay,
      preferredLearningTime,
      streakDays,
      notesTaken,
      resourcesDownloaded,
      forumPosts,
      helpRequests
    })
  }
  return rows
}

export function InstructorDashboard() {
  const courses = useMemo(() => getDummyCourses(), [])
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'not_started' | 'in_progress' | 'completed'>('all')
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRow | null>(null)

  const allRows = useMemo(() => {
    const rows: StudentProgressRow[] = []
    for (const c of courses) {
      rows.push(...generateDummyStudentsForCourse(c.id, c.title, 12))
    }
    return rows
  }, [courses])

  const filteredRows = useMemo(() => {
    return allRows
      .filter(r => (selectedCourseId === 'all' ? true : r.courseId === selectedCourseId))
      .filter(r => (statusFilter === 'all' ? true : r.status === statusFilter))
      .filter(r => {
        if (!search) return true
        const q = search.toLowerCase()
        return r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
      })
  }, [allRows, selectedCourseId, search, statusFilter])

  const courseStats = useMemo(() => {
    const rows = filteredRows
    const total = rows.length || 1
    const started = rows.filter(r => r.status !== 'not_started').length
    const completed = rows.filter(r => r.status === 'completed').length
    const avgProgress = Math.round(rows.reduce((s, r) => s + r.overallProgress, 0) / total)
    const avgScore = Math.round(rows.reduce((s, r) => s + r.averageScore, 0) / total)
    const passRate = Math.round(rows.reduce((s, r) => s + r.passRate, 0) / total)
    const timeSpent = rows.reduce((s, r) => s + r.timeSpentMinutes, 0)
    return { started, completed, avgProgress, avgScore, passRate, timeSpent }
  }, [filteredRows])

  const selectedCourseTitle = selectedCourseId === 'all' ? 'All Courses' : courses.find(c => c.id === selectedCourseId)?.title || 'All Courses'

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden gradient-primary rounded-3xl p-8 text-white shadow-large">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-300/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <BarChart3 className="h-10 w-10 text-yellow-300 animate-pulse" />
                  <div className="absolute inset-0 h-10 w-10 bg-yellow-300/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                    Advanced AI & Farm Management
                  </h1>
                  <p className="text-lg font-medium text-green-100 mt-1">Student Progress Analytics</p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-300 float" />
              </div>
              <p className="text-white/90 text-xl leading-relaxed max-w-2xl">
                Comprehensive monitoring dashboard for student learning progress, quiz performance, and engagement metrics
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <Users className="h-5 w-5 text-blue-200" />
                  <span className="font-semibold">{filteredRows.length}</span>
                  <span className="text-white/80">Students</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <BookOpen className="h-5 w-5 text-green-200" />
                  <span className="font-semibold truncate max-w-32">{selectedCourseTitle}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <Target className="h-5 w-5 text-purple-200" />
                  <span className="font-semibold">{courseStats.avgProgress}%</span>
                  <span className="text-white/80">Avg Progress</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-80 h-48 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-blue-400/30 via-green-400/20 to-purple-400/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <BarChart3 className="h-20 w-20 text-white/80 mx-auto mb-2" />
                    <p className="text-white/70 font-medium">Analytics Dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Section */}
      <Card className="shadow-soft border-0 bg-gradient-to-r from-gray-50 via-blue-50 to-green-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                Student Progress Overview
              </h2>
              <p className="text-gray-600 ml-4">Track learning progress and performance metrics with advanced analytics</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  placeholder="Search students by name or email..." 
                  className="pl-10 w-72 bg-white/90 border-gray-200 focus:border-green-400 focus:ring-green-400/20 shadow-sm" 
                />
              </div>
              <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-56 bg-white/90 border-gray-200 focus:border-green-400 shadow-sm">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
                <SelectTrigger className="w-44 bg-white/90 border-gray-200 focus:border-green-400 shadow-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="group hover-lift shadow-soft border-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">Enrolled</span>
                </div>
                <p className="text-4xl font-bold text-blue-900">{filteredRows.length}</p>
                <div className="flex items-center gap-2 text-blue-600">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Total students</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-600/30 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover-lift shadow-soft border-0 bg-gradient-to-br from-green-50 via-green-100 to-green-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-700">Started</span>
                </div>
                <p className="text-4xl font-bold text-green-900">{courseStats.started}</p>
                <div className="flex items-center gap-2 text-green-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Active learners</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500/20 to-green-600/30 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover-lift shadow-soft border-0 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-semibold text-yellow-700">Completed</span>
                </div>
                <p className="text-4xl font-bold text-yellow-900">{courseStats.completed}</p>
                <div className="flex items-center gap-2 text-yellow-600">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Graduates</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-yellow-600/30 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="h-7 w-7 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover-lift shadow-soft border-0 bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">Avg Progress</span>
                </div>
                <p className="text-4xl font-bold text-purple-900">{courseStats.avgProgress}%</p>
                <div className="flex items-center gap-2 text-purple-600">
                  <Flame className="h-4 w-4" />
                  <span className="text-sm font-medium">Learning pace</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-600/30 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="h-7 w-7 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="group hover-lift shadow-soft border-0 bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">Time Spent</span>
                </div>
                <p className="text-4xl font-bold text-orange-900">{formatTime(courseStats.timeSpent)}</p>
                <div className="flex items-center gap-2 text-orange-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm font-medium">Total hours</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-600/30 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Student Progress Table */}
      <Card className="shadow-soft border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50 to-green-50 border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">{selectedCourseTitle}</span>
              <p className="text-sm font-medium text-gray-600 mt-1">Student Progress Analytics</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-white/80 border-green-200 text-green-700">
              <Activity className="h-3 w-3 mr-1" />
              {filteredRows.length} Students
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Progress</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Module/Lesson</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Time</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Quizzes</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Avg Score</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Pass Rate</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((r) => (
                  <tr key={r.studentId} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-200 group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <span className="text-sm font-bold text-gray-700">
                            {r.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{r.name}</p>
                          <p className="text-sm text-gray-500">{r.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge 
                        variant={r.status === 'completed' ? 'default' : r.status === 'in_progress' ? 'secondary' : 'outline'}
                        className={`font-medium ${
                          r.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                          r.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {r.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {r.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
                        {r.status === 'not_started' && <AlertCircle className="h-3 w-3 mr-1" />}
                        {r.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 w-48">
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Progress value={r.overallProgress} className="h-3 bg-gray-200" />
                        </div>
                        <span className="w-12 text-right font-semibold text-gray-700">{r.overallProgress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-bold text-purple-700">M{r.currentModuleIndex + 1}</span>
                        </div>
                        <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                          <span className="text-xs font-bold text-blue-700">L{r.currentLessonIndex + 1}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{formatTime(r.timeSpentMinutes)}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{r.quizzesTaken}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-gray-700">{r.averageScore}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-green-500" />
                        <span className="font-medium text-gray-700">{r.passRate}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-200"
                        onClick={() => {
                          setSelectedStudent(r)
                          setDetailOpen(true)
                        }}
                      >
                        View Detail <ChevronRight className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Student Detail Modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">Student Progress Details</DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">Comprehensive learning analytics and performance metrics</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-8">
              {/* Student Header */}
              <div className="relative overflow-hidden bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-2xl p-6 border border-gray-200">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-200/20 to-transparent rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-xl font-bold text-white">
                          {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                        <p className="text-gray-600 text-lg">{selectedStudent.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <BookOpen className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 font-medium">{selectedStudent.courseTitle}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={selectedStudent.status === 'completed' ? 'default' : selectedStudent.status === 'in_progress' ? 'secondary' : 'outline'}
                      className={`px-4 py-2 text-sm font-semibold ${
                        selectedStudent.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' :
                        selectedStudent.status === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {selectedStudent.status === 'completed' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {selectedStudent.status === 'in_progress' && <Clock className="h-4 w-4 mr-2" />}
                      {selectedStudent.status === 'not_started' && <AlertCircle className="h-4 w-4 mr-2" />}
                      {selectedStudent.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Progress Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-soft border-0 bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-blue-700">Course Progress</p>
                        <p className="text-sm text-blue-600">Overall completion status</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700">Progress</span>
                          <span className="font-bold text-gray-900">{selectedStudent.overallProgress}%</span>
                        </div>
                        <Progress value={selectedStudent.overallProgress} className="h-3 bg-gray-200" />
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Time: {formatTime(selectedStudent.timeSpentMinutes)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                        <Target className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-700">Learning Position</p>
                        <p className="text-sm text-green-600">Current module and lesson</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <span className="text-lg font-bold text-purple-700">M{selectedStudent.currentModuleIndex + 1}</span>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <span className="text-lg font-bold text-blue-700">L{selectedStudent.currentLessonIndex + 1}</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const course = courses.find(c => c.id === selectedStudent.courseId)
                          const moduleTitle = course?.modules[selectedStudent.currentModuleIndex]?.title || `Module ${selectedStudent.currentModuleIndex + 1}`
                          const lessonTitle = course?.modules[selectedStudent.currentModuleIndex]?.lessons[selectedStudent.currentLessonIndex]?.title || `Lesson ${selectedStudent.currentLessonIndex + 1}`
                          return (
                            <div>
                              <p className="font-medium text-gray-900">{moduleTitle}</p>
                              <p className="text-gray-600">{lessonTitle}</p>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="shadow-soft border-0 bg-gradient-to-br from-yellow-50 to-yellow-100 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="h-6 w-6 text-yellow-600" />
                    </div>
                    <p className="text-sm font-medium text-yellow-700 mb-2">Quizzes Taken</p>
                    <p className="text-3xl font-bold text-yellow-900">{selectedStudent.quizzesTaken}</p>
                    <p className="text-xs text-yellow-600 mt-1">Total assessments</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0 bg-gradient-to-br from-purple-50 to-purple-100 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Trophy className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-purple-700 mb-2">Average Score</p>
                    <p className="text-3xl font-bold text-purple-900">{selectedStudent.averageScore}%</p>
                    <p className="text-xs text-purple-600 mt-1">Quiz performance</p>
                  </CardContent>
                </Card>

                <Card className="shadow-soft border-0 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Target className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-green-700 mb-2">Pass Rate</p>
                    <p className="text-3xl font-bold text-green-900">{selectedStudent.passRate}%</p>
                    <p className="text-xs text-green-600 mt-1">Success rate</p>
                  </CardContent>
                </Card>
              </div>

              {/* System Usage Analytics */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">System Usage Analytics</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                </div>

                {/* Login & Session Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="shadow-soft border-0 bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <LogIn className="h-5 w-5 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-blue-700 mb-1">Total Logins</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedStudent.totalLogins}</p>
                      <p className="text-xs text-blue-600">System access</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-0 bg-gradient-to-br from-indigo-50 to-indigo-100">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-5 w-5 text-indigo-600" />
                      </div>
                      <p className="text-sm font-medium text-indigo-700 mb-1">Avg Session</p>
                      <p className="text-2xl font-bold text-indigo-900">{selectedStudent.averageSessionDuration}m</p>
                      <p className="text-xs text-indigo-600">Per login</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-0 bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <TrendingUp className="h-5 w-5 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium text-purple-700 mb-1">Streak Days</p>
                      <p className="text-2xl font-bold text-purple-900">{selectedStudent.streakDays}</p>
                      <p className="text-xs text-purple-600">Consecutive</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-0 bg-gradient-to-br from-pink-50 to-pink-100">
                    <CardContent className="p-4 text-center">
                      <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Calendar className="h-5 w-5 text-pink-600" />
                      </div>
                      <p className="text-sm font-medium text-pink-700 mb-1">Last Login</p>
                      <p className="text-sm font-bold text-pink-900">
                        {new Date(selectedStudent.lastLoginAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-pink-600">Recent activity</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Time Distribution */}
                <Card className="shadow-soft border-0 bg-gradient-to-r from-gray-50 to-blue-50">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Time Distribution Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-700">Videos</span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={(selectedStudent.timeSpentOnVideos / selectedStudent.timeSpentMinutes) * 100} className="h-2" />
                          <p className="text-sm font-bold text-gray-900">{formatTime(selectedStudent.timeSpentOnVideos)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">Reading</span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={(selectedStudent.timeSpentOnReading / selectedStudent.timeSpentMinutes) * 100} className="h-2" />
                          <p className="text-sm font-bold text-gray-900">{formatTime(selectedStudent.timeSpentOnReading)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium text-gray-700">Quizzes</span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={(selectedStudent.timeSpentOnQuizzes / selectedStudent.timeSpentMinutes) * 100} className="h-2" />
                          <p className="text-sm font-bold text-gray-900">{formatTime(selectedStudent.timeSpentOnQuizzes)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-purple-500" />
                          <span className="text-sm font-medium text-gray-700">Discussions</span>
                        </div>
                        <div className="space-y-1">
                          <Progress value={(selectedStudent.timeSpentOnDiscussions / selectedStudent.timeSpentMinutes) * 100} className="h-2" />
                          <p className="text-sm font-bold text-gray-900">{formatTime(selectedStudent.timeSpentOnDiscussions)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Patterns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-soft border-0 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-orange-600" />
                        Learning Patterns
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-700">Most Active Day</span>
                        </div>
                        <span className="font-bold text-gray-900">{selectedStudent.mostActiveDay}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm font-medium text-gray-700">Preferred Time</span>
                        </div>
                        <span className="font-bold text-gray-900">{selectedStudent.preferredLearningTime}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-soft border-0 bg-gradient-to-br from-teal-50 to-teal-100">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Activity className="h-5 w-5 text-teal-600" />
                        Engagement Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <FileText className="h-4 w-4 text-teal-500" />
                            <span className="text-sm font-medium text-gray-700">Notes</span>
                          </div>
                          <p className="text-xl font-bold text-teal-900">{selectedStudent.notesTaken}</p>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <Download className="h-4 w-4 text-teal-500" />
                            <span className="text-sm font-medium text-gray-700">Downloads</span>
                          </div>
                          <p className="text-xl font-bold text-teal-900">{selectedStudent.resourcesDownloaded}</p>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <MessageSquare className="h-4 w-4 text-teal-500" />
                            <span className="text-sm font-medium text-gray-700">Forum Posts</span>
                          </div>
                          <p className="text-xl font-bold text-teal-900">{selectedStudent.forumPosts}</p>
                        </div>
                        <div className="text-center p-3 bg-white/50 rounded-lg">
                          <div className="flex items-center justify-center gap-1 mb-1">
                            <HelpCircle className="h-4 w-4 text-teal-500" />
                            <span className="text-sm font-medium text-gray-700">Help Requests</span>
                          </div>
                          <p className="text-xl font-bold text-teal-900">{selectedStudent.helpRequests}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button 
                  variant="outline" 
                  onClick={() => setDetailOpen(false)}
                  className="px-6 py-2 hover:bg-gray-50"
                >
                  Close
                </Button>
                <Button 
                  className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
                >
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


