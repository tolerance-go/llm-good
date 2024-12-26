import { ReactNode } from 'react'
import { HEADER_HEIGHT } from '../constants/layout'

interface PageHeaderProps {
  title: string
  action?: ReactNode
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
}

export function PageHeader({ 
  title, 
  action,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search..."
}: PageHeaderProps) {
  return (
    <div className="border-b border-[#222] border-l border-[#222]">
      {/* 标题和操作区 */}
      <div className={`h-[${HEADER_HEIGHT}px] flex border-b border-[#222] py-4`}>
        <div className={`h-[${HEADER_HEIGHT}px] w-[240px] flex items-center px-6`}>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
        </div>
        <div className="flex-1 flex items-center justify-end px-6">
          {action}
        </div>
      </div>

      {/* 搜索栏 */}
      {onSearchChange && (
        <div className="px-6 py-4">
          <div className="relative">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-[#222] text-white placeholder-gray-400 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg 
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
} 