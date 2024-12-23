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
}

const initialState: ChatState = {
  messages: [],
  isLoading: false,
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
  },
})

export const { addMessage, setLoading, clearMessages } = chatSlice.actions
export default chatSlice.reducer 