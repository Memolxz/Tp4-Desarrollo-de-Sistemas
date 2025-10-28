import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  dni: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  ok: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/login', data);
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/register', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/login/refresh-token', { refreshToken });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
};

export default authService;
