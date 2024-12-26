import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PreviewModal } from '../components/PreviewModal'

interface Message {
  id: string
  content: string
  isUser: boolean
  type?: 'text' | 'game-preview'
  gamePreview?: {
    title: string
    description: string
    image: string
    version: number
  }
}

export function Chat() {
  const location = useLocation()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "你好！我是 AI 助手,我可以帮你:",
      isUser: false
    },
    {
      id: '2',
      content: "1. 创建和调试游戏\n2. 修改游戏配置\n3. 优化游戏体验",
      isUser: false
    },
    {
      id: '3',
      content: '这是一个示例游戏,你可以点击查看详情:',
      isUser: false
    },
    {
      id: '4',
      content: '这是一个示例游戏',
      isUser: false,
      type: 'game-preview',
      gamePreview: {
        title: '贪吃蛇游戏',
        description: '经典的贪吃蛇游戏，使用方向键控制蛇的移动。通过吃食物来增加长度，注意不要撞到墙壁或自己的身体。',
        image: '/games/snake.png',
        version: 1
      }
    },
    {
      id: '5',
      content: '你可以告诉我你想要创建什么样的游戏,或者修改现有游戏的哪些部分。',
      isUser: false
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 如果有初始消息,添加到消息列表
    if (location.state?.message) {
      const initialMessage: Message = {
        id: Date.now().toString(),
        content: location.state.message,
        isUser: true
      }
      setMessages(prev => [...prev, initialMessage])
      
      // 模拟AI回复
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: "我会帮你实现这个想法。请告诉我更多细节。",
          isUser: false
        }
        setMessages(prev => [...prev, aiResponse])
      }, 1000)
    }
  }, [location.state?.message])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ block: 'end' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true
    }

    setMessages(prev => [...prev, newMessage])
    setInputMessage('')

    // 模拟AI回复
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'll help you with that request. Could you please provide more details?",
        isUser: false
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleGamePreviewClick = (messageId: string) => {
    setSelectedGameId(prev => prev === messageId ? null : messageId)
  }

  const selectedGame = messages.find(m => m.id === selectedGameId)?.gamePreview

  return (
    <>
      <div className="h-screen bg-[#111] flex">
        {/* 主要内容区域 */}
        <div className="flex-1">
          {/* 聊天区域 */}
          <div 
            className={`h-full flex flex-col bg-[#111] ${!selectedGame ? 'w-full' : ''}`}
            style={{ 
              width: selectedGame ? '45%' : '100%',
              transition: 'none'
            }}
          >
            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent hover:scrollbar-thumb-[#333333]">
              <div className={`w-full ${!selectedGame ? 'max-w-[800px] mx-auto' : ''}`}>
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`mb-4 ${message.isUser ? 'ml-auto' : 'mr-auto'} max-w-[80%]`}
                    >
                      {message.type === 'game-preview' && message.gamePreview ? (
                        <motion.div
                          className={`bg-[#1a1a1a] rounded-lg overflow-hidden cursor-pointer transition-colors w-[280px] relative
                            ${selectedGameId === message.id ? 'ring-1 ring-blue-500' : 'hover:ring-1 hover:ring-blue-500/50'}`}
                          onClick={() => handleGamePreviewClick(message.id)}
                        >
                          {/* 版本号 */}
                          <div className="absolute top-3 right-3 px-1.5 py-0.5 bg-black/50 rounded text-[10px] text-white font-mono">
                            v{message.gamePreview.version}
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-medium text-white mb-1.5 pr-12">{message.gamePreview.title}</h3>
                            <p className="text-xs text-gray-400 leading-relaxed">{message.gamePreview.description}</p>
                          </div>
                        </motion.div>
                      ) : (
                        <div className={`rounded-lg p-4 ${
                          message.isUser 
                            ? 'bg-blue-600 text-white ml-auto' 
                            : 'bg-[#1a1a1a] text-white'
                        }`}>
                          <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* 输入框区域 */}
            <div className="p-4 bg-[#111]">
              <div className={`flex items-center space-x-2 ${!selectedGame ? 'max-w-[800px] mx-auto' : ''}`}>
                <div className="flex-1">
                  <textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-[#1a1a1a] text-white placeholder-gray-500 p-3 resize-none focus:outline-none rounded-lg"
                    rows={1}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className={`p-3 rounded-lg transition-colors ${
                    inputMessage.trim() 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 游戏预览区域 */}
          <div 
            className="h-full bg-[#1a1a1a] border-l border-[#222] fixed top-0 right-0 overflow-hidden"
            style={{ 
              width: selectedGame ? '55%' : 0,
              transition: 'none'
            }}
          >
            <AnimatePresence mode="wait">
              {selectedGame && (
                <motion.div 
                  className="h-full w-[55vw] absolute top-0 left-0"
                  initial={{ x: '50%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '50%', opacity: 0 }}
                  transition={{ 
                    duration: 0.15,
                    ease: [0, 0, 0.2, 1]
                  }}
                >
                  <div className="h-full flex flex-col">
                    {/* 头部 */}
                    <div className="p-4 border-b border-[#222]">
                      <div className="flex items-center">
                        <h2 className="text-xl font-semibold text-white">{selectedGame.title}</h2>
                      </div>
                      <p className="mt-2 text-sm text-gray-400">{selectedGame.description}</p>
                    </div>

                    {/* 操作按钮 */}
                    <div className="p-4 border-b border-[#222]">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setIsPreviewOpen(true)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          运行
                        </button>
                        <button className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors">
                          编辑
                        </button>
                        <button className="px-4 py-2 bg-[#333] text-white rounded-lg hover:bg-[#444] transition-colors">
                          分享
                        </button>
                      </div>
                    </div>

                    {/* 预览区域 */}
                    <div className="flex-1 p-4 overflow-auto scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent hover:scrollbar-thumb-[#333333]">
                      <div className="aspect-video bg-[#111] rounded-lg overflow-hidden">
                        {selectedGame.image ? (
                          <img src={selectedGame.image} alt={selectedGame.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500">
                            预览加载中...
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 预览浮窗 */}
      <PreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  )
} 