import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { toast } from 'sonner@2.0.3'
import { 
  Loader2, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles, 
  Brain, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Info
} from 'lucide-react'

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const { login, loading, user } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await login(formData.email, formData.password)
      // Success message will be shown after user data is loaded
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : 'Login failed')
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
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center shadow-soft">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-white/80">
              Sign in to continue your learning journey
            </CardDescription>
          </div>
          <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Demo credentials notice */}
        <div className="p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="h-4 w-4 text-blue-300" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-semibold mb-2">Try the demo:</p>
              <div className="space-y-1 text-xs text-white/80">
                <p>Email: demo@aieducation.com</p>
                <p>Password: demo123</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 text-xs bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  setFormData({
                    email: 'demo@aieducation.com',
                    password: 'demo123'
                  })
                }}
              >
                <Zap className="h-3 w-3 mr-1" />
                Fill Demo Credentials
              </Button>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="text-white font-semibold">Email Address</Label>
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
            <Label htmlFor="password" className="text-white font-semibold">Password</Label>
            <div className="relative">
              <Lock className="absolute left-4 top-4 h-5 w-5 text-white/60" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="pl-12 pr-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20 rounded-xl"
                disabled={loading}
                required
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

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-medium hover-lift rounded-xl font-semibold" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-sm text-white/80">
              <Shield className="h-4 w-4" />
              <span>Don't have an account?</span>
              <button
                type="button"
                onClick={onToggleMode}
                className="text-yellow-300 hover:text-yellow-200 font-semibold hover:underline transition-colors"
              >
                Sign up
              </button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}