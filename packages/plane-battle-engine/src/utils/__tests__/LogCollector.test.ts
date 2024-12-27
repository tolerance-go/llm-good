import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { LogCollector } from '../LogCollector';

describe('LogCollector', () => {
  let logCollector: LogCollector;

  beforeEach(() => {
    // 获取单例实例
    logCollector = LogCollector.getInstance();
    // 清空之前的日志
    logCollector.clear();
    // 模拟 console 方法
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('应该是一个单例', () => {
    const instance1 = LogCollector.getInstance();
    const instance2 = LogCollector.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('应该能够添加日志并正确存储', () => {
    const category = 'test';
    const message = 'test message';
    const data = { foo: 'bar' };

    logCollector.addLog(category, message, data);
    const logs = logCollector.getLogs();

    expect(logs).toHaveLength(1);
    expect(logs[0]).toMatchObject({
      category,
      message,
      data,
      type: 'log'
    });
    expect(logs[0].timestamp).toBeDefined();
    expect(console.log).toHaveBeenCalled();
  });

  it('应该能够处理不同类型的日志', () => {
    logCollector.addLog('test', 'info message', null, 'info');
    logCollector.addLog('test', 'error message', null, 'error');
    logCollector.addLog('test', 'warn message', null, 'warn');

    expect(console.info).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it('应该限制日志数量不超过最大值', () => {
    const maxLogs = 1000;
    for (let i = 0; i < maxLogs + 10; i++) {
      logCollector.addLog('test', `message ${i}`);
    }

    const logs = logCollector.getLogs();
    expect(logs).toHaveLength(maxLogs);
    // 确保保留了最新的日志
    expect(logs[logs.length - 1].message).toBe(`message ${maxLogs + 9}`);
  });

  it('应该能够导出日志为字符串格式', () => {
    const testData = { test: 'data' };
    logCollector.addLog('test', 'test message', testData);
    
    const exportedLogs = logCollector.exportLogs();
    expect(typeof exportedLogs).toBe('string');
    expect(exportedLogs).toContain('test message');
    expect(exportedLogs).toContain(JSON.stringify(testData));
  });

  it('应该能够清空日志', () => {
    logCollector.addLog('test', 'test message');
    expect(logCollector.getLogs()).toHaveLength(1);
    
    logCollector.clear();
    expect(logCollector.getLogs()).toHaveLength(0);
  });

  it('应该能够正确设置快捷键', () => {
    const mockAddEventListener = vi.spyOn(window, 'addEventListener');
    logCollector.setupShortcuts();
    
    expect(mockAddEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function),
      true
    );
  });

  it('快捷键应该正确触发相应功能', () => {
    // 模拟 document.createElement
    const mockLink = {
      href: 'mock-url',
      download: '',
      click: vi.fn()
    } as unknown as HTMLAnchorElement;
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);

    // 模拟 URL 方法
    const originalURL = global.URL;
    const mockURL = {
      createObjectURL: vi.fn().mockReturnValue('mock-blob-url'),
      revokeObjectURL: vi.fn(),
    };
    global.URL.createObjectURL = mockURL.createObjectURL;
    global.URL.revokeObjectURL = mockURL.revokeObjectURL;
    
    // 添加一些测试日志
    logCollector.addLog('test', 'test message');
    
    // 模拟 Ctrl + Alt + L 快捷键
    const downloadEvent = new KeyboardEvent('keydown', {
      key: 'l',
      ctrlKey: true,
      altKey: true
    });
    window.dispatchEvent(downloadEvent);
    
    expect(mockURL.createObjectURL).toHaveBeenCalled();
    expect(mockURL.revokeObjectURL).toHaveBeenCalled();
    expect(mockLink.click).toHaveBeenCalled();
    
    // 模拟 Ctrl + Alt + C 快捷键
    const clearEvent = new KeyboardEvent('keydown', {
      key: 'c',
      ctrlKey: true,
      altKey: true
    });
    window.dispatchEvent(clearEvent);
    
    expect(logCollector.getLogs()).toHaveLength(0);

    // 恢复 URL 方法
    global.URL.createObjectURL = originalURL.createObjectURL;
    global.URL.revokeObjectURL = originalURL.revokeObjectURL;
  });
}); 