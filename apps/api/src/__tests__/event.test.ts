import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { eventRouter } from '../routers/event-router';
import { registerRouter } from '../routers/register-router';
import { cleanDatabase, closeDatabase } from './setup';

const app = express();
app.use(express.json());
app.use('/register', registerRouter);
app.use('/events', eventRouter);

describe('Creación y Gestión de Eventos', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    await cleanDatabase();

    // Crear y autenticar un usuario para los tests
    const user = {
      username: 'organizador',
      email: 'organizador@example.com',
      dni: '12345678',
      password: 'password123',
    };

    const response = await request(app).post('/register').send(user);
    authToken = response.body.data.accessToken;

    // Decodificar el token para obtener el userId
    const payload = JSON.parse(
      Buffer.from(authToken.split('.')[1], 'base64').toString()
    );
    userId = payload.id;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /events - Crear Evento', () => {
    it('debe crear un evento gratuito exitosamente', async () => {
      const eventData = {
        title: 'Festival de Música',
        date: new Date(Date.now() + 86400000).toISOString(), // mañana
        shortDescription: 'Un gran festival',
        fullDescription: 'Descripción completa del festival',
        location: 'Buenos Aires',
        isPaid: false,
        category: 'FESTIVAL',
      };

      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('title', eventData.title);
      expect(response.body.data).toHaveProperty('isPaid', false);
      expect(response.body.data).toHaveProperty('creatorId', userId);
    });

    it('debe crear un evento pago con precio exitosamente', async () => {
      const eventData = {
        title: 'Concierto Premium',
        date: new Date(Date.now() + 86400000).toISOString(),
        shortDescription: 'Concierto exclusivo',
        fullDescription: 'Descripción completa del concierto',
        location: 'Teatro Colón',
        isPaid: true,
        price: 5000,
        category: 'RECITAL',
      };

      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('isPaid', true);
      expect(response.body.data).toHaveProperty('price');
      expect(parseFloat(response.body.data.price)).toBe(5000);
    });

    it('debe rechazar evento sin autenticación', async () => {
      const eventData = {
        title: 'Evento sin auth',
        date: new Date(Date.now() + 86400000).toISOString(),
        shortDescription: 'Descripción corta',
        fullDescription: 'Descripción completa',
        location: 'Buenos Aires',
        isPaid: false,
        category: 'FESTIVAL',
      };

      const response = await request(app)
        .post('/events')
        .send(eventData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar evento con fecha en el pasado', async () => {
      const eventData = {
        title: 'Evento Pasado',
        date: new Date(Date.now() - 86400000).toISOString(), // ayer
        shortDescription: 'Descripción corta',
        fullDescription: 'Descripción completa',
        location: 'Buenos Aires',
        isPaid: false,
        category: 'FESTIVAL',
      };

      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('futuro');
    });

    it('debe rechazar evento pago sin precio', async () => {
      const eventData = {
        title: 'Evento Pago Sin Precio',
        date: new Date(Date.now() + 86400000).toISOString(),
        shortDescription: 'Descripción corta',
        fullDescription: 'Descripción completa',
        location: 'Buenos Aires',
        isPaid: true,
        // No se incluye price
        category: 'RECITAL',
      };

      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('precio');
    });
  });

  describe('GET /events - Obtener Eventos', () => {
    beforeEach(async () => {
      // Crear varios eventos para filtrar
      const events = [
        {
          title: 'Festival Gratuito',
          date: new Date(Date.now() + 86400000).toISOString(),
          shortDescription: 'Festival',
          fullDescription: 'Descripción',
          location: 'Buenos Aires',
          isPaid: false,
          category: 'FESTIVAL',
        },
        {
          title: 'Recital Pago',
          date: new Date(Date.now() + 172800000).toISOString(),
          shortDescription: 'Recital',
          fullDescription: 'Descripción',
          location: 'Córdoba',
          isPaid: true,
          price: 3000,
          category: 'RECITAL',
        },
      ];

      for (const event of events) {
        await request(app)
          .post('/events')
          .set('Authorization', `Bearer ${authToken}`)
          .send(event);
      }
    });

    it('debe obtener todos los eventos', async () => {
      const response = await request(app).get('/events').expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThanOrEqual(2);
    });

    it('debe filtrar eventos por categoría', async () => {
      const response = await request(app)
        .get('/events?category=FESTIVAL')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      response.body.data.forEach((event: any) => {
        expect(event.category).toBe('FESTIVAL');
      });
    });

    it('debe filtrar eventos gratuitos', async () => {
      const response = await request(app)
        .get('/events?isPaid=false')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      response.body.data.forEach((event: any) => {
        expect(event.isPaid).toBe(false);
      });
    });

    it('debe filtrar eventos pagos', async () => {
      const response = await request(app)
        .get('/events?isPaid=true')
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      response.body.data.forEach((event: any) => {
        expect(event.isPaid).toBe(true);
      });
    });
  });

  describe('PUT /events/:id - Actualizar Evento', () => {
    let eventId: number;

    beforeEach(async () => {
      const eventData = {
        title: 'Evento Original',
        date: new Date(Date.now() + 86400000).toISOString(),
        shortDescription: 'Descripción original',
        fullDescription: 'Descripción completa',
        location: 'Buenos Aires',
        isPaid: false,
        category: 'FESTIVAL',
      };

      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData);

      eventId = response.body.data.id;
    });

    it('debe actualizar un evento exitosamente', async () => {
      const updateData = {
        title: 'Evento Actualizado',
        location: 'Córdoba',
      };

      const response = await request(app)
        .put(`/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('title', 'Evento Actualizado');
      expect(response.body.data).toHaveProperty('location', 'Córdoba');
    });

    it('debe rechazar actualización de evento de otro usuario', async () => {
      // Crear otro usuario
      const otherUser = {
        username: 'otrouser',
        email: 'otro@example.com',
        dni: '87654321',
        password: 'password123',
      };

      const otherUserResponse = await request(app)
        .post('/register')
        .send(otherUser);
      const otherToken = otherUserResponse.body.data.accessToken;

      const updateData = {
        title: 'Intento de actualización',
      };

      const response = await request(app)
        .put(`/events/${eventId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('creador');
    });
  });

  describe('DELETE /events/:id - Cancelar Evento', () => {
    it('debe cancelar un evento exitosamente', async () => {
      const eventData = {
        title: 'Evento a Cancelar',
        date: new Date(Date.now() + 86400000).toISOString(),
        shortDescription: 'Descripción',
        fullDescription: 'Descripción completa',
        location: 'Buenos Aires',
        isPaid: false,
        category: 'FESTIVAL',
      };

      const createResponse = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(eventData);

      const eventId = createResponse.body.data.id;

      const response = await request(app)
        .delete(`/events/${eventId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
    });
  });
});