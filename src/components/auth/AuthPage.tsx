import { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { 
  Brain, 
  Sparkles, 
  Target, 
  Award, 
  Zap, 
  Shield, 
  Lightbulb, 
  Rocket,
  Star,
  CheckCircle,
  Users,
  BookOpen,
  Trophy
} from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Branding and info */}
        <div className="text-center lg:text-left space-y-8 animate-slide-in-left">
          <div className="space-y-6">
            <div className="flex items-center justify-center lg:justify-start gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-large">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-2 -right-2 animate-pulse" />
              </div>
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white">
                  AI Education
                </h1>
                <p className="text-white/90 text-lg">Master AI Techniques</p>
              </div>
            </div>
            <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
              Master the art and science of artificial insemination with our comprehensive, interactive learning platform designed by industry experts
            </p>
          </div>

          <div className="hidden lg:block relative">
            <div className="relative">
              <ImageWithFallback
                src="https://farmersreview.co.bw/wp-content/uploads/2021/06/insemination-vache-afrique.jpg"
                alt="Artificial insemination in livestock"
                className="rounded-2xl shadow-large w-full max-w-lg"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Rocket className="h-10 w-10 text-white animate-bounce" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-soft">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Interactive Learning</h3>
                <p className="text-white/80 text-sm">Video lessons and 3D animations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center shadow-soft">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Hands-on Practice</h3>
                <p className="text-white/80 text-sm">Quizzes and real-world assessments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-soft">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Certifications</h3>
                <p className="text-white/80 text-sm">Industry-recognized credentials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex justify-center animate-slide-in-right">
          <div className="w-full max-w-md">
            {isLogin ? (
              <LoginForm onToggleMode={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onToggleMode={() => setIsLogin(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}