import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Progress } from '../ui/progress'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { toast } from 'sonner'
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  TrendingUp, 
  Play, 
  CheckCircle,
  Users,
  Calendar,
  Brain,
  Target,
  Zap,
  Star,
  Award,
  Sparkles,
  BarChart3,
  Activity,
  Flame,
  Rocket,
  Shield,
  Lightbulb,
  ArrowRight,
  Plus,
  Eye
} from 'lucide-react'
import type { DashboardData } from '../../types'
import { ImageWithFallback } from '../figma/ImageWithFallback'

export function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await api.getDashboard()
      setDashboardData(data)
    } catch (error) {
      console.error('Dashboard error:', error)
      toast.error('Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
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

  if (!dashboardData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Unable to load dashboard data</p>
        <Button onClick={loadDashboard} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  const avgProgress = dashboardData.enrollments.length > 0 
    ? dashboardData.enrollments.reduce((sum, e) => sum + e.progress, 0) / dashboardData.enrollments.length 
    : 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="gradient-primary rounded-2xl p-8 text-white shadow-large">
        <div className="flex items-center justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-yellow-300 animate-pulse" />
              <h1 className="text-3xl font-bold">Welcome back!</h1>
              <Sparkles className="h-6 w-6 text-yellow-300 float" />
            </div>
            <p className="text-white/90 text-lg">Ready to continue your AI learning journey?</p>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Target className="h-3 w-3 mr-1" />
                {dashboardData.totalCourses} Active Courses
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Flame className="h-3 w-3 mr-1" />
                {Math.round(avgProgress)}% Progress
              </Badge>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-64 h-40 bg-white/10 rounded-xl overflow-hidden border border-white/20 shadow-md">
              <ImageWithFallback
                src="https://farmersreview.co.bw/wp-content/uploads/2021/06/insemination-vache-afrique.jpg"
                alt="Artificial insemination in livestock"
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
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
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">Enrolled Courses</span>
                </div>
                <p className="text-3xl font-bold text-blue-900">{dashboardData.totalCourses}</p>
                <div className="flex items-center gap-1 text-blue-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">+2 this week</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-soft border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Completed</span>
                </div>
                <p className="text-3xl font-bold text-green-900">{dashboardData.completedCourses}</p>
                <div className="flex items-center gap-1 text-green-600">
                  <Award className="h-4 w-4" />
                  <span className="text-sm">Certificates earned</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift shadow-soft border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">Time Spent</span>
                </div>
                <p className="text-3xl font-bold text-orange-900">{formatTime(dashboardData.totalTimeSpent)}</p>
                <div className="flex items-center gap-1 text-orange-600">
                  <Activity className="h-4 w-4" />
                  <span className="text-sm">Learning streak</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
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
                  <span className="text-sm font-medium text-purple-700">Avg Progress</span>
                </div>
                <p className="text-3xl font-bold text-purple-900">{Math.round(avgProgress)}%</p>
                <div className="flex items-center gap-1 text-purple-600">
                  <Zap className="h-4 w-4" />
                  <span className="text-sm">Excellent pace!</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              My Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dashboardData.enrollments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No courses enrolled yet</p>
                <p className="text-sm">Browse our catalog to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {dashboardData.enrollments.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.courseId} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">Course {enrollment.courseId}</h4>
                        <p className="text-sm text-gray-500">
                          {enrollment.completedLessons || 0} lessons completed
                        </p>
                      </div>
                      <Badge variant={enrollment.status === 'completed' ? 'default' : 'secondary'}>
                        {enrollment.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(enrollment.progress)}%</span>
                      </div>
                      <Progress value={enrollment.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-sm text-gray-500">
                        {formatTime(enrollment.timeSpent || 0)} spent
                      </span>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Continue
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.enrollments.length > 0 ? (
                dashboardData.enrollments.slice(0, 5).map((enrollment, index) => (
                  <div key={`activity-${index}`} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Enrolled in Course {enrollment.courseId}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start learning to see your progress here</p>
                </div>
              )}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              Browse Courses
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <Trophy className="h-6 w-6" />
              View Certificates
            </Button>
            <Button variant="outline" className="h-16 flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              Track Progress
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}