import { Prisma } from '@prisma/client';

import { db } from "../db/db";

export class PurchaseService {
  async purchaseTickets(userId: number, eventId: number, quantity: number) {
    try {
      if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }

      const event = await db.event.findUnique({
        where: { id: eventId }
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      if (!event.isPaid) {
        throw new Error("Este evento es gratuito, confirma asistencia en su lugar");
      }

      if (event.isCancelled) {
        throw new Error("No se pueden comprar entradas para un evento cancelado");
      }

      if (!event.price) {
        throw new Error("El evento no tiene precio configurado");
      }

      const totalAmount = new Prisma.Decimal(event.price.toString())
        .times(new Prisma.Decimal(quantity.toString()));

      const user = await db.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error("Usuario no encontrado");
      }

      const userBalance = new Prisma.Decimal(user.balance.toString());

      if (userBalance.lessThan(totalAmount)) {
        throw new Error("Saldo insuficiente");
      }

      const purchase = await db.$transaction(async (tx) => {
        // Descontar saldo del usuario
        await tx.user.update({
          where: { id: userId },
          data: {
            balance: userBalance.minus(totalAmount)
          }
        });

        // Registrar la compra
        const createdPurchase = await tx.purchase.create({
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

        return createdPurchase;
      });

      return purchase;
    } catch (error) {
      console.error("Error al realizar la compra:", { userId, eventId, quantity });
      console.error(error);
      throw new Error("Error al procesar la compra de entradas");
    }
  }

  async getUserPurchases(userId: number) {
    try {
      const purchases = await db.purchase.findMany({
        where: { userId },
        include: {
          event: {
            include: {
              creator: {
                select: {
                  id: true,
                  username: true,
                }
              }
            }
          }
        },
        orderBy: { purchasedAt: "desc" }
      });

      return purchases;
    } catch (error) {
      console.error("Error al obtener las compras del usuario:", { userId });
      console.error(error);
      throw new Error("Error al obtener compras del usuario");
    }
  }
}
