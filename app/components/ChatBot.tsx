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
        content: "Hello! I'm John's AI assistant. I can help answer questions about architecture, projects, or anything else you'd like to know!",
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
    
    if (lowerMessage.includes('portfolio') || lowerMessage.includes('project')) {
      return "John has worked on over 50 projects including sustainable office complexes, minimalist residential designs, and smart city planning initiatives. You can view highlights in the Portfolio section above!"
    }
    
    if (lowerMessage.includes('experience') || lowerMessage.includes('background')) {
      return "John is a Senior Architect with 15+ years of experience specializing in sustainable design and urban planning. He's won multiple awards and leads a team of innovative designers."
    }
    
    if (lowerMessage.includes('sustainable') || lowerMessage.includes('green')) {
      return "Sustainability is at the core of John's design philosophy. He focuses on energy-efficient buildings, renewable materials, and designs that harmonize with natural environments."
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire')) {
      return "You can reach John through the Contact section below, or email directly at john@architect.com. He'd love to discuss your project!"
    }
    
    if (lowerMessage.includes('blog') || lowerMessage.includes('article')) {
      return "John regularly writes about architecture trends, sustainability, and design philosophy. Check out the Blog section for his latest insights!"
    }
    
    return "That's a great question! John specializes in sustainable architecture and urban planning. Feel free to ask about his projects, experience, or design philosophy. You can also contact him directly for project inquiries."
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