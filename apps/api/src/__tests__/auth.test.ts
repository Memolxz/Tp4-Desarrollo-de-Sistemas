import { describe, it, expect, beforeEach, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { registerRouter } from '../routers/register-router';
import { loginRouter } from '../routers/login-router';
import { cleanDatabase, closeDatabase } from './setup';

const app = express();
app.use(express.json());
app.use('/register', registerRouter);
app.use('/login', loginRouter);

describe('Autenticación de Usuarios', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /register - Registro de Usuarios', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      const newUser = {
        username: 'juanperez',
        email: 'juan@example.com',
        dni: '12345678',
        password: 'password123',
      };

      const response = await request(app)
        .post('/register')
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(typeof response.body.data.accessToken).toBe('string');
      expect(typeof response.body.data.refreshToken).toBe('string');
    });

    it('debe rechazar registro con email duplicado', async () => {
      const user = {
        username: 'user1',
        email: 'duplicate@example.com',
        dni: '11111111',
        password: 'password123',
      };

      // Primer registro
      await request(app).post('/register').send(user).expect(201);

      // Intento de registro duplicado
      const duplicateUser = {
        username: 'user2',
        email: 'duplicate@example.com',
        dni: '22222222',
        password: 'password456',
      };

      const response = await request(app)
        .post('/register')
        .send(duplicateUser)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar registro con DNI duplicado', async () => {
      const user1 = {
        username: 'user1',
        email: 'user1@example.com',
        dni: '12345678',
        password: 'password123',
      };

      await request(app).post('/register').send(user1).expect(201);

      const user2 = {
        username: 'user2',
        email: 'user2@example.com',
        dni: '12345678', // DNI duplicado
        password: 'password456',
      };

      const response = await request(app)
        .post('/register')
        .send(user2)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('debe rechazar registro sin campos requeridos', async () => {
      const incompleteUser = {
        username: 'user1',
        email: 'user1@example.com',
        // falta dni y password
      };

      await request(app)
        .post('/register')
        .send(incompleteUser)
        .expect(500);
    });
  });

  describe('POST /login - Inicio de Sesión', () => {
    it('debe iniciar sesión con credenciales válidas', async () => {
      // Primero registrar un usuario
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        dni: '12345678',
        password: 'password123',
      };

      await request(app).post('/register').send(user).expect(201);

      // Intentar login
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
    });

    it('debe rechazar login con email inexistente', async () => {
      const loginData = {
        email: 'noexiste@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(500);

      expect(response.body).toHaveProperty('mensaje');
    });

    it('debe rechazar login con contraseña incorrecta', async () => {
      // Registrar usuario
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        dni: '12345678',
        password: 'password123',
      };

      await request(app).post('/register').send(user).expect(201);

      // Intentar login con contraseña incorrecta
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(500);

      expect(response.body).toHaveProperty('mensaje');
    });
  });

  describe('POST /login/refresh-token - Renovación de Token', () => {
    it('debe renovar el access token con un refresh token válido', async () => {
      // Registrar y obtener tokens
      const user = {
        username: 'testuser',
        email: 'test@example.com',
        dni: '12345678',
        password: 'password123',
      };

      const registerResponse = await request(app)
        .post('/register')
        .send(user)
        .expect(201);

      const refreshToken = registerResponse.body.data.refreshToken;

      // Usar refresh token
      const response = await request(app)
        .post('/login/refresh-token')
        .send({ refreshToken })
        .expect(201);

      expect(response.body).toHaveProperty('ok', true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(typeof response.body.data.accessToken).toBe('string');
    });

    it('debe rechazar refresh token inválido', async () => {
      const response = await request(app)
        .post('/login/refresh-token')
        .send({ refreshToken: 'invalid.token.here' })
        .expect(500);

      expect(response.body).toHaveProperty('ok', false);
    });
  });
});