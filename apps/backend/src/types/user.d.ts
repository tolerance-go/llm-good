export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
}

export interface CreateUserDto {
  username: string;
  email: string;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  createdAt: string;
} 