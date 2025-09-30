import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { toast } from 'sonner'
import { 
  UserPlus, 
  X, 
  Plus, 
  Upload, 
  Download,
  Trash2,
  Users,
  AlertCircle,
  CheckCircle2,
  FileText,
  Calendar,
  Clock
} from 'lucide-react'
import { api } from '../../services/api'

interface NewUser {
  id: string
  firstName: string
  lastName: string
  email: string
  organization: string
  password: string
  status: 'pending' | 'success' | 'error'
  error?: string
}

type AccessDurationType = 'days' | 'months' | 'years' | 'unlimited'

interface BatchUserCreatorProps {
  onClose: () => void
  onSuccess: () => void
}

export function BatchUserCreator({ onClose, onSuccess }: BatchUserCreatorProps) {
  const [users, setUsers] = useState<NewUser[]>([
    { id: '1', firstName: '', lastName: '', email: '', organization: '', password: '', status: 'pending' }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPasswordHelper, setShowPasswordHelper] = useState(true)
  const [accessDurationType, setAccessDurationType] = useState<AccessDurationType>('months')
  const [accessDurationValue, setAccessDurationValue] = useState<number>(6)
  const [customExpiryDate, setCustomExpiryDate] = useState<string>('')

  const addUserRow = () => {
    const newId = (Math.max(...users.map(u => parseInt(u.id))) + 1).toString()
    setUsers([
      ...users,
      { id: newId, firstName: '', lastName: '', email: '', organization: '', password: '', status: 'pending' }
    ])
  }

  const removeUserRow = (id: string) => {
    if (users.length > 1) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const updateUser = (id: string, field: keyof NewUser, value: string) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, [field]: value, status: 'pending' } : u
    ))
  }

  const generatePassword = (id: string) => {
    const password = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10).toUpperCase() + '123!'
    updateUser(id, 'password', password)
  }

  const generateAllPasswords = () => {
    setUsers(users.map(u => ({
      ...u,
      password: Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10).toUpperCase() + '123!',
      status: 'pending' as const
    })))
  }

  const handleCSVImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split('\n').filter(line => line.trim())
      
      // Skip header row
      const dataLines = lines.slice(1)
      
      const importedUsers: NewUser[] = dataLines.map((line, index) => {
        const [firstName, lastName, email, organization] = line.split(',').map(s => s.trim())
        return {
          id: (index + 1).toString(),
          firstName: firstName || '',
          lastName: lastName || '',
          email: email || '',
          organization: organization || '',
          password: '',
          status: 'pending' as const
        }
      }).filter(u => u.email) // Only include rows with email

      if (importedUsers.length > 0) {
        setUsers(importedUsers)
        toast.success(`Imported ${importedUsers.length} users from CSV`)
      } else {
        toast.error('No valid users found in CSV file')
      }
    }
    reader.readAsText(file)
  }

  const downloadCSVTemplate = () => {
    const csvContent = 'First Name,Last Name,Email,Organization\nJohn,Doe,john.doe@example.com,Acme Corp\nJane,Smith,jane.smith@example.com,Tech Inc'
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const exportUsersWithPasswords = () => {
    const csvContent = [
      'First Name,Last Name,Email,Organization,Password',
      ...users.map(u => `${u.firstName},${u.lastName},${u.email},${u.organization},${u.password}`)
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    toast.success('User credentials exported successfully!')
  }

  const calculateExpirationDate = (): string | undefined => {
    if (accessDurationType === 'unlimited') {
      return undefined
    }

    if (customExpiryDate) {
      return new Date(customExpiryDate).toISOString()
    }

    const now = new Date()
    let expirationDate = new Date()

    switch (accessDurationType) {
      case 'days':
        expirationDate.setDate(now.getDate() + accessDurationValue)
        break
      case 'months':
        expirationDate.setMonth(now.getMonth() + accessDurationValue)
        break
      case 'years':
        expirationDate.setFullYear(now.getFullYear() + accessDurationValue)
        break
    }

    return expirationDate.toISOString()
  }

  const getAccessDurationInDays = (): number | undefined => {
    if (accessDurationType === 'unlimited') {
      return undefined
    }

    if (customExpiryDate) {
      const now = new Date()
      const expiry = new Date(customExpiryDate)
      const diffTime = expiry.getTime() - now.getTime()
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    }

    switch (accessDurationType) {
      case 'days':
        return accessDurationValue
      case 'months':
        return accessDurationValue * 30
      case 'years':
        return accessDurationValue * 365
      default:
        return undefined
    }
  }

  const validateUsers = (): boolean => {
    let isValid = true
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    for (const user of users) {
      if (!user.firstName.trim()) {
        toast.error(`Please enter first name for ${user.email || 'user'}`)
        isValid = false
        break
      }
      if (!user.lastName.trim()) {
        toast.error(`Please enter last name for ${user.email || 'user'}`)
        isValid = false
        break
      }
      if (!user.email.trim() || !emailRegex.test(user.email)) {
        toast.error(`Please enter a valid email for ${user.firstName} ${user.lastName}`)
        isValid = false
        break
      }
      if (!user.password || user.password.length < 6) {
        toast.error(`Password for ${user.email} must be at least 6 characters`)
        isValid = false
        break
      }
    }

    // Validate access duration
    if (customExpiryDate) {
      const expiry = new Date(customExpiryDate)
      if (expiry <= new Date()) {
        toast.error('Expiry date must be in the future')
        isValid = false
      }
    } else if (accessDurationType !== 'unlimited' && accessDurationValue <= 0) {
      toast.error('Access duration must be greater than 0')
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async () => {
    if (!validateUsers()) return

    setIsSubmitting(true)
    let successCount = 0
    let failCount = 0

    const expirationDate = calculateExpirationDate()
    const durationInDays = getAccessDurationInDays()

    for (const user of users) {
      try {
        // Create user account with access duration
        await api.register({
          email: user.email,
          password: user.password,
          firstName: user.firstName,
          lastName: user.lastName,
          organization: user.organization,
          accessExpiresAt: expirationDate,
          accessDuration: durationInDays
        })

        // Note: api.register might log in the new user automatically
        // We'll handle re-authentication after all users are created

        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? { ...u, status: 'success' } : u
          )
        )
        successCount++
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to create user'
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u.id === user.id ? { ...u, status: 'error', error: errorMessage } : u
          )
        )
        failCount++
      }
    }

    setIsSubmitting(false)

    if (failCount === 0) {
      toast.success(`Successfully created ${successCount} students!`)
      onSuccess()
      setTimeout(() => {
        onClose()
      }, 2000)
    } else {
      toast.error(`Created ${successCount} students, ${failCount} failed. Check errors below.`)
    }
  }

  const getStatusIcon = (status: NewUser['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Add Batch of Students</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Create multiple student accounts at once</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {/* Helper Info */}
          {showPasswordHelper && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 mb-1">Quick Tips</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Click "Generate All Passwords" to auto-create secure passwords for all users</li>
                      <li>• Use "Import CSV" to bulk import users from a spreadsheet</li>
                      <li>• Export credentials after creation to share with students</li>
                      <li>• All users will be created with the "student" role</li>
                    </ul>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowPasswordHelper(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Access Duration Settings */}
          <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-purple-600" />
                Student Access Duration
                <Badge variant="secondary" className="ml-2">Required</Badge>
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Set how long these students will have access to the system
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Duration Type</Label>
                  <select
                    value={accessDurationType}
                    onChange={(e) => setAccessDurationType(e.target.value as AccessDurationType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    disabled={isSubmitting}
                  >
                    <option value="days">Days</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                    <option value="unlimited">Unlimited Access</option>
                  </select>
                </div>

                {accessDurationType !== 'unlimited' && (
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Duration</Label>
                    <Input
                      type="number"
                      min="1"
                      value={accessDurationValue}
                      onChange={(e) => setAccessDurationValue(parseInt(e.target.value) || 0)}
                      placeholder="Enter duration"
                      disabled={isSubmitting}
                      className="border-gray-300"
                    />
                  </div>
                )}
              </div>

              {accessDurationType !== 'unlimited' && (
                <div className="space-y-2">
                  <Label className="text-sm font-semibold flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Or Set Custom Expiry Date (Optional)
                  </Label>
                  <Input
                    type="date"
                    value={customExpiryDate}
                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    disabled={isSubmitting}
                    className="border-gray-300"
                  />
                  <p className="text-xs text-gray-500">
                    Leave empty to use duration above. Custom date overrides duration if set.
                  </p>
                </div>
              )}

              {/* Preview */}
              <div className="p-3 bg-white border border-purple-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                  <div className="flex-1 text-sm">
                    <strong className="text-purple-900">Access will expire:</strong>
                    {accessDurationType === 'unlimited' ? (
                      <span className="ml-2 text-green-700 font-semibold">Never (Unlimited Access)</span>
                    ) : customExpiryDate ? (
                      <span className="ml-2 text-purple-700 font-semibold">
                        {new Date(customExpiryDate).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    ) : (
                      <span className="ml-2 text-purple-700 font-semibold">
                        {(() => {
                          const expiry = new Date()
                          switch (accessDurationType) {
                            case 'days':
                              expiry.setDate(expiry.getDate() + accessDurationValue)
                              break
                            case 'months':
                              expiry.setMonth(expiry.getMonth() + accessDurationValue)
                              break
                            case 'years':
                              expiry.setFullYear(expiry.getFullYear() + accessDurationValue)
                              break
                          }
                          return expiry.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        })()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={addUserRow} variant="outline" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Row
            </Button>
            <Button onClick={generateAllPasswords} variant="outline" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Generate All Passwords
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleCSVImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Import CSV
              </Button>
            </div>
            <Button onClick={downloadCSVTemplate} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
            <Badge variant="secondary" className="ml-auto flex items-center gap-2 px-3 py-2">
              <Users className="h-4 w-4" />
              {users.length} {users.length === 1 ? 'user' : 'users'}
            </Badge>
          </div>

          {/* Users Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">First Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Last Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Organization</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Password</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr 
                      key={user.id} 
                      className={`
                        ${user.status === 'success' ? 'bg-green-50' : ''}
                        ${user.status === 'error' ? 'bg-red-50' : ''}
                      `}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(user.status)}
                          {user.status === 'error' && user.error && (
                            <span className="text-xs text-red-600" title={user.error}>
                              Error
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={user.firstName}
                          onChange={(e) => updateUser(user.id, 'firstName', e.target.value)}
                          placeholder="John"
                          disabled={isSubmitting}
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={user.lastName}
                          onChange={(e) => updateUser(user.id, 'lastName', e.target.value)}
                          placeholder="Doe"
                          disabled={isSubmitting}
                          className="min-w-[120px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          type="email"
                          value={user.email}
                          onChange={(e) => updateUser(user.id, 'email', e.target.value)}
                          placeholder="john.doe@example.com"
                          disabled={isSubmitting}
                          className="min-w-[200px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <Input
                          value={user.organization}
                          onChange={(e) => updateUser(user.id, 'organization', e.target.value)}
                          placeholder="Organization (optional)"
                          disabled={isSubmitting}
                          className="min-w-[150px]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Input
                            type="text"
                            value={user.password}
                            onChange={(e) => updateUser(user.id, 'password', e.target.value)}
                            placeholder="Password"
                            disabled={isSubmitting}
                            className="min-w-[150px] font-mono text-sm"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => generatePassword(user.id)}
                            disabled={isSubmitting}
                            title="Generate password"
                          >
                            <UserPlus className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeUserRow(user.id)}
                          disabled={isSubmitting || users.length === 1}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {users.some(u => u.status === 'error') && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Errors occurred:
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
                {users.filter(u => u.status === 'error').map(u => (
                  <li key={u.id}>
                    <strong>{u.email}:</strong> {u.error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>

        {/* Footer Actions */}
        <div className="border-t p-4 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {users.some(u => u.status === 'success') && (
              <Button 
                onClick={exportUsersWithPasswords} 
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="h-4 w-4" />
                Export Credentials
              </Button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || users.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Users...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create {users.length} {users.length === 1 ? 'Student' : 'Students'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
