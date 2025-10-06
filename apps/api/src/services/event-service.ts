import { db } from "../db/db";
import { EventCategory, Prisma } from '@prisma/client';

interface CreateEventDTO {
  title: string;
  date: Date;
  shortDescription: string;
  fullDescription: string;
  location: string;
  isPaid: boolean;
  price?: number;
  category: EventCategory;
  creatorId: number;
}

interface EventFilters {
  category?: EventCategory;
  isPaid?: boolean;
  search?: string;
}

export class EventService {
  async getAllEvents(filters?: EventFilters) {
    try {
      const where: any = {
        isCancelled: false,
        date: { gte: new Date() }
      };

      if (filters?.category) {
        where.category = filters.category;
      }

      if (filters?.isPaid !== undefined) {
        where.isPaid = filters.isPaid;
      }

      if (filters?.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { shortDescription: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      const events = await db.event.findMany({
        where,
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              attendances: true,
              purchases: true
            }
          }
        },
        orderBy: { date: 'asc' }
      });

      return events;
    } catch (error) {
      console.error("Error al obtener eventos:", filters);
      console.error(error);
      throw new Error("Error al obtener los eventos");
    }
  }

  async getEventById(eventId: number) {
    try {
      const event = await db.event.findUnique({
        where: { id: eventId },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          },
          _count: {
            select: {
              attendances: true,
              purchases: true
            }
          }
        }
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      return event;
    } catch (error) {
      console.error(`Error al obtener el evento con ID ${eventId}`);
      console.error(error);
      throw new Error("Error al obtener evento");
    }
  }

  async createEvent(data: CreateEventDTO) {
    try {
      if (data.isPaid && (!data.price || data.price <= 0)) {
        throw new Error("Los eventos pagos deben tener un precio válido");
      }

      const event = await db.event.create({
        data: { ...data },
        include: {
          creator: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      // Auto-confirmar asistencia si es gratuito
      if (!event.isPaid) {
        await db.attendance.create({
          data: {
            userId: data.creatorId,
            eventId: event.id
          }
        });
      }

      return event;
    } catch (error) {
      console.error("Error al crear evento:", data);
      console.error(error);
      throw new Error("Error al crear el evento");
    }
  }

  async updateEvent(eventId: number, userId: number, data: Partial<CreateEventDTO>) {
    try {
      const event = await this.getEventById(eventId);

      if (event.creatorId !== userId) {
        throw new Error("Solo el creador puede modificar el evento");
      }

      if (event.isCancelled) {
        throw new Error("No se puede modificar un evento cancelado");
      }

      const updatedEvent = await db.event.update({
        where: { id: eventId },
        data
      });

      return updatedEvent;
    } catch (error) {
      console.error(`Error al actualizar evento ${eventId} por usuario ${userId}:`, data);
      console.error(error);
      throw new Error("Error al actualizar el evento");
    }
  }

  async cancelEvent(eventId: number, userId: number) {
    try {
      const event = await this.getEventById(eventId);

      if (event.creatorId !== userId) {
        throw new Error("Solo el creador puede cancelar el evento");
      }

      if (event.isPaid) {
        const purchases = await db.purchase.findMany({
          where: { eventId }
        });

        for (const purchase of purchases) {
          await db.user.update({
            where: { id: purchase.userId },
            data: {
              balance: {
                increment: purchase.totalAmount
              }
            }
          });
        }
      }

      const cancelledEvent = await db.event.update({
        where: { id: eventId },
        data: { isCancelled: true }
      });

      return cancelledEvent;
    } catch (error) {
      console.error(`Error al cancelar evento ${eventId} por usuario ${userId}`);
      console.error(error);
      throw new Error("Error al cancelar el evento");
    }
  }

  async getUserEvents(userId: number) {
    try {
      const [attendances, purchases] = await Promise.all([
        db.attendance.findMany({
          where: { userId },
          include: {
            event: {
              include: {
                creator: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        }),
        db.purchase.findMany({
          where: { userId },
          include: {
            event: {
              include: {
                creator: {
                  select: {
                    id: true,
                    username: true,
                    firstName: true,
                    lastName: true
                  }
                }
              }
            }
          }
        })
      ]);

      return {
        freeEvents: attendances.map(a => a.event),
        paidEvents: purchases.map(p => ({
          ...p.event,
          quantity: p.quantity,
          totalPaid: p.totalAmount
        }))
      };
    } catch (error) {
      console.error(`Error al obtener eventos del usuario ${userId}`);
      console.error(error);
      throw new Error("Error al obtener eventos del usuario");
    }
  }
}
