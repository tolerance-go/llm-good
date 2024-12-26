import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onNavigate: () => {},
    onNewChat: () => {},
    onToggleExpand: () => {},
    onDismissNewFeature: () => {},
  },
  decorators: [
    (Story) => (
      <div className="h-screen bg-gray-900">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof Sidebar>;

const navigationItems = [
  {
    key: 'chat',
    label: '聊天',
    path: '/chats',
    isActive: true,
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
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
      </svg>
    ),
  },
];

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

export const Expanded: Story = {
  args: {
    isExpanded: true,
    navigationItems,
    recentItems,
    userInfo: {
      name: "张三",
      plan: "免费版"
    },
    newFeature: {
      title: "新功能：AI 游戏生成器",
      description: "使用 AI 快速创建和定制你的游戏，让游戏开发变得更简单。"
    }
  }
};

export const Collapsed: Story = {
  args: {
    ...Expanded.args,
    isExpanded: false,
  }
};

export const WithAvatar: Story = {
  args: {
    ...Expanded.args,
    userInfo: {
      name: "张三",
      plan: "免费版",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
    }
  }
};

export const CollapsedWithAvatar: Story = {
  args: {
    ...WithAvatar.args,
    isExpanded: false,
  }
};

export const WithoutNewFeature: Story = {
  args: {
    ...Expanded.args,
    newFeature: undefined
  }
};

export const WithoutUserInfo: Story = {
  args: {
    ...Expanded.args,
    userInfo: undefined
  }
};

export const WithoutRecentItems: Story = {
  args: {
    ...Expanded.args,
    recentItems: []
  }
}; 