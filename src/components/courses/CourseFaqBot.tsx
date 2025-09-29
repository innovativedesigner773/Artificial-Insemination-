import { useState } from 'react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { MessageCircle, HelpCircle, Send } from 'lucide-react'
import type { Course } from '../../types'

interface CourseFaqBotProps {
  course: Course
  triggerVariant?: 'button' | 'link'
}

export function CourseFaqBot({ course, triggerVariant = 'button' }: CourseFaqBotProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: `Hi! I can help with questions about ${course.title}. Try asking about prerequisites, modules, lessons, or quizzes.` }
  ])

  const faqs = [
    { q: 'What are the prerequisites?', a: 'Basic understanding of animal husbandry and interest in reproductive technologies.' },
    { q: 'How many modules and lessons are there?', a: `${course.modules.length} modules and ${course.modules.reduce((s, m) => s + m.lessons.length, 0)} lessons.` },
    { q: 'Are there quizzes?', a: 'Yes, each module ends with a short quiz to assess your understanding.' },
    { q: 'How long is the course?', a: `${course.duration} hours in total (approx.).` },
  ]

  const handleSend = () => {
    if (!query.trim()) return
    const userMsg = { role: 'user' as const, text: query.trim() }
    setMessages(prev => [...prev, userMsg])

    // Simple FAQ match simulator
    const lower = query.toLowerCase()
    const match = faqs.find(f => lower.includes('prereq') ? f.q.includes('prerequisites')
      : lower.includes('module') || lower.includes('lesson') ? f.q.includes('How many modules and lessons')
      : lower.includes('quiz') ? f.q.includes('quizzes')
      : lower.includes('long') || lower.includes('duration') ? f.q.includes('How long')
      : false)
    const botText = match ? match.a : 'I could not find an exact match. Try asking about prerequisites, modules, lessons, quizzes, or duration.'
    const botMsg = { role: 'bot' as const, text: botText }
    setMessages(prev => [...prev, botMsg])
    setQuery('')
  }

  const Trigger = (
    <Button variant={triggerVariant === 'link' ? 'ghost' : 'outline'} size="sm" className={triggerVariant === 'link' ? 'p-0 h-auto text-green-700' : ''}>
      <MessageCircle className="h-4 w-4 mr-2" /> FAQs & Help
    </Button>
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {Trigger}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-green-600" /> Course FAQs
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex flex-col h-[85vh]">
          <Card className="flex-1 overflow-y-auto">
            <CardContent className="p-4 space-y-3">
              {messages.map((m, idx) => (
                <div key={idx} className={`p-2 rounded ${m.role === 'bot' ? 'bg-green-50 text-green-900' : 'bg-blue-50 text-blue-900'}`}>
                  {m.text}
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="mt-3 flex gap-2">
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask a question..." onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
            <Button onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-3 text-xs text-gray-500">This is a demo FAQ bot with canned answers.</div>
        </div>
      </SheetContent>
    </Sheet>
  )
}


