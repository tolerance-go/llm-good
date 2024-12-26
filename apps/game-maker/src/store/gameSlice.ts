import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface GameState {
  currentVersion: number
  games: {
    [key: string]: {
      version: number
      title: string
      description: string
      image: string
    }
  }
  ui: {
    newFeatureVisible: boolean
    newFeature: {
      title: string
      description: string
    }
  }
}

const initialState: GameState = {
  currentVersion: 0,
  games: {},
  ui: {
    newFeatureVisible: true,
    newFeature: {
      title: "新功能：AI 游戏生成器",
      description: "使用 AI 快速创建和定制你的游戏，让游戏开发变得更简单。"
    }
  }
}

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    incrementVersion: (state, action: PayloadAction<string>) => {
      const gameId = action.payload
      if (state.games[gameId]) {
        state.games[gameId].version += 1
      }
    },
    addGame: (state, action: PayloadAction<{
      id: string
      title: string
      description: string
      image: string
    }>) => {
      const { id, ...game } = action.payload
      state.games[id] = {
        ...game,
        version: 0
      }
    },
    updateGame: (state, action: PayloadAction<{
      id: string
      title?: string
      description?: string
      image?: string
    }>) => {
      const { id, ...updates } = action.payload
      if (state.games[id]) {
        state.games[id] = {
          ...state.games[id],
          ...updates,
          version: state.games[id].version + 1
        }
      }
    },
    dismissNewFeature: (state) => {
      state.ui.newFeatureVisible = false
    },
    setNewFeature: (state, action: PayloadAction<{
      title: string
      description: string
    }>) => {
      state.ui.newFeature = action.payload
      state.ui.newFeatureVisible = true
    }
  }
})

export const { 
  incrementVersion, 
  addGame, 
  updateGame,
  dismissNewFeature,
  setNewFeature 
} = gameSlice.actions

export default gameSlice.reducer 