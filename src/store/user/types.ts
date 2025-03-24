import { Person } from '../models';

export interface CreateUserDto {
  names: string;
  lastnames: string;
  email: string;
  phone: string;
  password: string;
  role?: string;
  person?: Person | null;
}

export interface UpdateUserDto {
  names?: string;
  lastnames?: string;
  email?: string;
  phone?: string;
  role?: string;
}

export interface UpdatePasswordDto {
  password: string;
}
