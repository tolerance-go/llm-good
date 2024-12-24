import { useDispatch, useSelector } from 'react-redux'
import { ChatBox } from '../components/ChatBox'
import { RootState } from '../store'
import { addMessage, clearMessages, setLoading } from '../store/chatSlice.ts'

export function ChatBoxContainer() {
  const dispatch = useDispatch()
  const { messages, isLoading } = useSelector((state: RootState) => state.chat)

  const handleSendMessage = async (content: string) => {
    // 添加用户消息
    dispatch(addMessage({ content, role: 'user' }))
    
    // 设置加载状态
    dispatch(setLoading(true))

    try {
      // 这里可以添加实际的 AI 响应逻辑
      // 模拟 AI 响应
      await new Promise(resolve => setTimeout(resolve, 1000))
      dispatch(
        addMessage({
          content: `我收到了你的消息：${content}`,
          role: 'assistant',
        })
      )
    } finally {
      dispatch(setLoading(false))
    }
  }

  const handleClear = () => {
    dispatch(clearMessages())
  }

  return (
    <ChatBox
      messages={messages}
      isLoading={isLoading}
      onSendMessage={handleSendMessage}
      onClear={handleClear}
    />
  )
} 