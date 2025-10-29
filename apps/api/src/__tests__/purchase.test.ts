import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { eventRouter } from '../routers/event-router';
import { purchaseRouter } from '../routers/purchase-router';
import { userRouter } from '../routers/user-router';
import { registerRouter } from '../routers/register-router';
import { cleanDatabase, closeDatabase } from './setup';

const app = express();
app.use(express.json());
app.use('/register', registerRouter);
app.use('/events', eventRouter);
app.use('/purchases', purchaseRouter);
app.use('/users', userRouter);

describe('Compra de Entradas para Eventos Pagos', () => {
  let organizadorToken: string;
  let compradorToken: string;
  let eventoPagoId: number;
  const precioEntrada = 1000;

  beforeEach(async () => {
    await cleanDatabase();

    // Crear organizador con email único
    const organizador = {
      username: 'organizador',
      email: `organizador-${Date.now()}@example.com`,
      dni: '12345678',
      password: 'password123',
    };
    const orgResponse = await request(app).post('/register').send(organizador);
    
    expect(orgResponse.status).toBe(201);
    expect(orgResponse.body.data).toHaveProperty('accessToken');
    organizadorToken = orgResponse.body.data.accessToken;

    // Crear comprador con saldo suficiente y email único
    const comprador = {
      username: 'comprador',
      email: `comprador-${Date.now()}@example.com`,
      dni: '87654321',
      password: 'password123',
    };
    const compResponse = await request(app).post('/register').send(comprador);
    
    expect(compResponse.status).toBe(201);
    expect(compResponse.body.data).toHaveProperty('accessToken');
    compradorToken = compResponse.body.data.accessToken;

    // Cargar saldo al comprador
    await request(app)
      .post('/users/balance')
      .set('Authorization', `Bearer ${compradorToken}`)
      .send({ amount: 5000 });

    // Crear evento pago
    const eventoPago = {
      title: 'Concierto Premium',
      date: new Date(Date.now() + 86400000).toISOString(),
      shortDescription: 'Concierto exclusivo',
      fullDescription: 'Descripción completa del concierto',
      location: 'Teatro Colón',
      isPaid: true,
      price: precioEntrada,
      category: 'RECITAL',
    };

    const eventResponse = await request(app)
      .post('/events')
      .set('Authorization', `Bearer ${organizadorToken}`)
      .send(eventoPago);

    expect(eventResponse.status).toBe(201);
    expect(eventResponse.body.data).toHaveProperty('id');
    eventoPagoId = eventResponse.body.data.id;
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /purchases - Comprar Entradas', () => {
    it('debe comprar una entrada exitosamente', async () => {
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 1,
      };

      const response = await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('eventId', eventoPagoId);
      expect(response.body.data).toHaveProperty('quantity', 1);
      expect(parseFloat(response.body.data.totalAmount)).toBe(precioEntrada);
    });

    it('debe comprar múltiples entradas exitosamente', async () => {
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 3,
      };

      const response = await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('quantity', 3);
      expect(parseFloat(response.body.data.totalAmount)).toBe(precioEntrada * 3);
    });

    it('debe descontar el saldo correctamente después de la compra', async () => {
      // Obtener saldo inicial
      const balanceBefore = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${compradorToken}`);

      const saldoInicial = parseFloat(balanceBefore.body.data);

      // Realizar compra
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 2,
      };

      await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData)
        .expect(201);

      // Verificar saldo final
      const balanceAfter = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${compradorToken}`);

      const saldoFinal = parseFloat(balanceAfter.body.data);
      const totalCompra = precioEntrada * 2;

      expect(saldoFinal).toBe(saldoInicial - totalCompra);
    });

    it('debe rechazar compra con saldo insuficiente', async () => {
      // Crear usuario con poco saldo y email único
      const usuarioPobre = {
        username: 'pobre',
        email: `pobre-${Date.now()}@example.com`,
        dni: '11111111',
        password: 'password123',
      };
      const pobreResponse = await request(app)
        .post('/register')
        .send(usuarioPobre);
      const pobreToken = pobreResponse.body.data.accessToken;

      // Cargar poco saldo (menos del precio de la entrada)
      await request(app)
        .post('/users/balance')
        .set('Authorization', `Bearer ${pobreToken}`)
        .send({ amount: 500 });

      // Intentar compra
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 1,
      };

      const response = await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${pobreToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Saldo insuficiente');
    });

    it('debe rechazar compra sin autenticación', async () => {
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 1,
      };

      const response = await request(app)
        .post('/purchases')
        .send(purchaseData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar compra con cantidad inválida', async () => {
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 0,
      };

      const response = await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('cantidad');
    });

    it('debe rechazar compra de evento gratuito', async () => {
      // Crear evento gratuito
      const eventoGratis = {
        title: 'Evento Gratis',
        date: new Date(Date.now() + 86400000).toISOString(),
        shortDescription: 'Evento sin costo',
        fullDescription: 'Descripción completa',
        location: 'Parque',
        isPaid: false,
        category: 'FESTIVAL',
      };

      const eventResponse = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${organizadorToken}`)
        .send(eventoGratis);

      const eventoGratisId = eventResponse.body.data.id;

      // Intentar compra
      const purchaseData = {
        eventId: eventoGratisId,
        quantity: 1,
      };

      const response = await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /purchases/my-purchases - Obtener Mis Compras', () => {
    beforeEach(async () => {
      // Realizar una compra antes de cada test
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 2,
      };

      await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData);
    });

    it('debe obtener el historial de compras', async () => {
      const response = await request(app)
        .get('/purchases/my-purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('ok', true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('eventId', eventoPagoId);
      expect(response.body.data[0]).toHaveProperty('quantity', 2);
    });

    it('debe rechazar acceso sin autenticación', async () => {
      const response = await request(app)
        .get('/purchases/my-purchases')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Creación automática de asistencia', () => {
    it('debe crear asistencia automáticamente al comprar entrada', async () => {
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 1,
      };

      // Realizar compra
      await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData)
        .expect(201);

      // Verificar que el evento aparece en las asistencias del usuario
      const attendancesResponse = await request(app)
        .get('/events/user/my-attendances')
        .set('Authorization', `Bearer ${compradorToken}`)
        .expect(200);

      expect(attendancesResponse.body.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: eventoPagoId,
          }),
        ])
      );
    });
  });

  describe('Incremento del contador de compras', () => {
    it('debe incrementar el contador de compras del evento', async () => {
      // Obtener evento antes de la compra
      const beforeResponse = await request(app)
        .get(`/events/${eventoPagoId}`)
        .expect(200);

      const initialCount = beforeResponse.body.data._count?.purchases || 0;

      // Realizar compra
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 1,
      };

      await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData)
        .expect(201);

      // Obtener evento después de la compra
      const afterResponse = await request(app)
        .get(`/events/${eventoPagoId}`)
        .expect(200);

      const finalCount = afterResponse.body.data._count?.purchases || 0;

      expect(finalCount).toBe(initialCount + 1);
    });
  });

  describe('Reembolso por cancelación de evento', () => {
    it('debe reembolsar el dinero al cancelar un evento pago', async () => {
      // Realizar compra
      const purchaseData = {
        eventId: eventoPagoId,
        quantity: 2,
      };

      await request(app)
        .post('/purchases')
        .set('Authorization', `Bearer ${compradorToken}`)
        .send(purchaseData);

      const totalCompra = precioEntrada * 2;

      // Obtener saldo después de la compra
      const balanceAfterPurchase = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${compradorToken}`);

      const saldoDespuesCompra = parseFloat(balanceAfterPurchase.body.data);

      // Cancelar evento (como organizador)
      await request(app)
        .delete(`/events/${eventoPagoId}`)
        .set('Authorization', `Bearer ${organizadorToken}`)
        .expect(200);

      // Verificar que el saldo fue reembolsado
      const balanceAfterCancel = await request(app)
        .get('/users/balance')
        .set('Authorization', `Bearer ${compradorToken}`);

      const saldoDespuesReembolso = parseFloat(balanceAfterCancel.body.data);

      expect(saldoDespuesReembolso).toBe(saldoDespuesCompra + totalCompra);
    });
  });
});