import { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog'
import { Checkbox } from '../ui/checkbox'
import { 
  Users, 
  UserPlus, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  BookOpen,
  Shield,
  Crown,
  Star,
  Edit,
  Trash2,
  Search,
  Filter,
  MoreHorizontal,
  Sparkles,
  Target,
  Zap,
  Activity,
  Flame,
  Brain,
  Calendar
} from 'lucide-react'
import { toast } from 'sonner'

interface Plan {
  id: string
  name: string
  capacity: number
  currentEnrollments: number
  color: string
  icon: any
  description: string
  price: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
  plan: string
  enrolledAt: string
  status: 'active' | 'inactive' | 'suspended'
  progress: number
}

interface StudentForm {
  firstName: string
  lastName: string
  email: string
  selectedPlan: string
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic Plan',
    capacity: 50,
    currentEnrollments: 32,
    color: 'bg-blue-500',
    icon: BookOpen,
    description: 'Essential AI training for beginners',
    price: 'Free'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    capacity: 100,
    currentEnrollments: 67,
    color: 'bg-green-500',
    icon: Shield,
    description: 'Advanced features with priority support',
    price: '$29/month'
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    capacity: 200,
    currentEnrollments: 145,
    color: 'bg-purple-500',
    icon: Crown,
    description: 'Full access with custom integrations',
    price: '$99/month'
  }
]

// Dummy students data
const dummyStudents: Student[] = [
  {
    id: '1',
    firstName: 'Thabo',
    lastName: 'Nkosi',
    email: 'thabo.nkosi@demo.edu',
    plan: 'basic',
    enrolledAt: '2024-01-15',
    status: 'active',
    progress: 75
  },
  {
    id: '2',
    firstName: 'Lerato',
    lastName: 'Mokoena',
    email: 'lerato.mokoena@demo.edu',
    plan: 'premium',
    enrolledAt: '2024-01-20',
    status: 'active',
    progress: 45
  },
  {
    id: '3',
    firstName: 'Sipho',
    lastName: 'Dlamini',
    email: 'sipho.dlamini@demo.edu',
    plan: 'enterprise',
    enrolledAt: '2024-02-01',
    status: 'active',
    progress: 90
  },
  {
    id: '4',
    firstName: 'Nandi',
    lastName: 'Khumalo',
    email: 'nandi.khumalo@demo.edu',
    plan: 'basic',
    enrolledAt: '2024-02-10',
    status: 'inactive',
    progress: 25
  },
  {
    id: '5',
    firstName: 'Boitumelo',
    lastName: 'Mashaba',
    email: 'boitumelo.mashaba@demo.edu',
    plan: 'premium',
    enrolledAt: '2024-02-15',
    status: 'active',
    progress: 60
  },
  {
    id: '6',
    firstName: 'Kgalalelo',
    lastName: 'Mthembu',
    email: 'kgalalelo.mthembu@demo.edu',
    plan: 'enterprise',
    enrolledAt: '2024-02-20',
    status: 'suspended',
    progress: 30
  }
]

export function StudentEnrollment() {
  const [students, setStudents] = useState<Student[]>(dummyStudents)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [planFilter, setPlanFilter] = useState<string>('all')
  const [showAddStudent, setShowAddStudent] = useState(false)
  const [showEditStudent, setShowEditStudent] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [studentForm, setStudentForm] = useState<StudentForm>({
    firstName: '',
    lastName: '',
    email: '',
    selectedPlan: ''
  })


  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter
      const matchesPlan = planFilter === 'all' || student.plan === planFilter
      return matchesSearch && matchesStatus && matchesPlan
    })
  }, [students, searchTerm, statusFilter, planFilter])

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(filteredStudents.map(s => s.id))
    } else {
      setSelectedStudents([])
    }
  }

  const handleSelectStudent = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId])
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId))
    }
  }

  const handleAddStudent = () => {
    setStudentForm({ firstName: '', lastName: '', email: '', selectedPlan: '' })
    setShowAddStudent(true)
  }

  const handleEditStudent = (student: Student) => {
    setEditingStudent(student)
    setStudentForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      selectedPlan: student.plan
    })
    setShowEditStudent(true)
  }

  const handleDeleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId))
    setSelectedStudents(prev => prev.filter(id => id !== studentId))
    toast.success('Student deleted successfully')
  }

  const handleBulkDelete = () => {
    if (selectedStudents.length === 0) {
      toast.error('Please select students to delete')
      return
    }
    setStudents(prev => prev.filter(s => !selectedStudents.includes(s.id)))
    setSelectedStudents([])
    toast.success(`${selectedStudents.length} students deleted successfully`)
  }

  const handleSubmitStudent = () => {
    if (!studentForm.firstName || !studentForm.lastName || !studentForm.email) {
      toast.error('Please fill in all fields')
      return
    }

    if (!studentForm.selectedPlan) {
      toast.error('Please select a plan')
      return
    }

    // Check capacity
    const plan = plans.find(p => p.id === studentForm.selectedPlan)
    if (plan && plan.currentEnrollments >= plan.capacity) {
      toast.error('This plan has reached its capacity limit')
      return
    }

    if (editingStudent) {
      // Update existing student
      setStudents(prev => prev.map(s => 
        s.id === editingStudent.id 
          ? { ...s, firstName: studentForm.firstName, lastName: studentForm.lastName, email: studentForm.email, plan: studentForm.selectedPlan }
          : s
      ))
      toast.success('Student updated successfully!')
      setShowEditStudent(false)
    } else {
      // Add new student
      const newStudent: Student = {
        id: Date.now().toString(),
        firstName: studentForm.firstName,
        lastName: studentForm.lastName,
        email: studentForm.email,
        plan: studentForm.selectedPlan,
        enrolledAt: new Date().toISOString().split('T')[0],
        status: 'active',
        progress: 0
      }
      setStudents(prev => [...prev, newStudent])
      toast.success(`Student ${studentForm.firstName} ${studentForm.lastName} enrolled successfully!`)
      setShowAddStudent(false)
    }
    
    setStudentForm({ firstName: '', lastName: '', email: '', selectedPlan: '' })
    setEditingStudent(null)
  }

  const getCapacityStatus = (plan: Plan) => {
    const percentage = (plan.currentEnrollments / plan.capacity) * 100
    if (percentage >= 90) return { status: 'critical', color: 'text-red-600', bg: 'bg-red-50' }
    if (percentage >= 75) return { status: 'warning', color: 'text-yellow-600', bg: 'bg-yellow-50' }
    return { status: 'good', color: 'text-green-600', bg: 'bg-green-50' }
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Welcome Header */}
      <div className="relative overflow-hidden gradient-primary rounded-3xl p-8 text-white shadow-large">
        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-yellow-300/10 to-transparent rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Users className="h-10 w-10 text-yellow-300 animate-pulse" />
                  <div className="absolute inset-0 h-10 w-10 bg-yellow-300/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                    Student Management System
                  </h1>
                  <p className="text-lg font-medium text-green-100 mt-1">Advanced Enrollment & Progress Tracking</p>
                </div>
                <Sparkles className="h-8 w-8 text-yellow-300 float" />
              </div>
              <p className="text-white/90 text-xl leading-relaxed max-w-2xl">
                Comprehensive student enrollment management with real-time progress monitoring and performance analytics
              </p>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <Users className="h-5 w-5 text-blue-200" />
                  <span className="font-semibold">{students.length}</span>
                  <span className="text-white/80">Total Students</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <Target className="h-5 w-5 text-green-200" />
                  <span className="font-semibold">{students.filter(s => s.status === 'active').length}</span>
                  <span className="text-white/80">Active</span>
                </div>
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                  <Activity className="h-5 w-5 text-purple-200" />
                  <span className="font-semibold">{Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length)}%</span>
                  <span className="text-white/80">Avg Progress</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-80 h-48 bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-green-400/30 via-blue-400/20 to-purple-400/30 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="relative z-10 text-center">
                    <Brain className="h-20 w-20 text-white/80 mx-auto mb-2" />
                    <p className="text-white/70 font-medium">Student Portal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Action Section */}
      <Card className="shadow-soft border-0 bg-gradient-to-r from-gray-50 via-blue-50 to-green-50">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-blue-500 rounded-full"></div>
                Student Directory
              </h2>
              <p className="text-gray-600 ml-4">View and manage all enrolled students with advanced filtering options</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedStudents.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-red-600 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedStudents.length})
                </Button>
              )}
              <Button 
                onClick={handleAddStudent}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <UserPlus className="h-4 w-4" />
                Add Student
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card className="shadow-soft border-0 bg-gradient-to-r from-gray-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/80 border-gray-200 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40 bg-white/80 border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-40 bg-white/80 border-gray-200 focus:border-blue-400">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Students Table */}
      <Card className="shadow-soft border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 via-blue-50 to-green-50 border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">Student Directory</span>
              <p className="text-sm font-medium text-gray-600 mt-1">Manage enrolled students and their progress</p>
            </div>
            <Badge variant="outline" className="ml-auto bg-white/80 border-green-200 text-green-700">
              <Activity className="h-3 w-3 mr-1" />
              {filteredStudents.filter(s => s.status === 'active').length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6">
                    <Checkbox
                      checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                      onCheckedChange={handleSelectAll}
                      className="border-gray-300"
                    />
                  </th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Student</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Plan</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Progress</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Enrolled</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const plan = plans.find(p => p.id === student.plan)
                  const Icon = plan?.icon || BookOpen
                  return (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-green-50/50 transition-all duration-200 group">
                      <td className="py-4 px-6">
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => handleSelectStudent(student.id, checked as boolean)}
                          className="border-gray-300"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm">
                            <span className="text-sm font-bold text-gray-700">
                              {student.firstName[0]}{student.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{student.firstName} {student.lastName}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 ${plan?.color} rounded-xl flex items-center justify-center shadow-sm`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-900">{plan?.name}</span>
                            <p className="text-xs text-gray-500">{plan?.price}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge 
                          variant={
                            student.status === 'active' ? 'default' : 
                            student.status === 'inactive' ? 'secondary' : 
                            'destructive'
                          }
                          className={`font-medium ${
                            student.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                            student.status === 'inactive' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            'bg-red-100 text-red-700 border-red-200'
                          }`}
                        >
                          {student.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {student.status === 'inactive' && <Clock className="h-3 w-3 mr-1" />}
                          {student.status === 'suspended' && <AlertCircle className="h-3 w-3 mr-1" />}
                          {student.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Progress value={student.progress} className="h-3 bg-gray-200" />
                          </div>
                          <span className="text-sm font-semibold text-gray-700 min-w-[3rem]">{student.progress}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {new Date(student.enrolledAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditStudent(student)}
                            className="flex items-center gap-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                          >
                            <Edit className="h-3 w-3" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteStudent(student.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Add/Edit Student Dialog */}
      <Dialog open={showAddStudent || showEditStudent} onOpenChange={(open) => {
        if (!open) {
          setShowAddStudent(false)
          setShowEditStudent(false)
          setEditingStudent(null)
          setStudentForm({ firstName: '', lastName: '', email: '', selectedPlan: '' })
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {editingStudent ? 'Edit Student Information' : 'Enroll New Student'}
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  {editingStudent ? 'Update student details and enrollment status' : 'Add a new student to the system'}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name</Label>
                <Input
                  id="firstName"
                  value={studentForm.firstName}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  className="bg-white/90 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name</Label>
                <Input
                  id="lastName"
                  value={studentForm.lastName}
                  onChange={(e) => setStudentForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  className="bg-white/90 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={studentForm.email}
                onChange={(e) => setStudentForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter email address"
                className="bg-white/90 border-gray-200 focus:border-green-400 focus:ring-green-400/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="plan" className="text-sm font-semibold text-gray-700">Enrollment Plan</Label>
              <Select value={studentForm.selectedPlan} onValueChange={(value) => setStudentForm(prev => ({ ...prev, selectedPlan: value }))}>
                <SelectTrigger className="bg-white/90 border-gray-200 focus:border-green-400">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map(plan => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 ${plan.color} rounded-lg flex items-center justify-center`}>
                          <plan.icon className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <span className="font-medium">{plan.name}</span>
                          <span className="text-gray-500 ml-2">- {plan.price}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddStudent(false)
                setShowEditStudent(false)
                setEditingStudent(null)
                setStudentForm({ firstName: '', lastName: '', email: '', selectedPlan: '' })
              }}
              className="px-6 py-2 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitStudent}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              {editingStudent ? 'Update Student' : 'Enroll Student'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
