import { compare } from "bcrypt";
import { db } from "../db/db";

export class AuthService {
    
  async verifyLogin(email: string, password: string) {
    try {
      const user = await db.user.findFirst({
        where: { 
          email, 
          deletedAt: null 
        }
      });

      if (!user) {
        throw new Error(`usuario no existe`);
      }

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        throw new Error(`mail o contraseña incorrectos`);
      }

      return user;
    }
    catch (error) {
      console.error(error);
      throw new Error(`error al autenticar`);
    }
  }
}