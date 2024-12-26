import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

interface ChatItem {
  id: string
  title: string
  description: string
  timestamp: string
  updatedBy: string
}

export function ChatList() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [chats, setChats] = useState<ChatItem[]>([
    {
      id: '1',
      title: 'V0.dev clone',
      description: '生成一个和 v0.dev 差不多的页面',
      timestamp: '24分钟前',
      updatedBy: 'tolerance-go'
    },
    {
      id: '2',
      title: 'Next.js + shadcn/ui',
      description: 'Next.js + shadcn/ui',
      timestamp: '1小时前',
      updatedBy: 'tolerance-go'
    },
    {
      id: '3',
      title: 'Tofu in french',
      description: '豆腐千岁的法国',
      timestamp: '2小时前',
      updatedBy: 'tolerance-go'
    }
  ])

  useEffect(() => {
    // 如果有初始消息,创建新的聊天并跳转
    if (location.state?.message) {
      const chatId = Date.now().toString()
      const newChat: ChatItem = {
        id: chatId,
        title: location.state.message.slice(0, 30) + (location.state.message.length > 30 ? '...' : ''),
        description: location.state.message,
        timestamp: '刚刚',
        updatedBy: 'tolerance-go'
      }
      setChats(prev => [newChat, ...prev])
      // 跳转到新聊天
      navigate(`/chat/${chatId}`, { state: { message: location.state.message } })
    }
  }, [location.state?.message, navigate])

  const filteredChats = chats.filter(chat => 
    chat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="h-screen flex flex-col">
      <PageHeader
        title="Chats"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search for a chat..."
      />

      {/* 聊天列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map(chat => (
          <div
            key={chat.id}
            onClick={() => navigate(`/chat/${chat.id}`)}
            className="p-4 border-b border-[#222] hover:bg-[#222] cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-medium">{chat.title}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{chat.timestamp}</span>
                <button className="text-gray-500 hover:text-white">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-400">{chat.description}</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
              <span className="text-xs text-gray-500">{chat.updatedBy}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 