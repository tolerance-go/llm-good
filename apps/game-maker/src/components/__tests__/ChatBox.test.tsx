import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ChatBox } from '../ChatBox'

describe('ChatBox', () => {
  const mockMessages = [
    {
      id: '1',
      content: '你好！我是游戏助手',
      role: 'assistant' as const,
      timestamp: Date.now() - 2000,
    },
    {
      id: '2',
      content: '你好！我想了解一下游戏规则',
      role: 'user' as const,
      timestamp: Date.now() - 1000,
    },
  ]

  // 测试空消息列表的渲染
  it('renders empty state correctly', () => {
    const mockHandlers = {
      onSendMessage: vi.fn(),
      onClear: vi.fn(),
    }

    render(
      <ChatBox
        messages={[]}
        isLoading={false}
        onSendMessage={mockHandlers.onSendMessage}
        onClear={mockHandlers.onClear}
      />
    )

    // 验证基本UI元素存在
    expect(screen.getByText('游戏助手')).toBeInTheDocument()
    expect(screen.getByText('清空对话')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('输入消息...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '发送' })).toBeInTheDocument()
  })

  // 测试消息列表的渲染
  it('renders messages correctly', () => {
    const mockHandlers = {
      onSendMessage: vi.fn(),
      onClear: vi.fn(),
    }

    render(
      <ChatBox
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockHandlers.onSendMessage}
        onClear={mockHandlers.onClear}
      />
    )

    // 验证所有消息都被渲染
    mockMessages.forEach(message => {
      expect(screen.getByText(message.content)).toBeInTheDocument()
    })
  })

  // 测试加载状态
  it('shows loading state correctly', () => {
    const mockHandlers = {
      onSendMessage: vi.fn(),
      onClear: vi.fn(),
    }

    render(
      <ChatBox
        messages={mockMessages}
        isLoading={true}
        onSendMessage={mockHandlers.onSendMessage}
        onClear={mockHandlers.onClear}
      />
    )

    // 验证加载状态显示
    expect(screen.getByText('正在思考...')).toBeInTheDocument()
    // 验证输入框和发送按钮在加载状态下被禁用
    expect(screen.getByPlaceholderText('输入消息...')).toBeDisabled()
    expect(screen.getByRole('button', { name: '发送' })).toBeDisabled()
  })

  // 测试发送消息功能
  it('handles message sending correctly', () => {
    const mockHandlers = {
      onSendMessage: vi.fn(),
      onClear: vi.fn(),
    }

    render(
      <ChatBox
        messages={[]}
        isLoading={false}
        onSendMessage={mockHandlers.onSendMessage}
        onClear={mockHandlers.onClear}
      />
    )

    // 输入消息
    const input = screen.getByPlaceholderText('输入消息...')
    fireEvent.change(input, { target: { value: '测试消息' } })

    // 点击发送按钮
    const sendButton = screen.getByRole('button', { name: '发送' })
    fireEvent.click(sendButton)

    // 验证回调函数被调用
    expect(mockHandlers.onSendMessage).toHaveBeenCalledWith('测试消息')
    // 验证输入框被清空
    expect(input).toHaveValue('')
  })

  // 测试清空对话功能
  it('handles clear messages correctly', () => {
    const mockHandlers = {
      onSendMessage: vi.fn(),
      onClear: vi.fn(),
    }

    render(
      <ChatBox
        messages={mockMessages}
        isLoading={false}
        onSendMessage={mockHandlers.onSendMessage}
        onClear={mockHandlers.onClear}
      />
    )

    // 点击清空对话按钮
    const clearButton = screen.getByText('清空对话')
    fireEvent.click(clearButton)

    // 验证回调函数被调用
    expect(mockHandlers.onClear).toHaveBeenCalled()
  })

  // 测试空白消息不能发送
  it('prevents sending empty messages', () => {
    const mockHandlers = {
      onSendMessage: vi.fn(),
      onClear: vi.fn(),
    }

    render(
      <ChatBox
        messages={[]}
        isLoading={false}
        onSendMessage={mockHandlers.onSendMessage}
        onClear={mockHandlers.onClear}
      />
    )

    // 尝试发送空消息
    const sendButton = screen.getByRole('button', { name: '发送' })
    fireEvent.click(sendButton)

    // 验证回调函数没有被调用
    expect(mockHandlers.onSendMessage).not.toHaveBeenCalled()
  })
}) 