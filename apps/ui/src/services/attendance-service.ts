import api from './api';

export interface Attendance {
  id: number;
  userId: number;
  eventId: number;
  confirmedAt: string;
}

export const attendanceService = {
  confirmAttendance: async (eventId: number): Promise<Attendance> => {
    const response = await api.post(`/attendance/${eventId}`);
    return response.data.data;
  },

  cancelAttendance: async (eventId: number): Promise<void> => {
    await api.delete(`/attendance/${eventId}`);
  },
};

export interface Purchase {
  id: number;
  userId: number;
  eventId: number;
  quantity: number;
  totalAmount: number;
  purchasedAt: string;
  event?: any;
}

export const purchaseService = {
  purchaseTickets: async (eventId: number, quantity: number): Promise<Purchase> => {
    const response = await api.post('/purchases', { eventId, quantity });
    return response.data.data;
  },

  getUserPurchases: async (): Promise<Purchase[]> => {
    const response = await api.get('/purchases/my-purchases');
    return response.data.data;
  },
};

export default { attendanceService, purchaseService };
