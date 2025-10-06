import { hash } from 'bcrypt';
import { db } from "../db/db";
import { Prisma } from '@prisma/client';

interface CreateUserBody {
  username: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  password: string;
}

export class UserService {
  async getAllUsers() {
    return await db.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        dni: true,
        balance: true,
        createdAt: true,
      }
    });
  }

  async getUserById(userId: number) {
    const user = await db.user.findFirst({
      where: { id: userId, deletedAt: null }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async createUser(body: CreateUserBody) {
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          { username: body.username },
          { dni: body.dni }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Usuario, email o DNI ya registrado');
    }

    return await db.user.create({
      data: {
        ...body,
        password: await hash(body.password, 10)
      }
    });
  }

  async addBalance(userId: number, amount: number) {
    if (amount <= 0) {
      throw new Error('El monto debe ser positivo');
    }

    const user = await this.getUserById(userId);

    return await db.user.update({
      where: { id: userId },
      data: {
        balance: new Prisma.Decimal(user.balance.toString())
          .plus(new Prisma.Decimal(amount.toString()))
      }
    });
  }

  async getBalance(userId: number) {
    const user = await this.getUserById(userId);
    return { balance: user.balance };
  }

  async deleteUser(userId: number) {
    return await db.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() }
    });
  }
}