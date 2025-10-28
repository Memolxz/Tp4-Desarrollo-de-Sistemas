import { Prisma } from '@prisma/client';

import { db } from "../db/db";

export class PurchaseService {
  async purchaseTickets(userId: number, eventId: number, quantity: number) {
    try {
      if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }

      const event = await db.event.findUnique({
        where: { 
          id: eventId,
          isPaid: true,
          isCancelled: false
         },
      });

      if (!event) {
        throw new Error("Evento no encontrado");
      }

      const user = await db.user.findUnique({
        where: { id: userId },
      })

      if (!user) {
        throw new Error("usuario no existe")
      }

      const totalAmount = Number(event.price) * quantity;

      if (Number(user.balance) < totalAmount) {
        throw new Error("Saldo insuficiente");
      }

      const purchase = await db.$transaction(async (tx: Prisma.TransactionClient) => {
        // Descontar saldo del usuario
        await tx.user.update({
          where: { id: userId },
          data: {
            balance: { decrement: totalAmount }
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

        // Registrar asistencia
        const exisingAttendance = await tx.attendance.findUnique({
          where: { 
            userId_eventId: {
              userId,
              eventId
            }
          }
        });

        if (!exisingAttendance) {
          await tx.attendance.create({
            data: {
              userId,
              eventId,
            }
          });
        }

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
