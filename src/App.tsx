import React, { useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { AuthPage } from './components/auth/AuthPage'
import { Navigation } from './components/layout/Navigation'
import { StudentDashboard } from './components/dashboard/StudentDashboard'
import { InstructorDashboard } from './components/dashboard/InstructorDashboard'
import { AdminDashboard } from './components/dashboard/AdminDashboard'
import { UserManagement } from './components/dashboard/UserManagement'
import { CourseList } from './components/courses/CourseList'
import { CourseViewer } from './components/courses/CourseViewer'
import { CourseCreator } from './components/courses/CourseCreator'
import { CourseDetailView } from './components/courses/CourseDetailView'
import { CertificateList } from './components/certificates/CertificateList'
import { Button } from './components/ui/button'
import { Toaster } from './components/ui/sonner'
import { Skeleton } from './components/ui/skeleton'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [showCourseCreator, setShowCourseCreator] = useState(false)
  const [showCourseDetail, setShowCourseDetail] = useState(false)
  const [courseDetailId, setCourseDetailId] = useState<string | null>(null)

  // Set initial page based on user role when user changes
  React.useEffect(() => {
    if (user?.role === 'admin') {
      setCurrentPage('dashboard')
    } else if (user?.role === 'instructor') {
      setCurrentPage('instructor_dashboard')
    } else {
      setCurrentPage('dashboard')
    }
  }, [user])

  // Show welcome message based on user role
  React.useEffect(() => {
    if (user && isAuthenticated) {
      if (user.role === 'admin') {
        toast.success(`Welcome back, ${user.firstName}! Redirecting to Admin Dashboard...`)
      } else if (user.role === 'instructor') {
        toast.success(`Welcome back, ${user.firstName}! Redirecting to Instructor...`)
      } else {
        toast.success(`Welcome back, ${user.firstName}!`)
      }
    }
  }, [user, isAuthenticated])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <Skeleton className="h-12 w-48" />
        </div>
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  // Course creator mode
  if (showCourseCreator) {
    return (
      <CourseCreator
        onBack={() => setShowCourseCreator(false)}
        onCourseCreated={(courseId) => {
          setShowCourseCreator(false)
          setSelectedCourseId(courseId)
        }}
      />
    )
  }

  // Course detail view mode
  if (showCourseDetail && courseDetailId) {
    return (
      <CourseDetailView
        courseId={courseDetailId}
        onBack={() => {
          setShowCourseDetail(false)
          setCourseDetailId(null)
        }}
        onStartLearning={(courseId) => {
          setShowCourseDetail(false)
          setCourseDetailId(null)
          setSelectedCourseId(courseId)
        }}
      />
    )
  }

  // Course viewer mode
  if (selectedCourseId) {
    return (
      <CourseViewer
        courseId={selectedCourseId}
        onBack={() => setSelectedCourseId(null)}
      />
    )
  }

  const renderPage = () => {
    // Admin users get different dashboard and additional pages
    if (user?.role === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminDashboard />
        case 'users':
          return <UserManagement />
        case 'analytics':
          return (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Analytics</h2>
                <p className="text-gray-500">Analytics dashboard will be implemented here.</p>
              </div>
            </div>
          )
        case 'reports':
          return (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Reports</h2>
                <p className="text-gray-500">Reports interface will be implemented here.</p>
              </div>
            </div>
          )
        case 'courses':
          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
                  <p className="text-gray-600">Manage and create courses for your platform</p>
                </div>
                <Button 
                  onClick={() => setShowCourseCreator(true)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create New Course
                </Button>
              </div>
              <CourseList 
                onGetStarted={(courseId: string) => {
                  setCourseDetailId(courseId)
                  setShowCourseDetail(true)
                }}
              />
            </div>
          )
        case 'profile':
          return (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Admin Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={user?.firstName || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user?.lastName || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        default:
          return <AdminDashboard />
      }
    }

    // Instructor pages
    if (user?.role === 'instructor') {
      switch (currentPage) {
        case 'instructor_dashboard':
          return <InstructorDashboard />
        case 'courses':
          return (
            <CourseList 
              onGetStarted={(courseId: string) => {
                setCourseDetailId(courseId)
                setShowCourseDetail(true)
              }}
            />
          )
        case 'profile':
          return (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold mb-6">Instructor Profile</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={user?.firstName || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={user?.lastName || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={user?.role || ''}
                      className="w-full p-3 border border-gray-300 rounded-md"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        default:
          return <InstructorDashboard />
      }
    }

    // Regular user pages
    switch (currentPage) {
      case 'dashboard':
        return <StudentDashboard />
      case 'courses':
        return (
          <CourseList 
            onGetStarted={(courseId: string) => {
              setCourseDetailId(courseId)
              setShowCourseDetail(true)
            }}
          />
        )
      case 'certificates':
        return <CertificateList />
      case 'profile':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={user?.firstName || ''}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={user?.lastName || ''}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return <StudentDashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="max-w-7xl mx-auto p-6">
        {renderPage()}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  )
}