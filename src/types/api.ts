export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

export interface ApiResponse<T> {
  statusCode: number;
  timestamp: string;
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
}

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
  },
  user: {
    create: '/user',
    get: '/user',
    getOne: '/user',
    update: '/user/update',
    delete: '/user',
    changePassword: '/user/change-password',
  },
};
