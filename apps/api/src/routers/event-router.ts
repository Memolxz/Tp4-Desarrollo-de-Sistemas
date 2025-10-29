import { Router } from 'express';
import multer from 'multer';
import { EventService } from '../services/event-service';
import { jwtAuthMiddleware } from '../middleware/auth-middleware';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // Límite de tamaño de archivo (5MB)
});
const eventService = new EventService();
export const eventRouter = Router();

const processImage = (file: Express.Multer.File | undefined) => {
  if (file) {
    return {
      imageBuffer: file.buffer,
      imageMimetype: file.mimetype
    };
  }
  return { imageBuffer: undefined, imageMimetype: undefined };
};

// auth
eventRouter.get('/user/my-events', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    const events = await eventService.getUserEvents(req.user.id);
    res.json({ ok: true, data: events });
  } catch (error) {
    res.status(401).json({ ok: false, error: (error as Error).message });
  }
});

// auth
eventRouter.get('/user/my-attendances', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    const events = await eventService.getUserAttendances(req.user.id);
    res.json({ ok: true, data: events });
  } catch (error) {
    res.status(401).json({ ok: false, error: (error as Error).message });
  }
});

// public
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

// public
eventRouter.get('/:id', async (req, res) => {
  try {
    const event = await eventService.getEventById(parseInt(req.params.id));
    res.json({ ok: true, data: event });
  } catch (error) {
    res.status(404).json({ ok: false, error: (error as Error).message });
  }
});

// auth
eventRouter.post('/', jwtAuthMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');

    const eventData = {
      ...req.body,
      creatorId: req.user.id,
      date: new Date(req.body.date),
      isPaid: req.body.isPaid === 'true' || req.body.isPaid === true, // <-- CAMBIO AQUÍ
      price: req.body.price ? parseFloat(req.body.price) : undefined
    };

    let { imageBuffer, imageMimetype } = processImage(req.file);

    const event = await eventService.createEvent(eventData, imageBuffer, imageMimetype);
    res.status(201).json({ ok: true, data: event });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// auth
eventRouter.put('/:id', jwtAuthMiddleware, upload.single('image'), async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');

    const updateData: any = { ...req.body };
    if (updateData.date) updateData.date = new Date(updateData.date);
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.isPaid !== undefined) { // <-- AGREGAR ESTO
      updateData.isPaid = updateData.isPaid === 'true' || updateData.isPaid === true;
    }

    let { imageBuffer, imageMimetype } = processImage(req.file);

    const event = await eventService.updateEvent(
      parseInt(req.params.id),
      req.user.id,
      updateData,
      imageBuffer,
      imageMimetype
    );
    res.json({ ok: true, data: event });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// auth
eventRouter.delete('/:id', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    await eventService.cancelEvent(parseInt(req.params.id), req.user.id);
    res.json({ ok: true });
  } catch (error) {
    res.status(403).json({ ok: false, error: (error as Error).message });
  }
});
