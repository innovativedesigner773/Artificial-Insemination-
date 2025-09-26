import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { toast } from 'sonner'
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  UserPlus, 
  Sparkles, 
  Brain, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Target,
  Award
} from 'lucide-react'

interface RegisterFormProps {
  onToggleMode: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const { register, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    organization: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error('Please fill in all required fields')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        organization: formData.organization,
      })
      toast.success('Account created successfully!')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(error instanceof Error ? error.message : 'Registration failed')
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Card className="w-full max-w-md mx-auto glass border-0 shadow-large backdrop-blur-xl bg-white/10">
      <CardHeader className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-soft">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
            <CardDescription className="text-white/80">
              Join our AI education platform
            </CardDescription>
          </div>
          <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="firstName" className="text-white font-semibold">First Name *</Label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label htmlFor="lastName" className="text-white font-semibold">Last Name *</Label>
              <div className="relative">
                <User className="absolute left-4 top-4 h-5 w-5 text-white/60" />
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="email" className="text-white font-semibold">Email Address *</Label>
            <div className="relative">
              <Mail className="absolute left-4 top-4 h-5 w-5 text-white/60" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="organization" className="text-white font-semibold">Organization</Label>
            <div className="relative">
              <Building className="absolute left-4 top-4 h-5 w-5 text-white/60" />
              <Input
                id="organization"
                type="text"
                placeholder="Your farm or organization"
                value={formData.organization}
                onChange={(e) => handleChange('organization', e.target.value)}
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="password" className="text-white font-semibold">Password *</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-white/60" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl"
                disabled={loading}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-white font-semibold">Confirm Password *</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-white/60" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl"
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4 text-white/60 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-medium hover-lift rounded-xl font-semibold" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-white/80">
              <Award className="h-4 w-4" />
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={onToggleMode}
                className="text-yellow-300 hover:text-yellow-200 font-semibold hover:underline transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}