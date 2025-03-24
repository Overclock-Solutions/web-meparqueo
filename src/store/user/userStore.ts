import { create } from 'zustand';
import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './types';
import api from '../../service/api';
import { API_ENDPOINTS, ApiResponse } from '../../types/api';
import { extractErrorMessage } from '../helpers';
import { User } from '../models';

interface UserStore {
  users: User[];
  loading: {
    get: boolean;
    getOne: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  errors: string[];
  createUser: (dto: CreateUserDto) => Promise<User>;
  getUsers: () => Promise<User[]>;
  getUser: (id: string) => Promise<User>;
  updateUser: (id: string, dto: UpdateUserDto) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  changePassword: (id: string, dto: UpdatePasswordDto) => Promise<User>;
  clearError: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  loading: {
    get: false,
    getOne: false,
    create: false,
    update: false,
    delete: false,
  },
  errors: [],
  createUser: async (dto: CreateUserDto) => {
    set((state) => ({
      loading: { ...state.loading, create: true },
      errors: [],
    }));
    try {
      const response = await api.post<ApiResponse<User>>(
        API_ENDPOINTS.user.create,
        dto,
      );
      const user = response.data.data;
      set((state) => ({
        users: [...state.users, user],
        loading: { ...state.loading, create: false },
      }));
      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, create: false },
      }));
      throw new Error(errMsg);
    }
  },
  getUsers: async () => {
    set((state) => ({
      loading: { ...state.loading, get: true },
      errors: [],
    }));
    try {
      const response = await api.get<ApiResponse<User[]>>(
        API_ENDPOINTS.user.get,
      );
      const users = response.data.data;
      set((state) => ({
        users,
        loading: { ...state.loading, get: false },
      }));
      return users;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, get: false },
      }));
      throw new Error(errMsg);
    }
  },
  getUser: async (id: string) => {
    set((state) => ({
      loading: { ...state.loading, getOne: true },
      errors: [],
    }));
    try {
      const response = await api.get<ApiResponse<User>>(
        `${API_ENDPOINTS.user.getOne}/${id}`,
      );
      const user = response.data.data;
      set((state) => ({
        loading: { ...state.loading, getOne: false },
      }));
      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, getOne: false },
      }));
      throw new Error(errMsg);
    }
  },
  updateUser: async (id: string, dto: UpdateUserDto) => {
    set((state) => ({
      loading: { ...state.loading, update: true },
      errors: [],
    }));
    try {
      const response = await api.patch<ApiResponse<User>>(
        `${API_ENDPOINTS.user.update}/${id}`,
        dto,
      );
      const updatedUser = response.data.data;
      set((state) => ({
        users: state.users.map((user) =>
          user.id === id
            ? { ...updatedUser, person: updatedUser.person }
            : user,
        ),
        loading: { ...state.loading, update: false },
      }));
      return updatedUser;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, update: false },
      }));
      throw new Error(errMsg);
    }
  },
  deleteUser: async (id: string) => {
    set((state) => ({
      loading: { ...state.loading, delete: true },
      errors: [],
    }));
    try {
      await api.delete(`${API_ENDPOINTS.user.delete}/${id}`);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        loading: { ...state.loading, delete: false },
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, delete: false },
      }));
      throw new Error(errMsg);
    }
  },
  changePassword: async (id: string, dto: UpdatePasswordDto) => {
    set((state) => ({
      loading: { ...state.loading, update: true },
      errors: [],
    }));
    try {
      const response = await api.patch<ApiResponse<User>>(
        `${API_ENDPOINTS.user.changePassword}/${id}`,
        dto,
      );
      const updatedUser = response.data.data;
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        loading: { ...state.loading, update: false },
      }));
      return updatedUser;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, update: false },
      }));
      throw new Error(errMsg);
    }
  },
  clearError: () => {
    set({ errors: [] });
  },
}));
