import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { ValidationError } from '../utils/validation';
import { CreateUserDto, UserResponse } from '../types/user';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userDto: CreateUserDto = req.body;
      const user = await this.userService.createUser(userDto);
      
      const response: UserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString()
      };

      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else if (error instanceof Error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const response: UserResponse = {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt.toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: error.message });
      } else {
        console.error('Unknown error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };
} 