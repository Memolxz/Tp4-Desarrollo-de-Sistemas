import { db } from "../db/db";

export class AttendanceService {
  async confirmAttendance(userId: number, eventId: number) {
    try {
      const event = await db.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      if (event.isPaid) {
        throw new Error("Este evento requiere compra de entradas");
      }

      if (event.isCancelled) {
        throw new Error("No se puede asistir a un evento cancelado");
      }

      const existing = await db.attendance.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        }
      });

      if (existing) {
        throw new Error("Ya confirmaste asistencia a este evento");
      }

      const attendance = await db.attendance.create({
        data: { userId, eventId }
      });

      return attendance;
    } catch (error) {
      console.error(`Error al confirmar asistencia (user: ${userId}, event: ${eventId})`);
      console.error(error);
      throw new Error("Error al confirmar asistencia");
    }
  }

  async cancelAttendance(userId: number, eventId: number) {
    try {
      const event = await db.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      if (event.creatorId === userId) {
        throw new Error("El creador no puede cancelar su asistencia");
      }

      const attendance = await db.attendance.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        }
      });

      if (!attendance) {
        throw new Error("No tienes asistencia confirmada para este evento");
      }

      const deletedAttendance = await db.attendance.delete({
        where: {
          userId_eventId: {
            userId,
            eventId
          }
        }
      });

      return deletedAttendance;
    } catch (error) {
      console.error(`Error al cancelar asistencia (user: ${userId}, event: ${eventId})`);
      console.error(error);
      throw new Error("Error al cancelar asistencia");
    }
  }
}
