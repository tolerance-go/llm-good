import type { Meta, StoryObj } from '@storybook/react'
import { ChatBox } from '../components/ChatBox'

const meta = {
  title: 'Components/聊天框',
  component: ChatBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ChatBox>

export default meta
type Story = StoryObj<typeof meta>

export const 空白对话: Story = {
  args: {
    messages: [],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
    onClear: () => {
      console.log('Messages cleared')
    },
  },
}

export const 包含消息: Story = {
  args: {
    messages: [
      {
        id: '1',
        content: '你好！我是游戏助手',
        role: 'assistant',
        timestamp: Date.now() - 2000,
      },
      {
        id: '2',
        content: '你好！我想了解一下游戏规则',
        role: 'user',
        timestamp: Date.now() - 1000,
      },
      {
        id: '3',
        content: '当然可以！贪吃蛇游戏的规则很简单：使用方向键控制蛇的移动方向，吃到食物可以增加长度和分数。注意不要撞到墙壁或自己的身体哦！',
        role: 'assistant',
        timestamp: Date.now(),
      },
    ],
    isLoading: false,
    onSendMessage: (content: string) => {
      console.log('Message sent:', content)
    },
    onClear: () => {
      console.log('Messages cleared')
    },
  },
}

export const 加载中: Story = {
  args: {
    ...包含消息.args,
    isLoading: true,
  },
} 