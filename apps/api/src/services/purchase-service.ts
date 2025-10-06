import { db } from "../db/db";
import { Prisma } from '@prisma/client';

export class PurchaseService {
  async purchaseTickets(userId: number, eventId: number, quantity: number) {
    if (quantity <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    const event = await db.event.findUnique({
      where: { id: eventId }
    });

    if (!event) {
      throw new Error('Evento no encontrado');
    }

    if (!event.isPaid) {
      throw new Error('Este evento es gratuito, confirma asistencia en su lugar');
    }

    if (event.isCancelled) {
      throw new Error('No se pueden comprar entradas para un evento cancelado');
    }

    if (!event.price) {
      throw new Error('El evento no tiene precio configurado');
    }

    const totalAmount = new Prisma.Decimal(event.price.toString())
      .times(new Prisma.Decimal(quantity.toString()));

    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (new Prisma.Decimal(user.balance.toString()).lessThan(totalAmount)) {
      throw new Error('Saldo insuficiente');
    }

    // Realizar la compra en una transacción
    return await db.$transaction(async (tx) => {
      // Descontar del saldo
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: new Prisma.Decimal(user.balance.toString())
            .minus(totalAmount)
        }
      });

      // Crear la compra
      const purchase = await tx.purchase.create({
        data: {
          userId,
          eventId,
          quantity,
          totalAmount
        },
        include: {
          event: true
        }
      });

      return purchase;
    });
  }

  async getUserPurchases(userId: number) {
    return await db.purchase.findMany({
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
      },
      orderBy: { purchasedAt: 'desc' }
    });
  }
}