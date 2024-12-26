import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
}

interface ChatState {
  messages: Message[]
  isLoading: boolean
  isChatMode: boolean
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isChatMode: false,
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      state.messages.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      })
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    setChatMode: (state, action: PayloadAction<boolean>) => {
      state.isChatMode = action.payload
    },
  },
})

export const { addMessage, setLoading, clearMessages, setChatMode } = chatSlice.actions
export default chatSlice.reducer 