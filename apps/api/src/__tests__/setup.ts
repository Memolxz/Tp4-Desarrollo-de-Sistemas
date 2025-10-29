import { db } from '../db/db';

// Limpiar la base de datos antes de cada test
export const cleanDatabase = async () => {
  await db.purchase.deleteMany();
  await db.attendance.deleteMany();
  await db.event.deleteMany();
  await db.user.deleteMany();
};

// Cerrar conexión después de todos los tests
export const closeDatabase = async () => {
  await db.$disconnect();
};

// Helper para crear un usuario de prueba
export const createTestUser = async (overrides = {}) => {
  const defaultUser = {
    username: 'testuser',
    email: 'test@example.com',
    dni: '12345678',
    password: '$2b$10$test.hashed.password', // hash de "password123"
    balance: 1000,
    ...overrides,
  };

  return await db.user.create({
    data: defaultUser,
  });
};

// Helper para crear un evento de prueba
export const createTestEvent = async (creatorId: number, overrides = {}) => {
  const defaultEvent = {
    title: 'Test Event',
    date: new Date(Date.now() + 86400000), // mañana
    shortDescription: 'Test description',
    fullDescription: 'Test full description',
    location: 'Test Location',
    isPaid: false,
    category: 'FESTIVAL' as any,
    creatorId,
    ...overrides,
  };

  return await db.event.create({
    data: defaultEvent,
  });
};