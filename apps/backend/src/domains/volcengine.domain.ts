import axios from 'axios';

export interface VolcengineConfig {
  apiKey: string;
  apiSecret: string;
  host?: string;
}

export class VolcengineDomain {
  private static instance: VolcengineDomain;
  private config: VolcengineConfig;
  private readonly defaultHost = 'https://api.volcengineapi.com';

  private constructor(config: VolcengineConfig) {
    this.config = config;
  }

  public static getInstance(config: VolcengineConfig): VolcengineDomain {
    if (!VolcengineDomain.instance) {
      VolcengineDomain.instance = new VolcengineDomain(config);
    }
    return VolcengineDomain.instance;
  }

  public async chatCompletion(messages: Array<{ role: string; content: string }>) {
    try {
      const response = await axios.post(
        `${this.config.host || this.defaultHost}/v1/chat/completions`,
        {
          messages,
          model: 'skylark-chat',
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Volcengine API Error:', error);
      throw error;
    }
  }
} 