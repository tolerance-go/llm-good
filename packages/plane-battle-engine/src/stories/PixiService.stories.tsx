import React, { useEffect, useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PixiService } from "../core/services/PixiService";
import { DEFAULT_CONFIG } from "../types/config";
import * as PIXI from "pixi.js";

/**
 * PixiService 是游戏引擎的核心渲染服务，负责管理 PixiJS 应用实例和底层渲染功能。
 *
 * ## 主要功能
 * - 初始化 PixiJS 应用实例
 * - 管理画布尺寸和自适应缩放
 * - 提供显示对象的添加和移除功能
 * - 统一的资源销毁处理
 */
const meta = {
  title: "核心服务/PixiService",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "PixiService 提供了 PixiJS 的核心渲染功能，包括应用初始化、显示对象管理等。",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

interface PixiServiceDemoProps {
  width?: number;
  height?: number;
  backgroundColor?: number;
}

// 创建一个包装组件来演示 PixiService
const PixiServiceDemo: React.FC<PixiServiceDemoProps> = ({
  width = 400,
  height = 300,
  backgroundColor = 0x1a1a1a,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pixiServiceRef = useRef<PixiService | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const pixiService = new PixiService();
      pixiServiceRef.current = pixiService;

      // 初始化 PixiJS
      pixiService
        .initialize(
          {
            ...DEFAULT_CONFIG,
            canvas: {
              width,
              height,
              backgroundColor,
            },
          },
          containerRef.current
        )
        .then(async () => {
          // 创建一个示例图形
          const graphics = new PIXI.Graphics();
          graphics.beginFill(0xff0000);
          graphics.drawCircle(width / 2, height / 2, 50);
          graphics.endFill();

          pixiService.addToStage(graphics);
        });

      return () => {
        if (pixiServiceRef.current) {
          pixiServiceRef.current.destroy();
        }
      };
    }
  }, [width, height, backgroundColor]);

  return (
    <div
      ref={containerRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        border: "1px solid #333",
      }}
    />
  );
};

export const 基础用法: Story = {
  render: () => <PixiServiceDemo />,
};

export const 自定义尺寸: Story = {
  render: () => <PixiServiceDemo width={600} height={400} />,
};

export const 自定义背景色: Story = {
  render: () => <PixiServiceDemo backgroundColor={0x2c3e50} />,
};
