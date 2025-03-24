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
    getOne: (userId: string) => `/user/${userId}`,
    update: (userId: string) => `/user/update/${userId}`,
    delete: (userId: string) => `/user/${userId}`,
    changePassword: (userId: string) => `/user/change-password/${userId}`,
  },
  node: {
    create: '/node',
    get: '/node',
    getOne: (nodeId: string) => `/node/${nodeId}`,
    update: (nodeId: string) => `/node/${nodeId}`,
    delete: (nodeId: string) => `/node/${nodeId}`,
  },
  parkingLot: {
    create: '/admin/parking-lot',
    get: '/parking-lot',
    getOne: (parkingLotId: string) => `/admin/parking-lot/${parkingLotId}`,
    update: (parkingLotId: string) => `/admin/parking-lot/${parkingLotId}`,
    delete: (parkingLotId: string) => `/admin/parking-lot/${parkingLotId}`,
    getHistory: (parkingLotId: string) =>
      `admin/parking-lot/${parkingLotId}/history`,
  },
  files: {
    upload: '/files/upload',
    delete: '/files/delete',
    getUrl: '/files/get-url',
    getInfo: '/files/get-info',
  },
};
