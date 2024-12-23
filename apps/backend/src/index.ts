import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerOptions } from './swagger';
import userRoutes from './routes/user.route';
import volcengineRoutes from './routes/volcengine.route';

const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// Swagger 设置
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 路由
app.use('/api/users', userRoutes);
app.use('/api/volcengine', volcengineRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     summary: 获取欢迎信息
 *     description: 返回一个简单的欢迎信息
 *     responses:
 *       200:
 *         description: 成功返回欢迎信息
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Welcome to the API
 */
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
}); 