import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  TransactionValidationSchema,
  UpdateTransactionValidationSchema,
} from "@/lib/validation";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(TransactionValidationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.create({
        data: {
          amount: input.amount,
          remarks: input.remarks,
          type: input.type,
          // TODO: understand how does this optional relationship works
          customer: input.customerId
            ? { connect: { id: input.customerId } }
            : undefined,
          supplier: input.supplierId
            ? { connect: { id: input.supplierId } }
            : undefined,
          products: input.products,
          ledger: { connect: { id: input.ledgerId } },
        },
      });
    }),

  getAllTransactionOfALedger: protectedProcedure
    .input(
      z.object({
        ledgerId: z.string({ required_error: "LedgerId not passed" }),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.transaction.findMany({
        where: {
          ledgerId: input.ledgerId,
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction.findUnique({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(UpdateTransactionValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.db.transaction.findUnique({
        where: { id: input.transactionId },
        select: { ledger: { select: { ownerId: true } } },
      });

      if (!transaction) {
        throw new Error("transaction not found");
      }

      if (transaction.ledger?.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized");
      }

      return ctx.db.transaction.update({
        where: { id: input.transactionId },
        data: {
          amount: input.amount,
          remarks: input.remarks,
          type: input.type,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const transaction = await ctx.db.transaction.findUnique({
        where: { id: input.id },
      });
      if (!transaction) {
        throw new Error("transaction not found");
      }
      // TODO: we need to go up one level to ledger and check the ownership
      // from there or just add a creatorId in transaction model
      // if (transaction.id !== ctx.session.user.id) {
      //   throw new Error("not authorized");
      // }
      return ctx.db.transaction.delete({
        where: { id: input.id },
      });
    }),
});
