import { useState, useEffect } from 'react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { BatchUserCreator } from './BatchUserCreator'
import { 
  Users, 
  UserPlus,
  RefreshCw,
  Shield
} from 'lucide-react'
import { api } from '../../services/api'

export function UserManagement() {
  const [users, setUsers] = useState<any[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [showBatchUserCreator, setShowBatchUserCreator] = useState(false)

  const loadUsers = async () => {
    try {
      setUsersLoading(true)
      const all = await api.listUsers()
      setUsers(all)
    } catch (e) {
      console.error(e)
      toast.error('Failed to load users')
    } finally {
      setUsersLoading(false)
    }
  }
  
  useEffect(() => { 
    loadUsers() 
  }, [])

  const changeRole = async (userId: string, role: 'student' | 'instructor' | 'admin') => {
    try {
      await api.setUserRole(userId, role)
      toast.success(`User role updated to ${role}`)
      await loadUsers()
    } catch (error) {
      toast.error('Failed to update user role')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-white/90">Manage students, instructors, and administrators</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-white/20 text-white border-white/30">
            <Users className="h-3 w-3 mr-1" />
            {users.length} Total Users
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            <Shield className="h-3 w-3 mr-1" />
            {users.filter(u => u.role === 'admin').length} Admins
          </Badge>
        </div>
      </div>

      {/* Users Table */}
      <Card className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5" /> All Users
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setShowBatchUserCreator(true)} 
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" /> Add Batch of Students
            </Button>
            <Button variant="outline" size="sm" onClick={loadUsers} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Organization</th>
                <th className="px-4 py-3 font-semibold">Access Expires</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      Loading users…
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td className="px-4 py-12 text-center" colSpan={6}>
                    <div className="flex flex-col items-center gap-3">
                      <Users className="h-12 w-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">No users found</p>
                      <p className="text-sm text-gray-400">Click "Add Batch of Students" to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 font-medium text-gray-900">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="px-4 py-4 text-gray-600">{u.email || '—'}</td>
                    <td className="px-4 py-4">
                      <Badge 
                        variant="outline" 
                        className={
                          u.role === 'admin' ? 'border-red-500 text-red-700 bg-red-50' :
                          u.role === 'instructor' ? 'border-blue-500 text-blue-700 bg-blue-50' :
                          'border-green-500 text-green-700 bg-green-50'
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{u.organization || '—'}</td>
                    <td className="px-4 py-4">
                      {u.accessExpiresAt ? (
                        <span className={
                          new Date(u.accessExpiresAt) < new Date() 
                            ? 'text-red-600 font-semibold' 
                            : 'text-gray-600'
                        }>
                          {new Date(u.accessExpiresAt).toLocaleDateString()}
                        </span>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Unlimited
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => changeRole(u.id, 'student')}
                          disabled={u.role === 'student'}
                          className="text-xs"
                        >
                          Student
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => changeRole(u.id, 'instructor')}
                          disabled={u.role === 'instructor'}
                          className="text-xs"
                        >
                          Instructor
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => changeRole(u.id, 'admin')}
                          disabled={u.role === 'admin'}
                          className="text-xs"
                        >
                          Admin
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Batch User Creator Modal */}
      {showBatchUserCreator && (
        <BatchUserCreator
          onClose={() => setShowBatchUserCreator(false)}
          onSuccess={() => {
            loadUsers()
            toast.success('Users loaded successfully')
          }}
        />
      )}
    </div>
  )
}
