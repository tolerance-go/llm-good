import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: '点击我',
  },
};

export const WithOnClick: Story = {
  args: {
    children: '点击事件',
    onClick: () => alert('按钮被点击了！'),
  },
};

export const LongText: Story = {
  args: {
    children: '这是一个很长的按钮文本',
  },
}; 