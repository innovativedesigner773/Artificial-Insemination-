import { useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { AuthPage } from './components/auth/AuthPage'
import { Navigation } from './components/layout/Navigation'
import { StudentDashboard } from './components/dashboard/StudentDashboard'
import { CourseList } from './components/courses/CourseList'
import { CourseViewer } from './components/courses/CourseViewer'
import { CertificateList } from './components/certificates/CertificateList'
import { Toaster } from './components/ui/sonner'
import { Skeleton } from './components/ui/skeleton'

function AppContent() {
  const { user, loading, isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

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
    switch (currentPage) {
      case 'dashboard':
        return <StudentDashboard />
      case 'courses':
        return (
          <CourseList 
            onCourseSelect={(courseId) => setSelectedCourseId(courseId)}
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