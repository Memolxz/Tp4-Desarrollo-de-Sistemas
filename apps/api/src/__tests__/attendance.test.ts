import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { eventRouter } from '../routers/event-router';
import { attendanceRouter } from '../routers/attendance-router';
import { registerRouter } from '../routers/register-router';
import { cleanDatabase, closeDatabase } from './setup';

const app = express();
app.use(express.json());
app.use('/register', registerRouter);
app.use('/events', eventRouter);
app.use('/attendance', attendanceRouter);

describe('Confirmación de Asistencia a Eventos Gratuitos', () => {
  let organizadorToken: string;
  let asistenteToken: string;
  let eventId: number;

  beforeEach(async () => {
    await cleanDatabase();

    // Crear organizador
    const organizador = {
      username: 'organizador',
      email: 'organizador@example.com',
      dni: '12345678',
      password: 'password123',
    };
    const orgResponse = await request(app).post('/register').send(organizador);
    organizadorToken = orgResponse.body.data.accessToken;

    // Crear asistente
    const asistente = {
      username: 'asistente',
      email: 'asistente@example.com',
      dni: '87654321',
      password: 'password123',
    };
    const asisResponse = await request(app).post('/register').send(asistente);
    asistenteToken = asisResponse.body.data.accessToken;

    // Crear evento gratuito
    const eventData = {
      title: 'Festival Gratuito',
      date: new Date(Date.now() + 86400000).toISOString(),
      shortDescription: 'Festival abierto',
      fullDescription: 'Descripción completa',
      location: 'Parque Centenario',
      isPaid: false,
      category: 'FESTIVAL',
    };

    const eventResponse = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizadorToken}`)
      .send(eventData);

    eventId = eventResponse.body.data.id;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /attendance/:eventId - Confirmar Asistencia', () => {
    it('debe confirmar asistencia a evento gratuito exitosamente', async () => {
      const response = await request(app)
        .post(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('eventId', eventId);
    });

    it('debe rechazar confirmación sin autenticación', async () => {
      const response = await request(app)
        .post(`/attendance/${eventId}`)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar confirmación duplicada', async () => {
      // Primera confirmación
      await request(app)
        .post(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(201);

      // Intento de confirmación duplicada
      const response = await request(app)
        .post(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('confirmaste asistencia');
    });

    it('debe rechazar confirmación a evento que no existe', async () => {
      const response = await request(app)
        .post('/attendance/99999')
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar confirmación a evento pago', async () => {
      // Crear evento pago
      const eventoPago = {
        title: 'Evento Pago',
        date: new Date(Date.now() + 86400000).toISOString(),
        shortDescription: 'Evento con costo',
        fullDescription: 'Descripción completa',
        location: 'Teatro',
        isPaid: true,
        price: 1000,
        category: 'RECITAL',
      };

      const eventResponse = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${organizadorToken}`)
        .send(eventoPago);

      const eventoPagoId = eventResponse.body.data.id;

      const response = await request(app)
        .post(`/attendance/${eventoPagoId}`)
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /attendance/:eventId - Cancelar Asistencia', () => {
    beforeEach(async () => {
      // Confirmar asistencia antes de cada test
      await request(app)
        .post(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`);
    });

    it('debe cancelar asistencia exitosamente', async () => {
      const response = await request(app)
        .delete(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
    });

    it('debe rechazar cancelación sin confirmación previa', async () => {
      // Primero cancelar la asistencia
      await request(app)
        .delete(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`);

      // Intentar cancelar nuevamente
      const response = await request(app)
        .delete(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('asistencia confirmada');
    });

    it('debe rechazar que el creador cancele su asistencia', async () => {
      const response = await request(app)
        .delete(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${organizadorToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('creador');
    });
  });

  describe('Verificación de contador de asistentes', () => {
    it('debe incrementar el contador al confirmar asistencia', async () => {
      // Obtener evento antes de confirmar
      const beforeResponse = await request(app)
        .get(`/events/${eventId}`)
        .expect(200);

      const initialCount = beforeResponse.body.data._count?.attendances || 0;

      // Confirmar asistencia
      await request(app)
        .post(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`)
        .expect(201);

      // Obtener evento después de confirmar
      const afterResponse = await request(app)
        .get(`/events/${eventId}`)
        .expect(200);

      const finalCount = afterResponse.body.data._count?.attendances || 0;

      expect(finalCount).toBe(initialCount + 1);
    });

    it('debe decrementar el contador al cancelar asistencia', async () => {
      // Confirmar asistencia
      await request(app)
        .post(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`);

      // Obtener contador actual
      const beforeResponse = await request(app)
        .get(`/events/${eventId}`)
        .expect(200);

      const initialCount = beforeResponse.body.data._count?.attendances || 0;

      // Cancelar asistencia
      await request(app)
        .delete(`/attendance/${eventId}`)
        .set('Authorization', `Bearer ${asistenteToken}`);

      // Verificar contador
      const afterResponse = await request(app)
        .get(`/events/${eventId}`)
        .expect(200);

      const finalCount = afterResponse.body.data._count?.attendances || 0;

      expect(finalCount).toBe(initialCount - 1);
    });
  });
});