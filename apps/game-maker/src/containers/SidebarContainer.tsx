import { useNavigate, useLocation } from "react-router-dom";
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sidebar } from '../components/Sidebar';
import { dismissNewFeature } from '../store/gameSlice';
import type { RootState } from '../store';

export function SidebarContainer() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);

  const userInfo = {
    name: "游客用户",
    plan: "免费版"
  };

  const { newFeature, newFeatureVisible } = useSelector((state: RootState) => ({
    newFeature: state.game.ui.newFeature,
    newFeatureVisible: state.game.ui.newFeatureVisible
  }));

  const recentItems = [
    {
      title: "贪吃蛇游戏设计",
      path: "/chat/snake-design"
    },
    {
      title: "俄罗斯方块优化",
      path: "/chat/tetris-optimization"
    }
  ];

  const isChatActive = () => {
    return location.pathname === "/chats";
  };

  const isProjectActive = () => {
    return location.pathname.startsWith("/project");
  };

  const navigationItems = [
    {
      key: 'chat',
      label: '聊天',
      path: '/chats',
      isActive: isChatActive(),
      icon: (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      key: 'projects',
      label: '项目',
      path: '/projects',
      isActive: isProjectActive(),
      icon: (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
    },
    {
      key: 'feedback',
      label: '反馈',
      path: '/feedback',
      isActive: false,
      icon: (
        <svg
          className="w-4 h-4 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleNewChat = () => {
    navigate("/chat/new");
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDismissNewFeature = () => {
    dispatch(dismissNewFeature());
  };

  return (
    <Sidebar
      isExpanded={isExpanded}
      navigationItems={navigationItems}
      onNavigate={handleNavigate}
      onNewChat={handleNewChat}
      onToggleExpand={handleToggleExpand}
      userInfo={userInfo}
      newFeature={newFeatureVisible ? newFeature : undefined}
      recentItems={recentItems}
      onDismissNewFeature={handleDismissNewFeature}
    />
  );
} 