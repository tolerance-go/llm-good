import { VolcengineDomain, VolcengineConfig } from '../domains/volcengine.domain';

export class VolcengineService {
  private static instance: VolcengineService;
  private volcengineDomain: VolcengineDomain;

  private constructor() {
    const config: VolcengineConfig = {
      apiKey: process.env.VOLCENGINE_API_KEY || '',
      apiSecret: process.env.VOLCENGINE_API_SECRET || '',
      host: process.env.VOLCENGINE_HOST,
    };
    this.volcengineDomain = VolcengineDomain.getInstance(config);
  }

  public static getInstance(): VolcengineService {
    if (!VolcengineService.instance) {
      VolcengineService.instance = new VolcengineService();
    }
    return VolcengineService.instance;
  }

  public async chat(messages: Array<{ role: string; content: string }>) {
    try {
      return await this.volcengineDomain.chatCompletion(messages);
    } catch (error) {
      console.error('Volcengine Service Error:', error);
      throw error;
    }
  }
} 