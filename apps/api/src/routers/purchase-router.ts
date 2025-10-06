import { Router } from 'express';
import { PurchaseService } from '../services/purchase-service';
import { jwtAuthMiddleware } from '../middleware/auth-middleware';

const purchaseService = new PurchaseService();
export const purchaseRouter = Router();

// Comprar entradas
purchaseRouter.post('/', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const { eventId, quantity } = req.body;
    const purchase = await purchaseService.purchaseTickets(
      req.user.id,
      eventId,
      quantity
    );
    res.status(201).json({ ok: true, data: purchase });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// Ver mis compras
purchaseRouter.get('/my-purchases', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const purchases = await purchaseService.getUserPurchases(req.user.id);
    res.json({ ok: true, data: purchases });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});