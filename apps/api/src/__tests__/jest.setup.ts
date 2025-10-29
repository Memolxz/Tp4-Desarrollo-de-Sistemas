import { config } from 'dotenv';
import { resolve } from 'path';

// Cargar variables de entorno de test ANTES de cualquier otra cosa
config({ path: resolve(__dirname, '../../.env.test') });

// Verificar que estamos usando la DB de test
if (!process.env.DATABASE_URL?.includes('test')) {
  throw new Error('Tests must use test database! Check .env.test file');
}

console.log('🔧 Using test database:', process.env.DATABASE_URL);