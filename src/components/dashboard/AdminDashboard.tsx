import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { toast } from 'sonner'
import { 
  Users, 
  BookOpen, 
  Trophy, 
  TrendingUp, 
  Shield,
  Settings,
  BarChart3,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Sparkles,
  Brain,
  Target,
  Zap,
  Flame,
  Rocket,
  Lightbulb,
  ArrowRight,
  Plus,
  Eye,
  UserPlus,
  FileText,
  Calendar,
  Database,
  Lock,
  Globe,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw
} from 'lucide-react'
import { api } from '../../services/api'

interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
  activeUsers: number
  completedCourses: number
  totalRevenue: number
  newUsersThisMonth: number
  courseCompletionRate: number
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
  lastActive: string
  status: 'active' | 'inactive'
}

interface RecentActivity {
  id: string
  type: 'enrollment' | 'completion' | 'registration' | 'course_created'
  user: string
  course?: string
  timestamp: string
  description: string
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      // Simulate API calls - replace with actual API endpoints
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for demonstration
      setStats({
        totalUsers: 1247,
        totalCourses: 23,
        totalEnrollments: 3456,
        activeUsers: 892,
        completedCourses: 1234,
        totalRevenue: 45600,
        newUsersThisMonth: 156,
        courseCompletionRate: 78.5
      })

      setRecentUsers([
        {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'student',
          joinedAt: '2024-01-15',
          lastActive: '2024-01-20',
          status: 'active'
        },
        {
          id: '2',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'instructor',
          joinedAt: '2024-01-10',
          lastActive: '2024-01-19',
          status: 'active'
        },
        {
          id: '3',
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'student',
          joinedAt: '2024-01-12',
          lastActive: '2024-01-18',
          status: 'inactive'
        }
      ])

      setRecentActivity([
        {
          id: '1',
          type: 'enrollment',
          user: 'John Doe',
          course: 'AI Fundamentals',
          timestamp: '2024-01-20T10:30:00Z',
          description: 'John Doe enrolled in AI Fundamentals'
        },
        {
          id: '2',
          type: 'completion',
          user: 'Sarah Wilson',
          course: 'Machine Learning Basics',
          timestamp: '2024-01-20T09:15:00Z',
          description: 'Sarah Wilson completed Machine Learning Basics'
        },
        {
          id: '3',
          type: 'registration',
          user: 'New User',
          timestamp: '2024-01-20T08:45:00Z',
          description: 'New user registered'
        }
      ])
    } catch (error) {
      console.error('Admin dashboard error:', error)
      toast.error('Failed to load admin dashboard')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      const all = await api.listUsers()
      setUsers(all)
    } catch (e) {
      console.error(e)
    } finally {
      setUsersLoading(false)
    }
  }
  
  useEffect(() => { loadUsers() }, [])

  const changeRole = async (userId: string, role: 'student' | 'instructor' | 'admin') => {
    await api.setUserRole(userId, role)
    await loadUsers()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load admin dashboard data</p>
        <Button onClick={loadAdminData} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="gradient-primary rounded-2xl p-8 text-white shadow-large">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-yellow-300 animate-pulse" />
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <Sparkles className="h-6 w-6 text-yellow-300 float" />
            </div>
            <p className="text-white/90 text-lg">Manage your learning platform with powerful insights</p>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Users className="h-3 w-3 mr-1" />
                {stats.totalUsers} Total Users
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <BookOpen className="h-3 w-3 mr-1" />
                {stats.totalCourses} Courses
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stats.courseCompletionRate}% Completion Rate
              </Badge>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
              <BarChart3 className="h-16 w-16 text-white animate-bounce" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover-lift shadow-soft border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Total Users</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">{stats.totalUsers.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+{stats.newUsersThisMonth} this month</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-soft border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Total Courses</span>
                </div>
                <p className="text-3xl font-bold text-green-900">{stats.totalCourses}</p>
                <div className="flex items-center gap-1 text-green-600">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Active courses</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-soft border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Enrollments</span>
                </div>
                <p className="text-3xl font-bold text-orange-900">{stats.totalEnrollments.toLocaleString()}</p>
                <div className="flex items-center gap-1 text-orange-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Total enrollments</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-soft border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium text-purple-700">Revenue</span>
                </div>
                <p className="text-3xl font-bold text-purple-900">{formatCurrency(stats.totalRevenue)}</p>
                <div className="flex items-center gap-1 text-purple-600">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">Total revenue</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" /> Users
          </h2>
          <Button variant="outline" size="sm" onClick={loadUsers} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Organization</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr><td className="px-4 py-4" colSpan={5}>Loading users…</td></tr>
              ) : users.length === 0 ? (
                <tr><td className="px-4 py-4" colSpan={5}>No users found.</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-2">{u.firstName} {u.lastName}</td>
                    <td className="px-4 py-2">{u.email || '—'}</td>
                    <td className="px-4 py-2">
                      <Badge variant="outline">{u.role}</Badge>
                    </td>
                    <td className="px-4 py-2">{u.organization || '—'}</td>
                    <td className="px-4 py-2 space-x-2">
                      <Button size="sm" variant="outline" onClick={() => changeRole(u.id, 'student')}>Make Student</Button>
                      <Button size="sm" variant="outline" onClick={() => changeRole(u.id, 'instructor')}>Make Instructor</Button>
                      <Button size="sm" onClick={() => changeRole(u.id, 'admin')}>Make Admin</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-400">Joined {formatDate(user.joinedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {formatDateTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Course Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">{stats.courseCompletionRate}%</p>
                <p className="text-sm text-gray-500">Average completion rate</p>
              </div>
              <Progress value={stats.courseCompletionRate} className="h-3" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Completed: {stats.completedCourses}</span>
                <span>Total: {stats.totalEnrollments}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-blue-600">{stats.activeUsers}</p>
                <p className="text-sm text-gray-500">Currently active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-700">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </p>
                <p className="text-sm text-gray-500">of total users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Growth This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-4xl font-bold text-green-600">+{stats.newUsersThisMonth}</p>
                <p className="text-sm text-gray-500">New users</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-700">
                  {Math.round((stats.newUsersThisMonth / stats.totalUsers) * 100)}%
                </p>
                <p className="text-sm text-gray-500">growth rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <UserPlus className="h-6 w-6" />
              Add User
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Plus className="h-6 w-6" />
              Create Course
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BarChart3 className="h-6 w-6" />
              View Reports
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Settings className="h-6 w-6" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
