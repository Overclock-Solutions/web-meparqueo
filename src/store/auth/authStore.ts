import { create } from 'zustand';
import { LoginDto, LoginResponse } from './types';
import { API_ENDPOINTS, ApiResponse } from '../../types/api';
import { extractErrorMessage } from '../helpers';
import api from '../../service/api';
import { User } from '../models';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errors: string[];
  // Acciones
  login: (credentials: LoginDto) => Promise<User>;
  getMe: () => Promise<User>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  errors: [],
  login: async (credentials: LoginDto) => {
    // Iniciamos la acción: limpiamos errores y activamos la carga.
    set({ isLoading: true, errors: [] });
    try {
      const response = await api.post<ApiResponse<LoginResponse>>(
        API_ENDPOINTS.auth.login,
        credentials,
      );
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      // Actualizamos el estado con el usuario y la autenticación exitosa.
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Extraemos el mensaje de error de forma centralizada.
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        isLoading: false,
        isAuthenticated: true,
      }));
      throw new Error(errMsg);
    }
  },
  getMe: async () => {
    set({ isLoading: true, errors: [] });
    try {
      const response = await api.get<ApiResponse<User>>(API_ENDPOINTS.auth.me);
      const user = response.data.data;
      set({ user, isAuthenticated: true, isLoading: false });
      return user;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        isLoading: false,
        isAuthenticated: false,
      }));
      throw new Error(errMsg);
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },
  clearError: () => {
    set({ errors: [] });
  },
}));
