'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, User, Bot } from 'lucide-react'
import { ChatMessage, ChatbotState } from '../types/blog'

export default function ChatBot() {
  const [chatState, setChatState] = useState<ChatbotState>({
    isOpen: false,
    messages: [
      {
        id: '1',
        content: "Hello! 👋 I'm John's AI assistant. I can help you learn about his architectural projects, sustainable design philosophy, services, and more. What would you like to know?",
        sender: 'bot',
        timestamp: new Date()
      }
    ],
    isTyping: false
  })
  
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatState.messages])

  const toggleChat = () => {
    setChatState(prev => ({ ...prev, isOpen: !prev.isOpen }))
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isTyping: true
    }))

    setInputMessage('')

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateResponse(inputMessage)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      }

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false
      }))
    }, 1500)
  }

  const generateResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()
    
    // Greeting responses
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      return "Hello! 👋 I'm here to help you learn more about John's architectural work. What would you like to know about - his projects, experience, design philosophy, or something else?"
    }
    
    // Portfolio and projects
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('project')) {
      return "John has completed over 50 diverse projects! 🏗️ His portfolio includes sustainable office complexes, luxury residential designs, urban planning initiatives, and cultural spaces. Each project demonstrates his commitment to innovative, environmentally conscious architecture. Check out the Portfolio section to see featured work!"
    }
    
    // Experience and background
    if (lowerMessage.includes('experience') || lowerMessage.includes('background') || lowerMessage.includes('career')) {
      return "John brings 15+ years of architectural expertise to every project. 🏆 He's a Senior Principal Architect who specializes in sustainable design and urban planning. His career highlights include leading multidisciplinary teams, winning industry awards, and pioneering green building practices."
    }
    
    // Sustainability focus
    if (lowerMessage.includes('sustainable') || lowerMessage.includes('green') || lowerMessage.includes('environment')) {
      return "Sustainability isn't just a trend for John—it's fundamental to his design philosophy! 🌱 He integrates energy-efficient systems, renewable materials, passive solar design, and biophilic elements. Every project aims to minimize environmental impact while maximizing human comfort and well-being."
    }
    
    // Services and specialties
    if (lowerMessage.includes('service') || lowerMessage.includes('specialize') || lowerMessage.includes('expertise')) {
      return "John offers comprehensive architectural services including: 📐 Concept design & planning, sustainable building design, urban planning & masterplanning, 3D visualization & modeling, project management, and green building certification. He excels in both residential and commercial projects."
    }
    
    // Contact and hiring
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('consultation')) {
      return "Ready to start your project? 📞 You can reach John through the Contact section below, email john@architect.com, or schedule a consultation. He offers free initial consultations to discuss your vision and how he can bring it to life!"
    }
    
    // Blog and insights
    if (lowerMessage.includes('blog') || lowerMessage.includes('article') || lowerMessage.includes('writing')) {
      return "John shares his architectural insights through regular blog posts! 📝 His recent articles cover sustainable architecture trends, modern minimalism, and smart city planning. The Blog section features in-depth discussions on design philosophy and industry innovations."
    }
    
    // Awards and recognition
    if (lowerMessage.includes('award') || lowerMessage.includes('recognition') || lowerMessage.includes('achievement')) {
      return "John's work has earned significant recognition! 🏅 He's received 15+ industry awards including sustainability excellence awards, design innovation honors, and community impact recognition. His projects have been featured in leading architectural publications."
    }
    
    // Technology and tools
    if (lowerMessage.includes('technology') || lowerMessage.includes('software') || lowerMessage.includes('tool')) {
      return "John leverages cutting-edge technology in his practice! 💻 He uses advanced BIM modeling, 3D visualization software, sustainable design tools, and VR/AR for client presentations. This tech-forward approach ensures precision and helps clients visualize their future spaces."
    }
    
    // Education and learning
    if (lowerMessage.includes('education') || lowerMessage.includes('school') || lowerMessage.includes('degree')) {
      return "John's educational foundation is strong! 🎓 He holds advanced degrees in Architecture and Urban Planning, maintains professional certifications, and continuously updates his knowledge through industry conferences and sustainable design courses."
    }
    
    // Pricing and budget
    if (lowerMessage.includes('cost') || lowerMessage.includes('price') || lowerMessage.includes('budget') || lowerMessage.includes('fee')) {
      return "Project costs vary based on scope, complexity, and timeline. 💰 John offers transparent pricing and works with various budgets. He provides detailed proposals after understanding your specific needs. Contact him for a personalized quote and to discuss financing options that work for you."
    }
    
    // Thank you responses
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're very welcome! 😊 I'm glad I could help. Feel free to ask anything else about John's work, or reach out directly through the contact form below. Looking forward to potentially working with you!"
    }
    
    // Default response with helpful suggestions
    return "I'd be happy to help you learn more about John's architectural practice! 🏗️ Feel free to ask about:\n• Portfolio projects and case studies\n• Sustainable design approach\n• Services and specialties\n• Awards and recognition\n• Contact information for consultations\n\nWhat interests you most?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-architect-800 text-white rounded-full shadow-lg hover:bg-architect-700 transition-colors z-50 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {chatState.isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {chatState.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl z-40 flex flex-col border border-architect-200"
          >
            {/* Header */}
            <div className="bg-architect-800 text-white p-4 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-gold rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Assistant</h3>
                  <p className="text-xs opacity-90">Ask me about John's work</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatState.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-architect-800 text-white'
                        : 'bg-architect-100 text-architect-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === 'bot' && (
                        <Bot className="w-4 h-4 mt-0.5 text-architect-600" />
                      )}
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 text-white" />
                      )}
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {chatState.isTyping && (
                <div className="flex justify-start">
                  <div className="bg-architect-100 text-architect-900 p-3 rounded-lg max-w-[70%]">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-architect-600" />
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-architect-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-architect-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-architect-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-architect-200 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-architect-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-architect-500 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-3 py-2 bg-architect-800 text-white rounded-lg hover:bg-architect-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}