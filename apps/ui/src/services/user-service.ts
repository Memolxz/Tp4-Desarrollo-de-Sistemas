import api from './api';

export interface User {
  id: number;
  username: string;
  dni: string;
  email: string;
  balance: number;
  createdAt: string;
  deletedAt?: string | null;
}

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get('/users/profile');
    return response.data.data;
  },

  addBalance: async (amount: number): Promise<{ balance: number }> => {
    const response = await api.post('/users/balance', { amount });
    return response.data.data;
  },

  getBalance: async (): Promise<number> => {
    const response = await api.get('/users/balance');
    return response.data.data;
  },
};

export default userService;
