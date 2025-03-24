import { create } from 'zustand';
import api from '../../service/api';
import { API_ENDPOINTS, ApiResponse } from '../../types/api';
import { extractErrorMessage } from '../helpers';
import { ParkingLot } from '../models';
import { ParkingLotDto } from './types';

interface ParkingLotStore {
  parkingLots: ParkingLot[];
  loading: {
    get: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  errors: string[];
  createParkingLot: (dto: Partial<ParkingLotDto>) => Promise<ParkingLot>;
  getParkingLots: () => Promise<ParkingLotDto[]>;
  updateParkingLot: (
    id: string,
    dto: Partial<ParkingLotDto>,
  ) => Promise<ParkingLot>;
  deleteParkingLot: (id: string) => Promise<void>;
  resetState: () => void;
  clearError: () => void;
}

export const useParkingLotStore = create<ParkingLotStore>((set) => ({
  parkingLots: [],
  loading: {
    get: false,
    create: false,
    update: false,
    delete: false,
  },
  errors: [],
  createParkingLot: async (dto) => {
    set((state) => ({
      loading: { ...state.loading, create: true },
      errors: [],
    }));
    try {
      const response = await api.post<ApiResponse<ParkingLot>>(
        API_ENDPOINTS.parkingLot.create,
        dto,
      );
      const parkingLot = response.data.data;
      set((state) => ({
        parkingLots: [...state.parkingLots, parkingLot],
        loading: { ...state.loading, create: false },
      }));
      return parkingLot;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, create: false },
      }));
      throw new Error(errMsg);
    }
  },
  getParkingLots: async () => {
    set((state) => ({ loading: { ...state.loading, get: true }, errors: [] }));
    try {
      const response = await api.get<ApiResponse<ParkingLot[]>>(
        API_ENDPOINTS.parkingLot.get,
      );
      const parkingLots = response.data.data;
      set((state) => ({
        parkingLots,
        loading: { ...state.loading, get: false },
      }));
      return parkingLots;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, get: false },
      }));
      throw new Error(errMsg);
    }
  },
  updateParkingLot: async (id, dto) => {
    set((state) => ({
      loading: { ...state.loading, update: true },
      errors: [],
    }));
    try {
      const response = await api.put<ApiResponse<ParkingLot>>(
        API_ENDPOINTS.parkingLot.update(id),
        dto,
      );
      const updatedParkingLot = response.data.data;
      set((state) => ({
        parkingLots: state.parkingLots.map((lot) =>
          lot.id === id ? updatedParkingLot : lot,
        ),
        loading: { ...state.loading, update: false },
      }));
      return updatedParkingLot;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, update: false },
      }));
      throw new Error(errMsg);
    }
  },
  deleteParkingLot: async (id) => {
    set((state) => ({
      loading: { ...state.loading, delete: true },
      errors: [],
    }));
    try {
      await api.delete(API_ENDPOINTS.parkingLot.delete(id));
      set((state) => ({
        parkingLots: state.parkingLots.filter((lot) => lot.id !== id),
        loading: { ...state.loading, delete: false },
      }));
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, delete: false },
      }));
      throw new Error(errMsg);
    }
  },
  resetState: () => {
    set(() => ({
      parkingLots: [],
      loading: {
        get: false,
        create: false,
        update: false,
        delete: false,
      },
      errors: [],
    }));
  },
  clearError: () => set({ errors: [] }),
}));
