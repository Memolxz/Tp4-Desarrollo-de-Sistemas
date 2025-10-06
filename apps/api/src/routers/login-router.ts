import { Router, Request, Response } from 'express';

import { AuthService } from "../services/auth-service";
import { JwtService } from "../services/jwt-service";

const authService = new AuthService();
const jwtService = new JwtService();

export const loginRouter = Router();

loginRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ mensaje: 'email y contraseña son requeridos' });
    }

    const user = await authService.verifyLogin(email, password);

    const accessToken = await jwtService.generateJsonWebAccessToken(user);
    const refreshToken = await jwtService.generateJsonWebRefreshToken(user);
    res.status(201).json({ ok: true, data: { accessToken, refreshToken } }); 

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ mensaje: 'Error en el servidor al procesar el login' });
  }
});

loginRouter.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const { accessToken: newAccessToken } = await jwtService.generateJsonWebAccessTokenFromRefreshToken(refreshToken);
    res.status(201).json({ ok: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as any).message })
  }
})

export default loginRouter;