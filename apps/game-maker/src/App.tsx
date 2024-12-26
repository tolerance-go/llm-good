import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './layouts/Layout'
import { Home } from './pages/Home'
import { GameCreator } from './pages/GameCreator'
import { Chat } from './pages/Chat'
import { ChatList } from './pages/ChatList'
import { ProjectList } from './pages/ProjectList'

const isDev = import.meta.env.MODE === 'development'

function App() {
  return (
    <Router basename={isDev ? '' : '/game-maker'}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat/new" element={<Home />} />
          <Route path="/chats" element={<ChatList />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/project/new" element={<GameCreator />} />
          <Route path="/project/:id" element={<GameCreator />} />
          <Route path="/feedback" element={<div className="p-8 text-white">反馈页面</div>} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
