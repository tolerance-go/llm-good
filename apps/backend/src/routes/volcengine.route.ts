import { Router } from 'express';
import { VolcengineController } from '../controllers/volcengine.controller';

const router = Router();
const controller = VolcengineController.getInstance();

/**
 * @swagger
 * /api/volcengine/chat:
 *   post:
 *     tags:
 *       - Volcengine
 *     summary: Chat with Volcengine AI
 *     description: Send messages to chat with Volcengine AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - role
 *                     - content
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [system, user, assistant]
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/chat', controller.chat.bind(controller));

export default router; 