import { Link } from 'react-router-dom'
import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="flex items-center py-4">
                <Link to="/" className="text-xl font-bold">游戏中心</Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link to="/snake" className="py-4 px-2 hover:text-green-500">贪吃蛇</Link>
                <Link to="/tetris" className="py-4 px-2 hover:text-blue-500">俄罗斯方块</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
} 