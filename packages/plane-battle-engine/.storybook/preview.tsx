import type { Preview } from '@storybook/react';
import type { StoryFn } from '@storybook/react';
import React from 'react';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    options: {
      storySort: {
        order: ['指南', ['介绍'], '示例', ['交互演示']],
      },
    },
    docs: {
      toc: true, // 启用目录
      source: {
        language: 'typescript', // 默认代码语言
        format: true, // 格式化代码
      },
    },
    // 添加 Canvas 相关配置
    layout: 'fullscreen',  // 使用全屏布局
    canvas: {
      disable: false,  // 启用 Canvas
    },
  },
  decorators: [
    (Story: StoryFn) => (
      <div style={{ 
        width: '100%', 
        height: '100vh', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#000'
      }}>
        <Story />
      </div>
    ),
  ],
};

export default preview; 