import { v4 as uuidv4 } from 'uuid';
import { User, CreateUserDto } from '../types/user';
import { validateEmail, validatePassword, validateUsername, ValidationError } from '../utils/validation';

export class UserService {
  private users: User[] = [];

  async createUser(dto: CreateUserDto): Promise<User> {
    if (!validateEmail(dto.email)) {
      throw new ValidationError('Invalid email format');
    }

    if (!validateUsername(dto.username)) {
      throw new ValidationError('Username must be between 3 and 20 characters');
    }

    if (!validatePassword(dto.password)) {
      throw new ValidationError('Password must be at least 6 characters long');
    }

    const existingUser = this.users.find(user => user.email === dto.email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }

    const existingUsername = this.users.find(user => user.username === dto.username);
    if (existingUsername) {
      throw new ValidationError('Username already exists');
    }

    const newUser: User = {
      id: uuidv4(),
      username: dto.username,
      email: dto.email,
      password: dto.password,
      createdAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }
} 