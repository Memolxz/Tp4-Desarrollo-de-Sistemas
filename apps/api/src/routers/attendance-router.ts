import { Router } from 'express';
import { AttendanceService } from '../services/attendance-service';
import { jwtAuthMiddleware } from '../middleware/auth-middleware';

const attendanceService = new AttendanceService();
export const attendanceRouter = Router();

// Confirmar asistencia
attendanceRouter.post('/:eventId', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    const attendance = await attendanceService.confirmAttendance(
      req.user.id,
      parseInt(req.params.eventId)
    );
    res.status(201).json({ ok: true, data: attendance });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});

// Cancelar asistencia
attendanceRouter.delete('/:eventId', jwtAuthMiddleware, async (req, res) => {
  try {
    if (!req.user) throw new Error('No autenticado');
    
    await attendanceService.cancelAttendance(
      req.user.id,
      parseInt(req.params.eventId)
    );
    res.json({ ok: true });
  } catch (error) {
    res.status(400).json({ ok: false, error: (error as Error).message });
  }
});