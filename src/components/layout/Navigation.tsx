import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { 
  Home, 
  BookOpen, 
  User, 
  LogOut, 
  Settings, 
  Trophy,
  Menu,
  X,
  Brain,
  Sparkles,
  Bell,
  Search,
  ChevronDown,
  Award,
  Target,
  Zap
} from 'lucide-react'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'text-blue-500' },
    { id: 'courses', label: 'Courses', icon: BookOpen, color: 'text-green-500' },
    { id: 'certificates', label: 'Certificates', icon: Trophy, color: 'text-yellow-500' },
  ]

  const getUserInitials = () => {
    if (!user) return 'U'
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  }

  const handleLogout = () => {
    logout()
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="gradient-primary border-b border-white/20 px-4 py-3 shadow-medium">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-soft hover-lift">
                <Brain className="h-6 w-6 text-white" />
                <Sparkles className="h-3 w-3 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-white">AI Education</span>
              <div className="flex items-center gap-1 text-white/80 text-sm">
                <Target className="h-3 w-3" />
                <span>Master AI Techniques</span>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'secondary' : 'ghost'}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 hover-lift ${
                  currentPage === item.id 
                    ? 'bg-white/20 text-white shadow-soft backdrop-blur-sm' 
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${currentPage === item.id ? item.color : 'text-white'}`} />
                {item.label}
                {currentPage === item.id && <Zap className="h-3 w-3 text-yellow-300 animate-pulse" />}
              </Button>
            )
          })}
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {/* Search and Notifications */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white">
              <Search className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white relative">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </Button>
          </div>

          {/* Desktop User Menu */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-12 text-white hover:bg-white/10 rounded-xl px-3 hover-lift">
                  <Avatar className="h-8 w-8 ring-2 ring-white/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-white/20 text-white font-semibold">{getUserInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-white/70">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-white/60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 shadow-large border-0 bg-white/95 backdrop-blur-sm">
                <DropdownMenuLabel className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 ring-2 ring-green-500/20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-green-100 text-green-700 font-semibold">{getUserInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <Badge variant="secondary" className="w-fit bg-green-100 text-green-700 border-green-200">
                        <Award className="h-3 w-3 mr-1" />
                        {user?.role}
                      </Badge>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem onClick={() => onNavigate('profile')} className="px-4 py-3 hover:bg-green-50">
                  <User className="mr-3 h-4 w-4 text-green-600" />
                  <span className="font-medium">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="px-4 py-3 hover:bg-green-50">
                  <Settings className="mr-3 h-4 w-4 text-green-600" />
                  <span className="font-medium">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem onClick={handleLogout} className="px-4 py-3 hover:bg-red-50 text-red-600">
                  <LogOut className="mr-3 h-4 w-4" />
                  <span className="font-medium">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 border-t border-white/20 pt-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'secondary' : 'ghost'}
                  onClick={() => {
                    onNavigate(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full justify-start gap-2 ${
                    currentPage === item.id 
                      ? 'bg-secondary-green text-white hover:bg-secondary-green/90' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
            
            <div className="pt-4 border-t border-white/20">
              <div className="flex items-center gap-3 p-2 mb-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-300">{user?.email}</p>
                  <Badge variant="secondary" className="w-fit text-xs bg-secondary-green text-white">
                    {user?.role}
                  </Badge>
                </div>
              </div>
              
              <Button
                variant="ghost"
                onClick={() => {
                  onNavigate('profile')
                  setIsMobileMenuOpen(false)
                }}
                className="w-full justify-start gap-2 text-white hover:bg-white/10"
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-white hover:bg-white/10"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}