export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  USER = 'USER',
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  status?: string;
  globalStatus?: string;
  createdAt: string;
  updatedAt: string;
  personId?: string | null;
  person?: Person | null;
}

export interface Person {
  id?: string;
  names?: string;
  lastNames?: string;
  email?: string;
  phone?: string;
  cretedAt?: string;
  updatedAt?: string;
  globalStatus?: string;
}
