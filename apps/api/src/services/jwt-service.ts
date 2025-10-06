import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

import { db } from "../db/db";

export class JwtService {
  async generateJsonWebAccessToken(user: User) {
    try {
      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1hr' })
      return token;
    } catch (error) {
      console.error(error);
      throw new Error(`Error al generar token JWT. Mira los logs para más información.`)
    }
  }

  async generateJsonWebRefreshToken(user: User) {
    try {
      const token = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
      return token;
    } catch (error) {
      console.error(error);
      throw new Error(`Error al generar token JWT. Mira los logs para más información.`)
    }
  }

  async generateJsonWebAccessTokenFromRefreshToken(refreshToken: string) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET) as { id: number };
      
      const user = await db.user.findUnique({
        where: {
          id: decoded.id,
          deletedAt: null
        }
      });
      
      if (!user) {
        throw new Error('Usuario no encontrado o inválido');
      }
      
      const newAccessToken = await this.generateJsonWebAccessToken(user);

      return { accessToken: newAccessToken };
    } catch (error) {
      console.error(error);
      throw new Error(`Error al refrescar token JWT. Mira los logs para más información.`)
    }
  }
}