import { Router } from 'express';
import { UserService } from '../services/user-service';
import { jwtAuthMiddleware } from '../middleware/auth-middleware';

const userService = new UserService();
export const userRouter = Router();

// Autenticado: obtener perfil
userRouter.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const user = await userService.getUserById(req.user.id);
    const { password, ...userWithoutPassword } = user;
    res.json({ ok: true, data: userWithoutPassword });
  } catch (error) {
    res.status(404).json({ ok: false, error: (error as Error).message });
  }
});

// Autenticado: cargar saldo
userRouter.post('/balance', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const { amount } = req.body;
    const user = await userService.addBalance(req.user.id, parseFloat(amount));
    res.json({ ok: true, data: { balance: user.balance } });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// Autenticado: consultar saldo
userRouter.get('/balance', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const balance = await userService.getBalance(req.user.id);
    res.json({ ok: true, data: balance });
  } catch (error) {
    res.status(404).json({ ok: false, error: (error as Error).message });
  }
});