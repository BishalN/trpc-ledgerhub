import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TransactionValidationSchema } from "@/lib/validation";

export const transactionRouter = createTRPCRouter({
  create: protectedProcedure
    .input(TransactionValidationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.create({
        data: {
          amount: input.amount,
          remarks: input.remarks,
          type: input.type ?? "",
          ledger: { connect: { id: input.ledgerId } },
          // TODO: understand how does this optional relationship works
          customer: input.customerId
            ? { connect: { id: input.customerId } }
            : undefined,
          supplier: input.supplierId
            ? { connect: { id: input.supplierId } }
            : undefined,
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
      return ctx.db.ledger.delete({
        where: { id: input.id },
      });
    }),
});
