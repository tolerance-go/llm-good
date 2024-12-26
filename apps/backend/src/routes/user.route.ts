import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserDto:
 *       type: object
 *       required:
 *         - username
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           description: 用户名
 *         email:
 *           type: string
 *           description: 电子邮件地址
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: 用户ID
 *         username:
 *           type: string
 *           description: 用户名
 *         email:
 *           type: string
 *           description: 电子邮件地址
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 */

const router = Router();
const userController = new UserController();

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: 创建新用户
 *     description: 创建一个新的用户账户
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: 用户创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: 验证错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: 获取用户信息
 *     description: 通过用户ID获取用户详细信息
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 用户ID
 *     responses:
 *       200:
 *         description: 成功获取用户信息
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       404:
 *         description: 用户未找到
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get('/:id', userController.getUserById);

export default router; 