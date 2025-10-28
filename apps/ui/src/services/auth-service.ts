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
    try {
      const response = await api.post('/login', data);
      if (response.data.ok && response.data.data) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.mensaje || 'Error al iniciar sesión');
    }
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      const response = await api.post('/register', data);
      if (response.data.ok && response.data.data) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Error al registrarse');
    }
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
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch (error) {
      // If token is malformed, consider it invalid
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return false;
    }
  },

  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },
};

export default authService;
