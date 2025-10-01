import { useState } from 'react'
import heroLocal from '../../assets/hero-image.jpg'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { 
  Brain, 
  Sparkles, 
  Target, 
  Rocket,
  BookOpen,
  Trophy,
  Check,
  Building2,
  Users,
  Zap,
  Crown,
  ArrowRight,
  Shield,
  Award,
  TrendingUp,
  Clock,
  Headphones,
  BarChart3
} from 'lucide-react'

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePlanSelection = (planName: string) => {
    setSelectedPlan(planName)
    setShowAuthModal(true)
    setIsLogin(false) // Default to register for new customers
    
    // Scroll to top to show the registration form
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className="min-h-screen animated-gradient">
      <div className="flex items-center justify-center p-4 py-12">
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

          <div className="block relative">
            <div className="relative">
              <ImageWithFallback
                src={heroLocal}
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

          {/* Right side - Auth forms or CTA */}
        <div className="flex justify-center animate-slide-in-right">
          <div className="w-full max-w-md">
              {showAuthModal ? (
                isLogin ? (
                  <LoginForm 
                    onToggleMode={() => setIsLogin(false)} 
                    selectedPlan={selectedPlan}
                    onChangePlan={() => {
                      setSelectedPlan(null)
                      setShowAuthModal(false)
                    }}
                  />
                ) : (
                  <RegisterForm 
                    onToggleMode={() => setIsLogin(true)}
                    selectedPlan={selectedPlan}
                    onChangePlan={() => {
                      setSelectedPlan(null)
                      setShowAuthModal(false)
                    }}
                  />
                )
              ) : (
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 space-y-6">
                  <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/10 to-blue-500/10 rounded-full border border-teal-500/20">
                      <Sparkles className="h-4 w-4 text-teal-600" />
                      <span className="text-sm font-semibold text-teal-700">Get Started Today</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Transform Your Team
                    </h2>
                    <p className="text-gray-600">
                      Join leading organizations using AI Education to train their workforce
                    </p>
                  </div>

                  {/* Primary CTAs */}
                  <div className="space-y-3">
                    <a 
                      href="#pricing"
                      className="w-full py-4 px-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg group"
                    >
                      <Rocket className="h-5 w-5" />
                      View Pricing Plans
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                    
                    <button 
                      onClick={() => {
                        setShowAuthModal(true)
                        setIsLogin(false)
                      }}
                      className="w-full py-4 px-6 bg-white border-2 border-teal-600 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition-all flex items-center justify-center gap-2 group"
                    >
                      <Users className="h-5 w-5" />
                      Get Started Now
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500 font-medium">Already have an account?</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setShowAuthModal(true)
                      setIsLogin(true)
                    }}
                    className="w-full py-3 px-6 text-gray-700 font-medium hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
                  >
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  {/* Trust Badges */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-teal-600">10K+</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">95%</div>
                        <div className="text-xs text-gray-600">Success Rate</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-green-600">24/7</div>
                        <div className="text-xs text-gray-600">Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-20 px-4 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-teal-500/30">
              <Award className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Industry-Leading AI Education Platform
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              We combine cutting-edge technology with expert knowledge to deliver unmatched learning experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-teal-100">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert-Designed Curriculum</h3>
              <p className="text-gray-600 leading-relaxed">
                Courses created by industry professionals with decades of hands-on experience in artificial insemination techniques.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Proven Results</h3>
              <p className="text-gray-600 leading-relaxed">
                95% of our students achieve certification on their first attempt. Track improvement with real-time analytics and progress reports.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Advanced Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor employee progress with detailed dashboards, completion rates, and skill assessments for data-driven decisions.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-teal-100">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Learn at Your Pace</h3>
              <p className="text-gray-600 leading-relaxed">
                Flexible learning schedules that fit your team's workflow. Access content 24/7 from any device, anywhere.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-blue-100">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Enterprise-Grade Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-level encryption and data protection. GDPR compliant with SOC 2 Type II certification for your peace of mind.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-green-100">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <Headphones className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dedicated Support</h3>
              <p className="text-gray-600 leading-relaxed">
                24/7 customer support with dedicated account managers. Get help when you need it with priority response times.
              </p>
            </div>
          </div>

          {/* CTA Button in Why Choose Us */}
          <div className="mt-16 text-center">
            <a 
              href="#pricing"
              className="inline-flex items-center gap-3 py-4 px-8 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg group"
            >
              <Rocket className="h-5 w-5" />
              View Our Plans
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="mt-4 text-gray-600">Choose the perfect plan for your organization</p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 px-4 bg-gradient-to-br from-teal-50 via-green-50 to-blue-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          {/* Pricing Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-teal-500/30">
              <Building2 className="h-5 w-5 text-teal-600" />
              <span className="text-sm font-semibold text-teal-700">Business Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Invest in Your Team's Excellence
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Empower your workforce with industry-leading AI education. Choose the plan that scales with your business needs.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6">
            {/* Starter Plan */}
            <div className="relative bg-white/80 backdrop-blur-sm border-2 border-teal-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-teal-300">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-6 w-6 text-teal-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                  </div>
                  <p className="text-gray-600">Perfect for small teams starting their journey</p>
                </div>
                
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">R4,999</span>
                  <span className="text-gray-600 mb-2">/month</span>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Up to 25 active users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Access to all core courses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Interactive video lessons & 3D animations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Quiz assessments & progress tracking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Industry-recognized certificates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Email support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Monthly analytics reports</span>
                  </li>
                </ul>

                <button 
                  onClick={() => handlePlanSelection('Starter')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-blue-700 transition-colors flex items-center justify-center gap-2 group"
                >
                  Select Starter Plan
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Professional Plan - Featured */}
            <div className="relative bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 border-4 border-yellow-400">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Crown className="h-4 w-4" />
                  MOST POPULAR
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-6 w-6 text-yellow-300" />
                    <h3 className="text-2xl font-bold text-white">Professional</h3>
                  </div>
                  <p className="text-white/90">Ideal for growing businesses</p>
                </div>
                
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold text-white">R14,999</span>
                  <span className="text-white/90 mb-2">/month</span>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">Up to 100 active users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">Everything in Starter, plus:</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">Custom course creation & management</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">Advanced analytics & insights</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">AI-powered FAQ chatbot</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">Priority email & phone support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">Dedicated account manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                    <span className="text-white">Branded certificates</span>
                  </li>
                </ul>

                <button 
                  onClick={() => handlePlanSelection('Professional')}
                  className="w-full py-3 px-6 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 group"
                >
                  Select Professional Plan
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="relative bg-white/80 backdrop-blur-sm border-2 border-blue-200 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:border-blue-300">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-6 w-6 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
                  </div>
                  <p className="text-gray-600">For large organizations with complex needs</p>
                </div>
                
                <div className="flex items-end gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Custom</span>
                </div>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Everything in Professional, plus:</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">White-label platform options</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">API access & integrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">Custom features development</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">24/7 premium support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">On-premise deployment option</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">SLA guarantees</span>
                  </li>
                </ul>

                <button 
                  onClick={() => handlePlanSelection('Enterprise')}
                  className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-colors flex items-center justify-center gap-2 group"
                >
                  Select Enterprise Plan
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="text-gray-700 mb-6 font-medium">Trusted by leading organizations in the agricultural industry</p>
            <div className="flex flex-wrap justify-center gap-8 items-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-green-600 bg-clip-text text-transparent">🐄 AgriTech Leaders</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">🌾 Farm Innovations</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">🔬 Research Centers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}