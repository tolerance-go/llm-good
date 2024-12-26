import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/PageHeader'

interface ProjectItem {
  id: string
  title: string
  chatCount: number
  updatedBy: string
  timestamp: string
}

export function ProjectList() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  // 模拟数据
  const projects: ProjectItem[] = [
    {
      id: '1',
      title: 'Next.js + shadcn/ui',
      chatCount: 1,
      updatedBy: 'tolerance-go',
      timestamp: '1小时前'
    },
    {
      id: '2',
      title: 'test',
      chatCount: 1,
      updatedBy: 'tolerance-go',
      timestamp: '15分钟前'
    }
  ]

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#111]">
      <PageHeader
        title="Projects"
        action={
          <button
            onClick={() => navigate('/project/new')}
            className="px-3 py-1 bg-white text-black text-sm font-medium rounded-md hover:bg-white/90 transition-colors"
          >
            New Project
          </button>
        }
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search for a project..."
      />

      {/* 项目卡片网格 */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProjects.map(project => (
            <div
              key={project.id}
              onClick={() => navigate(`/project/${project.id}`)}
              className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#222] cursor-pointer border border-[#333] transition-colors"
            >
              <div className="flex items-center space-x-3 mb-4">
                {/* 项目图标 */}
                <div className="w-10 h-10 bg-[#333] rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>

                {/* 项目标题 */}
                <h3 className="text-white font-medium flex-1 truncate">{project.title}</h3>

                {/* 更多按钮 */}
                <button 
                  className="text-gray-500 hover:text-white"
                  onClick={(e) => {
                    e.stopPropagation()
                    // 处理更多操作
                  }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* 项目信息 */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>{project.chatCount} Chat</span>
                </div>
                <span className="text-gray-500">•</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
                  <span className="text-xs text-gray-500">{project.updatedBy}</span>
                </div>
                <span className="text-gray-500">•</span>
                <span className="text-xs text-gray-500">{project.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 