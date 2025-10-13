import { Router } from 'express';
import multer from 'multer';
import { jwtAuthMiddleware } from '../middleware/auth-middleware';
import { db } from '../db/db';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }  // Limita el tamaño de la imagen a 5MB
});

export const imageRouter = Router();

const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// **Subir/Actualizar Imagen de Evento**
imageRouter.post('/:id/image', jwtAuthMiddleware, upload.single('image'), async (req, res) => {
  try {
    // Verifica si el usuario está autenticado
    if (!req.user) throw new Error('No autenticado');

    // Verifica si se proporcionó una imagen
    if (!req.file) throw new Error('No se proporcionó imagen');

    // Verifica que el tipo de la imagen sea válido
    if (!validImageTypes.includes(req.file.mimetype)) {
      throw new Error('Formato de imagen no válido');
    }

    const eventId = parseInt(req.params.id);
    const event = await db.event.findUnique({ where: { id: eventId } });

    if (!event) throw new Error('Evento no encontrado');
    if (event.creatorId !== req.user.id) throw new Error('Solo el creador puede actualizar la imagen');

    // Actualiza la imagen en la base de datos
    const updatedEvent = await db.event.update({
      where: { id: eventId },
      data: {
        imageData: req.file.buffer,     // La imagen se guarda en formato binario
        imageMimetype: req.file.mimetype
      }
    });

    res.json({
      ok: true,
      data: {
        eventId: updatedEvent.id,
        hasImage: true,
        imageUrl: `/events/${updatedEvent.id}/image`
      }
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// **Descargar Imagen de Evento**
imageRouter.get('/:id/image', async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await db.event.findUnique({
      where: { id: eventId }
    });

    if (!event || !event.imageData) {
      return res.status(404).json({ ok: false, error: 'Imagen no encontrada' });
    }

    // Establece el tipo de contenido según el mimetype de la imagen
    res.type(event.imageMimetype || 'image/jpeg');
    res.send(event.imageData);
  } catch (error) {
    res.status(500).json({ ok: false, error: (error as Error).message });
  }
});

// **Eliminar Imagen de Evento**
imageRouter.delete('/:id/image', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');

    const eventId = parseInt(req.params.id);
    const event = await db.event.findUnique({ where: { id: eventId } });

    if (!event) throw new Error('Evento no encontrado');
    if (event.creatorId !== req.user.id) throw new Error('Solo el creador puede eliminar la imagen');

    // Elimina la imagen del evento
    await db.event.update({
      where: { id: eventId },
      data: {
        imageData: null,
        imageMimetype: null
      }
    });

    res.json({
      ok: true,
      data: {
        eventId,
        hasImage: false
      }
    });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});