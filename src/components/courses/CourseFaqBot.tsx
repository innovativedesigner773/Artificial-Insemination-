import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { ScrollArea } from '../ui/scroll-area'
import { 
  Bot, 
  Send, 
  MessageCircle, 
  BookOpen, 
  Brain, 
  Lightbulb, 
  HelpCircle,
  X,
  Minimize2,
  Maximize2
} from 'lucide-react'
import { getDummyCourses } from '../../utils/dummyData'
import type { Course } from '../../types'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  suggestions?: string[]
}

interface CourseFaqBotProps {
  isOpen: boolean
  onToggle: () => void
}

export function CourseFaqBot({ isOpen, onToggle }: CourseFaqBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI course assistant. I can help you with questions about artificial insemination courses, procedures, anatomy, and more. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        "What is artificial insemination?",
        "Tell me about the course modules",
        "What are the success factors?",
        "Explain the AI procedures"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const courses = getDummyCourses()

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    // Course overview questions
    if (message.includes('course') || message.includes('module') || message.includes('lesson')) {
      return `Our courses cover comprehensive artificial insemination training:

📚 **Artificial Insemination Basics (8 hours)**
• Reproductive Anatomy - Female & Male systems
• AI Procedures - Preparation, hygiene, techniques
• AI Fundamentals - Types and success factors
• Applications - Agriculture, medicine, ethics

📚 **Advanced AI & Farm Management (10 hours)**
• Troubleshooting common issues
• Advanced farm management strategies

Each course includes video lessons, interactive content, and assessment quizzes. Would you like to know more about any specific module?`
    }

    // What is AI questions
    if (message.includes('what is artificial insemination') || message.includes('define ai') || message.includes('definition')) {
      return `Artificial Insemination (AI) is a reproductive technology where sperm is collected, processed, and manually introduced into the female reproductive tract to achieve fertilization without natural mating.

🔬 **Key Components:**
• Sperm collection and processing
• Female preparation and timing
• Insemination procedure
• Follow-up and monitoring

It's widely used in agriculture for genetic improvement and in human medicine for fertility treatments. The success depends on proper timing, technique, and quality of materials used.`
    }

    // Anatomy questions
    if (message.includes('anatomy') || message.includes('reproductive system') || message.includes('female') || message.includes('male')) {
      return `**Reproductive Anatomy for AI:**

👩 **Female Reproductive System:**
• Ovaries - produce eggs and hormones
• Oviducts (fallopian tubes) - where fertilization occurs
• Uterus - where embryo develops
• Cervix - gateway to uterus
• Vagina - birth canal

👨 **Male Reproductive System:**
• Testes - produce sperm
• Epididymis - sperm maturation
• Ducts - transport sperm
• Accessory glands - produce seminal fluid

Understanding this anatomy is crucial for successful AI procedures and timing.`
    }

    // Procedure questions
    if (message.includes('procedure') || message.includes('process') || message.includes('step') || message.includes('how to')) {
      return `**The AI Process - 5 Key Phases:**

🔬 **Phase 1 - Semen Collection:**
• Artificial vagina method
• Electroejaculation
• Quality assessment (volume, concentration, motility)

🧊 **Phase 2 - Semen Processing:**
• Evaluation and dilution
• Cooling and cryoprotectants
• Packaging in straws
• Freezing in liquid nitrogen (-196°C)

👩 **Phase 3 - Female Preparation:**
• Estrus synchronization
• Health screening
• Nutrition optimization

💉 **Phase 4 - Insemination:**
• Thawing semen
• Loading devices
• Insertion and deposition
• Documentation

📊 **Phase 5 - Follow-up:**
• Pregnancy detection
• Record keeping
• Health monitoring`
    }

    // Success factors
    if (message.includes('success') || message.includes('factor') || message.includes('timing') || message.includes('quality')) {
      return `**Critical Success Factors for AI:**

⏰ **Timing:**
• Accurate estrus detection
• Precise ovulation timing
• Optimal sperm viability window

🧬 **Semen Quality:**
• High motility (movement)
• Good morphology (shape)
• Adequate concentration
• Proper storage and handling

👨‍⚕️ **Technique:**
• Practitioner skill level
• Proper equipment use
• Sterile procedures
• Correct deposition site

🌡️ **Environment:**
• Temperature control
• Hygiene standards
• Stress reduction
• Nutrition status

These factors work together to maximize AI success rates.`
    }

    // Applications
    if (message.includes('application') || message.includes('agriculture') || message.includes('medicine') || message.includes('benefit')) {
      return `**AI Applications & Benefits:**

🐄 **Agriculture:**
• Genetic improvement - one bull can sire thousands
• Disease control and biosecurity
• Cost efficiency and logistics
• Rapid genetic progress
• Geographic flexibility

🏥 **Human Medicine:**
• Fertility treatments
• Male factor infertility solutions
• Family planning options
• Genetic screening
• Sperm banking

📈 **Economic Benefits:**
• Reduced breeding costs
• Improved genetics
• Disease prevention
• Record keeping
• Market access

⚖️ **Considerations:**
• Equipment and facility needs
• Skill requirements
• Timing precision
• Genetic diversity concerns`
    }

    // Ethics and future
    if (message.includes('ethic') || message.includes('future') || message.includes('limitation') || message.includes('challenge')) {
      return `**Ethics, Limitations & Future:**

⚖️ **Ethical Considerations:**
• Animal welfare and stress
• Genetic diversity preservation
• Human consent and rights
• Access and equity
• Cultural perspectives

⚠️ **Current Limitations:**
• Semen quality variability
• Equipment requirements
• Precise timing needs
• Species differences
• Cost considerations

🚀 **Future Developments:**
• Improved processing techniques
• Enhanced freezing methods
• Automation and AI integration
• Genetic marker selection
• Sexed semen technology
• Stem cell applications
• Cloning integration`
    }

    // Help and general
    if (message.includes('help') || message.includes('question') || message.includes('confused')) {
      return `I'm here to help! I can answer questions about:

📚 **Course Content:**
• Module details and lessons
• Video topics and duration
• Quiz information and assessments

🧬 **Technical Topics:**
• Reproductive anatomy
• AI procedures and techniques
• Success factors and timing
• Equipment and preparation

🌍 **Applications:**
• Agricultural uses
• Medical applications
• Benefits and limitations
• Ethics and future

Just ask me anything about artificial insemination!`
    }

    // Default response
    return `I understand you're asking about "${userMessage}". I can help with questions about:

• Course modules and content
• Reproductive anatomy
• AI procedures and techniques
• Success factors and timing
• Applications in agriculture and medicine
• Ethics and future developments

Could you be more specific about what you'd like to know? I'm here to help explain any aspect of artificial insemination!`
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    }

    const botResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(inputValue),
      isBot: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, botResponse])
    setInputValue('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
    </Button>
  )
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] shadow-2xl z-50 transition-all duration-300 overflow-hidden ${
      isMinimized ? 'h-16' : ''
    }`}>
      <CardHeader className="bg-green-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <CardTitle className="text-lg">Course Assistant</CardTitle>
                </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-white hover:bg-green-700"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="text-white hover:bg-green-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          <CardContent className="p-0 flex flex-col h-[520px] overflow-hidden">
            <ScrollArea className="flex-1 p-4 overflow-hidden">
              <div className="space-y-4 w-full">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex w-full ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg break-words overflow-hidden w-fit ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-green-600 text-white'
                      }`}
                    >
                      <div className="flex items-start gap-2 w-full">
                        {message.isBot && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere hyphens-auto w-full">
                            {message.text}
                          </p>
                          {message.suggestions && (
                            <div className="mt-2 flex flex-wrap gap-1 w-full">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                  className="text-xs h-auto px-2 py-1 mb-1 break-words max-w-[140px] text-left flex-shrink-0"
                                >
                                  <span className="break-words">{suggestion}</span>
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-white">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about AI courses, procedures, anatomy..."
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="bg-green-600 hover:bg-green-700 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </>
      )}
    </Card>
  )
}