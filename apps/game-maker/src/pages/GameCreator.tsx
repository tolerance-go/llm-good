import { useState } from 'react'

export function GameCreator() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return
    
    setMessages([...messages, { role: 'user', content: inputMessage }])
    setInputMessage('')
    
    // TODO: 这里添加与AI的交互逻辑
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex gap-4">
      {/* 左侧聊天区域 */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-4 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="描述你想要制作的游戏..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            发送
          </button>
        </div>
      </div>

      {/* 右侧游戏预览区域 */}
      <div className="w-1/2 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-xl font-bold mb-4">游戏预览</h2>
        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">游戏预览区域</p>
        </div>
      </div>
    </div>
  )
} 