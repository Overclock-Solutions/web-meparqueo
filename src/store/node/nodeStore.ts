import { create } from 'zustand';
import api from '../../service/api';
import { API_ENDPOINTS, ApiResponse } from '../../types/api';
import { extractErrorMessage } from '../helpers';
import { Node } from '../models';

interface NodeStore {
  nodes: Node[];
  loading: {
    get: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  errors: string[];
  createNode: (dto: Partial<Node>) => Promise<Node>;
  getNodes: () => Promise<Node[]>;
  updateNode: (id: string, dto: Partial<Node>) => Promise<Node>;
  deleteNode: (id: string) => Promise<void>;
  resetState: () => void;
  clearError: () => void;
}

export const useNodeStore = create<NodeStore>((set) => ({
  nodes: [],
  loading: {
    get: false,
    create: false,
    update: false,
    delete: false,
  },
  errors: [],
  createNode: async (dto) => {
    set((state) => ({
      loading: { ...state.loading, create: true },
      errors: [],
    }));
    try {
      const response = await api.post<ApiResponse<Node>>(
        API_ENDPOINTS.node.create,
        dto,
      );
      const node = response.data.data;
      set((state) => ({
        nodes: [...state.nodes, node],
        loading: { ...state.loading, create: false },
      }));
      return node;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, create: false },
      }));
      throw new Error(errMsg);
    }
  },
  getNodes: async () => {
    set((state) => ({ loading: { ...state.loading, get: true }, errors: [] }));
    try {
      const response = await api.get<ApiResponse<Node[]>>(
        API_ENDPOINTS.node.get,
      );
      const nodes = response.data.data;
      set((state) => ({ nodes, loading: { ...state.loading, get: false } }));
      return nodes;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, get: false },
      }));
      throw new Error(errMsg);
    }
  },
  updateNode: async (id, dto) => {
    set((state) => ({
      loading: { ...state.loading, update: true },
      errors: [],
    }));
    try {
      const response = await api.put<ApiResponse<Node>>(
        `${API_ENDPOINTS.node.update(id)}`,
        dto,
      );
      const updatedNode = response.data.data;
      set((state) => ({
        nodes: state.nodes.map((node) => (node.id === id ? updatedNode : node)),
        loading: { ...state.loading, update: false },
      }));
      return updatedNode;
    } catch (error) {
      const errMsg = extractErrorMessage(error);
      set((state) => ({
        errors: [...state.errors, errMsg],
        loading: { ...state.loading, update: false },
      }));
      throw new Error(errMsg);
    }
  },
  deleteNode: async (id) => {
    set((state) => ({
      loading: { ...state.loading, delete: true },
      errors: [],
    }));
    try {
      await api.delete(`${API_ENDPOINTS.node.delete(id)}`);
      set((state) => ({
        nodes: state.nodes.filter((node) => node.id !== id),
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
      nodes: [],
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
