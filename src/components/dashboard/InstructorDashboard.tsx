import { useMemo, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Users, BookOpen, Trophy, BarChart3, Search, ChevronRight, Clock } from 'lucide-react'
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
}

function generateDummyStudentsForCourse(courseId: string, courseTitle: string, count: number): StudentProgressRow[] {
  const names = [
    'Thabo Nkosi', 'Lerato Mokoena', 'Sipho Dlamini', 'Nandi Khumalo', 'Boitumelo Mashaba',
    'Kgalalelo Mthembu', 'Anele Zulu', 'Karabo Molefe', 'Ayanda Ndlovu', 'Sibusiso Maseko'
  ]
  const rows: StudentProgressRow[] = []
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length]
    const progress = Math.floor(Math.random() * 101)
    const status: StudentProgressRow['status'] = progress === 0 ? 'not_started' : progress >= 100 ? 'completed' : 'in_progress'
    const quizzesTaken = Math.floor(progress / 20)
    const averageScore = quizzesTaken > 0 ? Math.floor(60 + Math.random() * 40) : 0
    const passRate = quizzesTaken > 0 ? Math.floor(50 + Math.random() * 50) : 0
    rows.push({
      studentId: `student_${courseId}_${i + 1}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@demo.edu`,
      courseId,
      courseTitle,
      status,
      overallProgress: progress,
      currentModuleIndex: Math.max(0, Math.min(3, Math.floor(progress / 33))),
      currentLessonIndex: Math.max(0, Math.min(3, Math.floor((progress % 33) / 10))),
      timeSpentMinutes: Math.floor(progress * (20 + Math.random() * 6)),
      lastActiveAt: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toISOString(),
      quizzesTaken,
      averageScore,
      passRate
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Analytics</h1>
          <p className="text-gray-600">Monitor student progress and quiz performance</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students" className="pl-9 w-64" />
          </div>
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as any)}>
            <SelectTrigger className="w-40">
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

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Enrolled</p>
                <p className="text-2xl font-semibold">{filteredRows.length}</p>
              </div>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Started</p>
                <p className="text-2xl font-semibold">{courseStats.started}</p>
              </div>
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-semibold">{courseStats.completed}</p>
              </div>
              <Trophy className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Progress</p>
                <p className="text-2xl font-semibold">{courseStats.avgProgress}%</p>
              </div>
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Time Spent</p>
                <p className="text-2xl font-semibold">{formatTime(courseStats.timeSpent)}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {selectedCourseTitle} — Student Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Student</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Progress</th>
                  <th className="py-2 pr-4">Module/Lesson</th>
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Quizzes</th>
                  <th className="py-2 pr-4">Avg Score</th>
                  <th className="py-2 pr-4">Pass Rate</th>
                  <th className="py-2 pr-0 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map(r => (
                  <tr key={r.studentId} className="border-t">
                    <td className="py-3 pr-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{r.name}</span>
                        <span className="text-gray-500">{r.email}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={r.status === 'completed' ? 'default' : r.status === 'in_progress' ? 'secondary' : 'outline'}>
                        {r.status.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4 w-48">
                      <div className="flex items-center gap-2">
                        <Progress value={r.overallProgress} className="h-2" />
                        <span className="w-10 text-right">{r.overallProgress}%</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">M{r.currentModuleIndex + 1} / L{r.currentLessonIndex + 1}</td>
                    <td className="py-3 pr-4">{formatTime(r.timeSpentMinutes)}</td>
                    <td className="py-3 pr-4">{r.quizzesTaken}</td>
                    <td className="py-3 pr-4">{r.averageScore}%</td>
                    <td className="py-3 pr-4">{r.passRate}%</td>
                    <td className="py-3 pr-0 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
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

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Student Detail</DialogTitle>
            <DialogDescription>Full learning activity and progress snapshot</DialogDescription>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">{selectedStudent.name}</p>
                  <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                </div>
                <Badge variant={selectedStudent.status === 'completed' ? 'default' : selectedStudent.status === 'in_progress' ? 'secondary' : 'outline'}>
                  {selectedStudent.status.replace('_', ' ')}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="font-medium">{selectedStudent.courseTitle}</p>
                    <div className="pt-2">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{selectedStudent.overallProgress}%</span>
                      </div>
                      <Progress value={selectedStudent.overallProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 space-y-2">
                    <p className="text-sm text-gray-500">Learning Position</p>
                    <p className="font-medium">Module {selectedStudent.currentModuleIndex + 1} • Lesson {selectedStudent.currentLessonIndex + 1}</p>
                    <p className="text-sm text-gray-500">Time Spent: {formatTime(selectedStudent.timeSpentMinutes)}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Quizzes Taken</p>
                    <p className="text-2xl font-semibold">{selectedStudent.quizzesTaken}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Average Score</p>
                    <p className="text-2xl font-semibold">{selectedStudent.averageScore}%</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-500">Pass Rate</p>
                    <p className="text-2xl font-semibold">{selectedStudent.passRate}%</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-500">Current Context</p>
                <div className="text-sm">
                  {(() => {
                    const course = courses.find(c => c.id === selectedStudent.courseId)
                    const moduleTitle = course?.modules[selectedStudent.currentModuleIndex]?.title || `Module ${selectedStudent.currentModuleIndex + 1}`
                    const lessonTitle = course?.modules[selectedStudent.currentModuleIndex]?.lessons[selectedStudent.currentLessonIndex]?.title || `Lesson ${selectedStudent.currentLessonIndex + 1}`
                    return (
                      <div className="p-3 rounded-md bg-gray-50 border">
                        <p className="font-medium text-gray-900">{moduleTitle}</p>
                        <p className="text-gray-700">{lessonTitle}</p>
                      </div>
                    )
                  })()}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDetailOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


