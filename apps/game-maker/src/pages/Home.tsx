import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { nanoid } from 'nanoid'

export function Home() {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  
  const handleSubmit = () => {
    if (!message.trim()) return
    const chatId = nanoid(10)
    navigate(`/chat/${chatId}`, { state: { message } })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const templates = [
    {
      id: 'nextjs-shadcn',
      title: 'Next.js + shadcn/ui',
      description: 'Next.js + Tailwind CSS + shadcn/UI',
      image: '/templates/nextjs-shadcn.png'
    },
    {
      id: 'nextjs-forms',
      title: 'Next.js + Forms',
      description: 'Server actions and Zod validation.',
      image: '/templates/nextjs-forms.png'
    },
    {
      id: 'nextjs-charts',
      title: 'Next.js + Charts',
      description: 'Build charts using shadcn/ui charts.',
      image: '/templates/nextjs-charts.png'
    }
  ]

  const appTemplates = [
    {
      id: 'chatbot',
      title: 'OpenAI and AI SDK Chatbot',
      description: 'Chatbot built using the AI SDK and gpt-4.',
      image: '/templates/chatbot.png'
    },
    {
      id: 'stripe',
      title: 'Stripe Products and Checkout',
      description: 'Stripe products with checkout flow.',
      image: '/templates/stripe.png'
    },
    {
      id: 'docs',
      title: 'Documentation Starter',
      description: 'A Next.js documentation template.',
      image: '/templates/docs.png'
    }
  ]

  return (
    <motion.div 
      className="min-h-screen bg-[#111] text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 顶部问题区域 */}
      <div className="p-8 pt-32">
        <motion.h1 
          className="text-4xl font-bold mb-16 text-center"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
        >
          What can I help you ship?
        </motion.h1>
        <div className="max-w-2xl mx-auto">
          <motion.div 
            className={`bg-[#1a1a1a] rounded-lg p-4 ${message ? 'ring-1 ring-white/20' : ''}`}
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask vØ a question..."
              className="w-full bg-transparent text-white placeholder-gray-500 resize-none focus:outline-none"
              rows={3}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-800 rounded transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-800 rounded transition-colors">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Project</span>
                <button 
                  onClick={handleSubmit}
                  className={`p-2 rounded transition-colors ${message ? 'bg-white hover:bg-white/90 text-black' : 'hover:bg-gray-800 text-gray-400'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 模板区域 */}
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Starter Templates */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Starter Templates</h2>
              <button className="text-sm text-gray-400 hover:text-white">Request Template</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map(template => (
                <Link
                  key={template.id}
                  to={`/template/${template.id}`}
                  className="block bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-700 transition-all"
                >
                  <div className="aspect-video bg-[#222] flex items-center justify-center">
                    {template.image ? (
                      <img src={template.image} alt={template.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-600">Preview</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{template.title}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* App Templates */}
          <div>
            <h2 className="text-xl font-semibold mb-6">App Templates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {appTemplates.map(template => (
                <Link
                  key={template.id}
                  to={`/template/${template.id}`}
                  className="block bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-gray-700 transition-all"
                >
                  <div className="aspect-video bg-[#222] flex items-center justify-center">
                    {template.image ? (
                      <img src={template.image} alt={template.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-gray-600">Preview</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{template.title}</h3>
                    <p className="text-sm text-gray-400">{template.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 