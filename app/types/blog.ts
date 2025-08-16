export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  publishDate: string
  readTime: number
  tags: string[]
  featured: boolean
  imageUrl?: string
}

export interface ChatMessage {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export interface ChatbotState {
  isOpen: boolean
  messages: ChatMessage[]
  isTyping: boolean
}