import api from './api';

export interface Event {
  id: number;
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  isPaid: boolean;
  price?: number;
  category: string;
  isCancelled: boolean;
  creatorId: number;
  imageData?: ArrayBuffer | null;
  imageMimetype?: string;
  hasImage?: boolean;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    username: string;
  };
  _count?: {
    attendances: number;
    purchases: number;
  };
}

export interface EventFilters {
  category?: string;
  isPaid?: boolean;
  search?: string;
}

export interface CreateEventData {
  title: string;
  date: string;
  shortDescription: string;
  fullDescription: string;
  location: string;
  isPaid: boolean;
  price?: number;
  category: string;
}

export interface EventImageResponse {
  eventId: number;
  hasImage: boolean;
  imageUrl?: string;
}

export const eventService = {
  getAllEvents: async (filters?: EventFilters): Promise<Event[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.isPaid !== undefined) params.append('isPaid', String(filters.isPaid));
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get(`/events?${params.toString()}`);
    return response.data.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data.data;
  },

  getUserEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/user/my-events');
    return response.data.data;
  },

  getUserAttendances: async (): Promise<Event[]> => {
    const response = await api.get('/events/user/my-attendances');
    return response.data.data;
  },

  createEvent: async (data: CreateEventData, imageFile?: File): Promise<Event> => {
    const formData = new FormData();
   
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  updateEvent: async (id: number, data: Partial<CreateEventData>, imageFile?: File): Promise<Event> => {
    const formData = new FormData();
   
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await api.put(`/events/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  cancelEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  uploadEventImage: async (eventId: number, imageFile: File): Promise<EventImageResponse> => {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await api.post(`/events/${eventId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  getEventImageUrl: (eventId: number): string => {
    return `http://localhost:8000/events/${eventId}/image`;
  },

  deleteEventImage: async (eventId: number): Promise<void> => {
    await api.delete(`/events/${eventId}/image`);
  },
};

export default eventService;