import { db } from '../db/db';

// Verificar que estamos usando la DB de test
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl?.includes('test')) {
  throw new Error(
    `⚠️  DANGER: Not using test database!\n` +
    `Current DATABASE_URL: ${databaseUrl}\n` +
    `Make sure .env.test is being loaded correctly.`
  );
}

// Limpiar la base de datos antes de cada test
export const cleanDatabase = async () => {
  console.log('🧹 Cleaning test database...');
  try {
    await db.purchase.deleteMany();
    await db.attendance.deleteMany();
    await db.event.deleteMany();
    await db.user.deleteMany();
    console.log('✅ Database cleaned successfully');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
    throw error;
  }
};

// Cerrar conexión después de todos los tests
export const closeDatabase = async () => {
  console.log('🔌 Closing database connection...');
  await db.$disconnect();
  console.log('✅ Database connection closed');
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