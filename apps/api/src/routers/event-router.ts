import { Router } from 'express';
import { EventService } from '../services/event-service';
import { jwtAuthMiddleware } from '../middleware/auth-middleware';

const eventService = new EventService();
export const eventRouter = Router();

// Público: listar eventos con filtros
eventRouter.get('/', async (req, res) => {
  try {
    const filters = {
      category: req.query.category as any,
      isPaid: req.query.isPaid ? req.query.isPaid === 'true' : undefined,
      search: req.query.search as string
    };

    const events = await eventService.getAllEvents(filters);
    res.json({ ok: true, data: events });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

// Público: detalle de evento
eventRouter.get('/:id', async (req, res) => {
  try {
    const event = await eventService.getEventById(parseInt(req.params.id));
    res.json({ ok: true, data: event });
  } catch (error) {
    res.status(404).json({ ok: false, error: (error as Error).message });
  }
});

// Autenticado: crear evento
eventRouter.post('/', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const event = await eventService.createEvent({
      ...req.body,
      creatorId: req.user.id
    });
    res.status(201).json({ ok: true, data: event });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// Autenticado: modificar evento
eventRouter.put('/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const event = await eventService.updateEvent(
      parseInt(req.params.id),
      req.user.id,
      req.body
    );
    res.json({ ok: true, data: event });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// Autenticado: cancelar evento
eventRouter.delete('/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    await eventService.cancelEvent(parseInt(req.params.id), req.user.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(403).json({ ok: false, error: (error as Error).message });
  }
});

// Autenticado: mis eventos
eventRouter.get('/user/my-events', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const events = await eventService.getUserEvents(req.user.id);
    res.json({ ok: true, data: events });
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});