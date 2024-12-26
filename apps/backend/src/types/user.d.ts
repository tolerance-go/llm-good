export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
} 