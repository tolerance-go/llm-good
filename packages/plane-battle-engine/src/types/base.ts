// 基础几何类型
export interface Vector2D {
  x: number;
  y: number;
}

// 基础变换类型
export interface Transform {
  position: Vector2D;
  rotation: number;
  scale: Vector2D;
}

// 基础实体类型
export interface Entity extends Transform {
  id: string;
  active: boolean;
}

export interface Size {
  width: number;
  height: number;
}

export interface GameObject extends Transform {
  id: string;
  active: boolean;
  size: Size;
} 

// 事件处理器类型
export type BaseEventHandler<T = unknown> = (data: T) => void;
export type EventHandlers = { [key: string]: BaseEventHandler[] }; 