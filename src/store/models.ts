export enum Role {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  USER = 'USER',
}

export enum GlobalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export interface User {
  id: string;
  email: string;
  password: string;
  role: Role;
  status?: string;
  globalStatus?: GlobalStatus;
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
  globalStatus?: GlobalStatus;
}

export enum NodeVersion {
  BETA = 'BETA',
  V1 = 'V1',
  V2 = 'V2',
}
export interface Node {
  id?: string;
  code?: string;
  version?: NodeVersion;
  globalStatus?: GlobalStatus;
  cretedAt?: string;
  updatedAt?: string;
}
