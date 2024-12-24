import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './layouts/Layout'
import { Home } from './pages/Home'
import { SnakeGame } from './pages/SnakeGame'
import { TetrisGame } from './pages/TetrisGame'

const isDev = import.meta.env.MODE === 'development'

function App() {
  return (
    <Router basename={isDev ? '' : '/game-hub'}>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snake" element={<SnakeGame />} />
          <Route path="/tetris" element={<TetrisGame />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
