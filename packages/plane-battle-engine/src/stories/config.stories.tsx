import type { Meta, StoryObj } from "@storybook/react";
import PlaneGame from "../components/PlaneGame";
import { DEFAULT_CONFIG } from "../types/config";

const meta = {
  title: "配置示例/基础配置",
  component: PlaneGame,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PlaneGame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 核心玩法: Story = {
  args: {
    config: {
      ...DEFAULT_CONFIG,
      canvas: {
        width: 600,
        height: 400,
        backgroundColor: 0x1a1a1a,
      },
    },
  },
};
