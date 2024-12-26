import React from 'react';
import { SIDEBAR_WIDTH_EXPANDED, SIDEBAR_WIDTH_COLLAPSED } from '../constants/layout';

interface NavigationItem {
  key: string;
  label: string;
  path: string;
  isActive: boolean;
  icon: React.ReactNode;
}

interface UserInfo {
  name: string;
  avatar?: string;
  plan?: string;
}

interface FeatureNotification {
  title: string;
  description: string;
}

interface SidebarProps {
  isExpanded: boolean;
  navigationItems: NavigationItem[];
  onNavigate: (path: string) => void;
  onNewChat: () => void;
  onToggleExpand: () => void;
  userInfo?: UserInfo;
  newFeature?: FeatureNotification;
  recentItems?: {
    title: string;
    path: string;
  }[];
  onDismissNewFeature?: () => void;
}

export function Sidebar({ 
  isExpanded, 
  navigationItems, 
  onNavigate, 
  onNewChat, 
  onToggleExpand,
  userInfo,
  newFeature,
  recentItems = [],
  onDismissNewFeature
}: SidebarProps) {
  return (
    <div 
      className={`${
        isExpanded ? `w-[${SIDEBAR_WIDTH_EXPANDED}px]` : `w-[${SIDEBAR_WIDTH_COLLAPSED}px]`
      } h-screen bg-gradient-to-b from-gray-900 to-black border-r border-white/[0.08] flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Logo 和折叠按钮容器 */}
      <div className="flex items-center justify-between h-12">
        <div 
          onClick={() => onNavigate('/')} 
          className="h-full flex items-center px-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
        >
          {isExpanded ? (
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-lg transition-all duration-300">
              vØ
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] rounded-lg transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
        {isExpanded && (
          <button
            onClick={onToggleExpand}
            className="w-12 h-12 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>

      {/* 新建按钮 */}
      <div className={`${isExpanded ? 'px-3' : 'px-2'} mb-2`}>
        <button
          onClick={onNewChat}
          className={`h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 flex items-center justify-center ${
            isExpanded ? 'w-full px-3 gap-2' : 'w-8'
          } text-white shadow-md transition-all duration-200`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          {isExpanded && <span className="text-xs font-medium truncate">新建对话</span>}
        </button>
      </div>

      {/* 导航按钮 */}
      <div className={`flex-1 flex flex-col ${isExpanded ? 'px-2' : 'px-1'} space-y-1`}>
        {navigationItems.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.path)}
            className={`w-full h-9 rounded-lg flex items-center gap-2 px-3 transition-all duration-200 ${
              item.isActive
                ? "bg-white/[0.12] text-white shadow-md"
                : "text-white/70 hover:text-white hover:bg-white/[0.08]"
            } ${!isExpanded && 'justify-center px-0'}`}
          >
            {item.icon}
            {isExpanded && <span className="text-xs font-medium truncate">{item.label}</span>}
          </button>
        ))}

        {/* 最近项目列表 */}
        {isExpanded && recentItems.length > 0 && (
          <div className="mt-6">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-medium text-white/40">Recent Chats</h3>
            </div>
            <div className="space-y-1">
              {recentItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(item.path)}
                  className="w-full h-8 px-3 flex items-center text-white/70 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
                >
                  <span className="text-xs truncate">{item.title}</span>
                </button>
              ))}
              <button
                onClick={() => onNavigate('/chats')}
                className="w-full h-8 px-3 flex items-center text-white/40 hover:text-white hover:bg-white/[0.08] rounded-lg transition-colors"
              >
                <span className="text-xs">View All →</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 新功能提示 */}
      {isExpanded && newFeature && (
        <div className="mx-2 mb-3 p-3 bg-white/[0.03] rounded-lg relative group">
          {onDismissNewFeature && (
            <button
              onClick={onDismissNewFeature}
              className="absolute top-2 right-2 text-white/40 hover:text-white"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <h4 className="text-sm font-medium text-white mb-1">{newFeature.title}</h4>
          <p className="text-xs text-white/70">{newFeature.description}</p>
        </div>
      )}

      {/* 底部按钮组 */}
      <div className="px-2 pb-3 space-y-2">
        {/* 用户信息 */}
        {userInfo && (
          <div 
            className={`flex items-center ${
              isExpanded 
                ? 'gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03]' 
                : 'justify-center'
            } cursor-pointer transition-all duration-200`}
          >
            <div className={`${
              isExpanded ? 'w-8 h-8' : 'w-7 h-7'
            } rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center overflow-hidden transition-all duration-300`}>
              {userInfo.avatar ? (
                <img src={userInfo.avatar} alt={userInfo.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-sm font-medium">
                  {userInfo.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {isExpanded && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{userInfo.name}</div>
                {userInfo.plan && (
                  <div className="text-xs text-white/50 truncate">{userInfo.plan}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
