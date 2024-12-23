import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDto } from '../types/user';
import { isValidEmail, ValidationError } from '../utils/validation';

export class UserService {
  private users: User[] = [];

  async createUser(dto: CreateUserDto): Promise<User> {
    if (!isValidEmail(dto.email)) {
      throw new ValidationError('Invalid email format');
    }

    const existingUser = this.users.find(user => user.email === dto.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      username: dto.username,
      email: dto.email,
      createdAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }
} 