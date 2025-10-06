import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';

import { db } from "../db/db";

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
    try {
      const users = await db.user.findMany({
        where: { deletedAt: null }
      });

      return users;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener usuarios");
    }
  }

  async getUserById(userId: number) {
    try {
      const user = await db.user.findFirst({
        where: { id: userId, deletedAt: null }
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener usuario");
    }
  }

  async createUser(body: CreateUserBody) {
    try {
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
        throw new Error("Usuario, email o DNI ya registrado");
      }

      const newUser = await db.user.create({
        data: {
          ...body,
          password: await hash(body.password, 10)
        }
      });

      return newUser;
    } catch (error) {
      console.error("Error al crear usuario:", body);
      console.error(error);
      throw new Error("Error al crear usuario");
    }
  }

  async addBalance(userId: number, amount: number) {
    try {
      if (amount <= 0) {
        throw new Error("El monto debe ser positivo");
      }

      const user = await this.getUserById(userId);

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          balance: new Prisma.Decimal(user.balance.toString())
            .plus(new Prisma.Decimal(amount.toString()))
        }
      });

      return updatedUser;
    } catch (error) {
      console.error(error);
      throw new Error("Error al agregar saldo");
    }
  }

  async getBalance(userId: number) {
    try {
      const user = await this.getUserById(userId);
      return { balance: user.balance };
    } catch (error) {
      console.error(error);
      throw new Error("Error al obtener el saldo");
    }
  }

  async deleteUser(userId: number) {
    try {
      const deletedUser = await db.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() }
      });

      return deletedUser;
    } catch (error) {
      console.error(error);
      throw new Error("Error al eliminar el usuario");
    }
  }
}
