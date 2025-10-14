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

      return events.map(event => ({
        ...event,
        hasImage: !!event.imageData,
        imageUrl: event.imageData ? `/events/${event.id}/image` : null,
        imageData: undefined
      }));

    } catch (error) {
      console.error("Error al obtener eventos:", error);
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

      return {
        ...event,
        hasImage: !!event.imageData,
        imageUrl: event.imageData ? `/events/${event.id}/image` : null,
        imageData: undefined
      };
      
    } catch (error) {
      console.error("Error al obtener evento:", error);
      throw new Error("Error al obtener evento");
    }
  }

  async createEvent(data: CreateEventDTO, imageBuffer?: Buffer, imageMimetype?: string) {
    try {
      const eventDate = new Date(data.date);
      if (eventDate <= new Date()) {
        throw new Error("La fecha del evento debe ser en el futuro");
      }

      if (data.isPaid && (!data.price || data.price <= 0)) {
        throw new Error("Los eventos pagos deben tener un precio válido");
      }

      const eventData: any = { ...data };

      if (imageBuffer && imageMimetype) {
        eventData.imageData = imageBuffer;
        eventData.imageMimetype = imageMimetype;
      }

      const event = await db.event.create({
        data: eventData,
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

      if (!event.isPaid) {
        await db.attendance.create({
          data: {
            userId: data.creatorId,
            eventId: event.id
          }
        });
      }

      return {
        ...event,
        hasImage: !!event.imageData,
        imageUrl: event.imageData ? `/events/${event.id}/image` : null,
        imageData: undefined
      };

    } catch (error) {
      console.error("Error al crear evento:", error);
      throw new Error((error as any).message || "Error al crear el evento");
    }
  }

  async updateEvent(eventId: number, userId: number, data: Partial<CreateEventDTO>, imageBuffer?: Buffer, imageMimetype?: string) {
    try {
      const event = await db.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      if (event.creatorId !== userId) {
        throw new Error("Solo el creador puede modificar el evento");
      }

      if (event.isCancelled) {
        throw new Error("No se puede modificar un evento cancelado");
      }

      if (data.date) {
        const eventDate = new Date(data.date);
        if (eventDate <= new Date()) {
          throw new Error("La fecha del evento debe ser en el futuro");
        }
      }

      const updateData: any = { ...data };

      if (imageBuffer && imageMimetype) {
        updateData.imageData = imageBuffer;
        updateData.imageMimetype = imageMimetype;
      }

      const updatedEvent = await db.event.update({
        where: { id: eventId },
        data: updateData,
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

      return {
        ...updatedEvent,
        hasImage: !!updatedEvent.imageData,
        imageUrl: updatedEvent.imageData ? `/events/${updatedEvent.id}/image` : null,
        imageData: undefined
      };

    } catch (error) {
      console.error("Error al actualizar evento:", error);
      throw new Error((error as any).message || "Error al actualizar el evento");
    }
  }

  async cancelEvent(eventId: number, userId: number) {
    try {
      const event = await db.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

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

      await db.event.update({
        where: { id: eventId },
        data: { isCancelled: true }
      });

      return { ok: true };

    } catch (error) {
      console.error("Error al cancelar evento:", error);
      throw new Error((error as any).message || "Error al cancelar el evento");
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
        freeEvents: attendances.map(a => ({
          ...a.event,
          hasImage: !!a.event.imageData,
          imageUrl: a.event.imageData ? `/events/${a.event.id}/image` : null,
          imageData: undefined
        })),
        paidEvents: purchases.map(p => ({
          ...p.event,
          quantity: p.quantity,
          totalPaid: p.totalAmount,
          hasImage: !!p.event.imageData,
          imageUrl: p.event.imageData ? `/events/${p.event.id}/image` : null,
          imageData: undefined
        }))
      };

    } catch (error) {
      console.error("Error al obtener eventos del usuario:", error);
      throw new Error("Error al obtener eventos del usuario");
    }
  }
}
