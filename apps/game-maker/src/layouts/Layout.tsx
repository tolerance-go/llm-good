import { ReactNode } from 'react'
import { SidebarContainer } from '../containers/SidebarContainer'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#111]">
      <SidebarContainer />

      {/* 主要内容区域 */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 