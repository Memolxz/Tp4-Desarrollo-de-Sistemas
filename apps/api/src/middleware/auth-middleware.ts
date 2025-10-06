import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import { User } from '@prisma/client'

export const jwtAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: "No hay token!" })
    return;
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET) as User;

    if (!decodedUser.id || !decodedUser.email) {
      throw new Error("Token invalido!")
    }

    req.user = decodedUser;
    next();
  } catch (error) {
    res.status(403).json({ error: (error as Error).message })
  }
}

// check
export const isAdminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: "No hay token!" })
    return;
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET) as User;

    if (!decodedUser.id || !decodedUser.email) {
      throw new Error("Token invalido!")
    }

    req.user = decodedUser;

    if (decodedUser.isAdmin) {
      next();
    } else {
      res.status(403).json({ error: "Acceso denegado: No eres administrador." });
    }
  } catch (error) {
    res.status(403).json({ error: (error as Error).message })
  }
}