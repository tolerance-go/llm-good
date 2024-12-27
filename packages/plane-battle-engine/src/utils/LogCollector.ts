export interface LogEntry {
  timestamp: number;
  type: "log" | "warn" | "error" | "info";
  category: string;
  message: string;
  data?: unknown;
}

export class LogCollector {
  private static instance: LogCollector;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {
    this.setupShortcuts();
  }

  public static getInstance(): LogCollector {
    if (!LogCollector.instance) {
      LogCollector.instance = new LogCollector();
    }
    return LogCollector.instance;
  }

  public addLog(
    category: string,
    message: string,
    data?: unknown,
    type: LogEntry["type"] = "log"
  ): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      type,
      category,
      message,
      data,
    };

    // 添加到日志数组
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // 输出到控制台
    const consoleMessage = `[${category}] ${message}`;
    switch (type) {
      case "error":
        console.error(consoleMessage, data);
        break;
      case "warn":
        console.warn(consoleMessage, data);
        break;
      case "info":
        console.info(consoleMessage, data);
        break;
      default:
        console.log(consoleMessage, data);
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public exportLogs(): string {
    return this.logs
      .map((log) => {
        const time = new Date(log.timestamp).toISOString();
        const dataStr = log.data ? ` | Data: ${JSON.stringify(log.data)}` : "";
        return `[${time}] [${log.type}] [${log.category}] ${log.message}${dataStr}`;
      })
      .join("\n");
  }

  public downloadLogs(): void {
    try {
      const content = this.exportLogs();
      if (!content) {
        console.warn("没有日志内容可供下载");
        return;
      }

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const filename = `game-logs-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.txt`;

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(link.href);
    } catch (e) {
      console.error("下载日志失败:", e);
    }
  }

  public clear(): void {
    this.logs = [];
  }

  public setupShortcuts(): void {
    window.addEventListener(
      "keydown",
      (e: KeyboardEvent) => {
        // Ctrl + Alt + L: 下载日志
        if (e.ctrlKey && e.altKey && (e.key === "l" || e.key === "L")) {
          e.preventDefault();
          e.stopPropagation();
          this.downloadLogs();
        }
        // Ctrl + Alt + C: 清除日志
        if (e.ctrlKey && e.altKey && (e.key === "c" || e.key === "C")) {
          e.preventDefault();
          e.stopPropagation();
          this.clear();
        }
      },
      true
    );
  }
}
