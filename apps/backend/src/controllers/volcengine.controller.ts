import { Request, Response } from 'express';
import { VolcengineService } from '../services/volcengine.service';

export class VolcengineController {
  private static instance: VolcengineController;
  private volcengineService: VolcengineService;

  private constructor() {
    this.volcengineService = VolcengineService.getInstance();
  }

  public static getInstance(): VolcengineController {
    if (!VolcengineController.instance) {
      VolcengineController.instance = new VolcengineController();
    }
    return VolcengineController.instance;
  }

  public async chat(req: Request, res: Response) {
    try {
      const { messages } = req.body;
      
      if (!Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Messages array is required and cannot be empty',
        });
      }

      const result = await this.volcengineService.chat(messages);
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error('Chat Controller Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
} 