import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { api } from '../../services/api'
import { firestoreService } from '../../utils/firebase/database'
import { toast } from 'sonner'
import { Database, Eye, AlertCircle, CheckCircle } from 'lucide-react'

export function FirebaseDebugger() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const runDebug = async () => {
    setLoading(true)
    try {
      console.log('🔍 Starting Firebase Collections Debug...')
      
      // Get all courses
      const allCourses = await firestoreService.getAllCourses()
      console.log('📚 All Courses:', allCourses)
      
      // Get published courses only
      const publishedCourses = await firestoreService.getCourses()
      console.log('✅ Published Courses:', publishedCourses)
      
      // Get all users
      const allUsers = await firestoreService.getAllUsers()
      console.log('👥 All Users:', allUsers)
      
      // Get all quizzes
      const allQuizzes = await firestoreService.getQuizzes?.() || []
      console.log('🧠 All Quizzes:', allQuizzes)
      
      const debugData = {
        totalCourses: allCourses.length,
        publishedCourses: publishedCourses.length,
        unpublishedCourses: allCourses.length - publishedCourses.length,
        courses: allCourses.map(course => ({
          id: course.id,
          title: course.title,
          published: course.published,
          hasPublishedField: 'published' in course,
          category: course.category,
          difficulty: course.difficulty
        })),
        totalUsers: allUsers.length,
        totalQuizzes: allQuizzes.length,
        timestamp: new Date().toISOString()
      }
      
      setDebugInfo(debugData)
      toast.success('Debug completed! Check console for details.')
      
    } catch (error) {
      console.error('❌ Debug failed:', error)
      toast.error('Debug failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-600" />
          Firebase Collections Debugger
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button onClick={runDebug} disabled={loading} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {loading ? 'Running Debug...' : 'Debug Firebase Collections'}
          </Button>
          <p className="text-sm text-gray-600">
            This will check all your Firebase collections and show what's available.
          </p>
        </div>

        {debugInfo && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{debugInfo.totalCourses}</div>
                <div className="text-sm text-blue-700">Total Courses</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{debugInfo.publishedCourses}</div>
                <div className="text-sm text-green-700">Published</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{debugInfo.unpublishedCourses}</div>
                <div className="text-sm text-orange-700">Unpublished</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{debugInfo.totalUsers}</div>
                <div className="text-sm text-purple-700">Users</div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Course Details:</h3>
              {debugInfo.courses.map((course: any) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-gray-500">
                        {course.category} • {course.difficulty}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {course.published ? (
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Published
                      </Badge>
                    ) : (
                      <Badge className="bg-orange-100 text-orange-700">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Draft
                      </Badge>
                    )}
                    {!course.hasPublishedField && (
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        Missing 'published' field
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-xs text-gray-500">
              Debug completed at: {new Date(debugInfo.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
