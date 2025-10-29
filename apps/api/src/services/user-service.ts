import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { db } from "../db/db";

interface CreateUserBody {
  username: string;
  dni: string;
  email: string;
  password: string;
}

export class UserService {
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

      const hashedPassword = await hash(body.password, 10);
      const newUser = await db.user.create({
        data: {
          ...body,
          password: hashedPassword
        }
      });

      return newUser;
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error(error instanceof Error ? error.message : "Error al crear usuario");
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
      console.error("Error al obtener usuario:", error);
      throw new Error("Error al obtener usuario");
    }
  }

  async addBalance(userId: number, amount: number) {
    try {
      if (amount <= 0) {
        throw new Error("El monto debe ser positivo");
      }

      const user = await this.getUserById(userId);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const updatedUser = await db.user.update({
        where: { id: userId },
        data: {
          balance: { increment: amount }
        }
      });

      return updatedUser;
    } catch (error) {
      console.error("Error al agregar saldo:", error);
      throw new Error("Error al agregar saldo");
    }
  }

  async getBalance(userId: number) {
    try {
      const user = await this.getUserById(userId);

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return user.balance ;
    } catch (error) {
      console.error("Error al obtener saldo:", error);
      throw new Error("Error al obtener el saldo");
    }
  }

  async getUserByUsername(username: string) {
    try {
      const user = await db.user.findFirst({
        where: {
          username,
          deletedAt: null
        },
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      return user;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      throw new Error("Usuario no encontrado");
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
      console.error("Error al eliminar usuario:", error);
      throw new Error("Error al eliminar el usuario");
    }
  }
}
