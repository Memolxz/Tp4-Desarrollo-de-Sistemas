import { db } from "../db/db";
import { EventCategory, Prisma } from '@prisma/client';

interface CreateEventDTO {
  title: string;
  date: Date;
  shortDescription: string;
  fullDescription: string;
  location: string;
  images?: string[];
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

    return await db.event.findMany({
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
  }

  async getEventById(eventId: number) {
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
      throw new Error('Evento no encontrado');
    }

    return event;
  }

  async createEvent(data: CreateEventDTO) {
    if (data.isPaid && (!data.price || data.price <= 0)) {
      throw new Error('Los eventos pagos deben tener un precio válido');
    }

    const event = await db.event.create({
      data: {
        ...data,
        images: data.images || []
      },
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

    // Auto-confirmar asistencia del creador
    if (!event.isPaid) {
      await db.attendance.create({
        data: {
          userId: data.creatorId,
          eventId: event.id
        }
      });
    }

    return event;
  }

  async updateEvent(eventId: number, userId: number, data: Partial<CreateEventDTO>) {
    const event = await this.getEventById(eventId);

    if (event.creatorId !== userId) {
      throw new Error('Solo el creador puede modificar el evento');
    }

    if (event.isCancelled) {
      throw new Error('No se puede modificar un evento cancelado');
    }

    return await db.event.update({
      where: { id: eventId },
      data
    });
  }

  async cancelEvent(eventId: number, userId: number) {
    const event = await this.getEventById(eventId);

    if (event.creatorId !== userId) {
      throw new Error('Solo el creador puede cancelar el evento');
    }

    // Si es pago, devolver el dinero a los compradores
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

    return await db.event.update({
      where: { id: eventId },
      data: { isCancelled: true }
    });
  }

  async getUserEvents(userId: number) {
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
  }
}