import { User } from '../models';

export interface LoginResponse {
  token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}
