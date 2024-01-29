import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const ledgerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(3) }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.ledger.create({
        data: {
          name: input.name,
          owner: { connect: { id: ctx.session.user.id } },
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.ledger.findMany({
      where: { owner: { id: ctx.session.user.id } },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const res = await ctx.db.ledger.findUnique({
        include: {
          transactions: {
            include: {
              customer: {
                select: {
                  id: true,
                  name: true,
                },
              },
              supplier: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: { id: input.id },
      });

      return res;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const ledger = await ctx.db.ledger.findUnique({
        where: { id: input.id },
      });
      if (!ledger) {
        throw new Error("ledger not found");
      }
      if (ledger.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized");
      }
      return ctx.db.ledger.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const ledger = await ctx.db.ledger.findUnique({
        where: { id: input.id },
      });
      if (!ledger) {
        throw new Error("ledger not found");
      }
      if (ledger.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized");
      }
      return ctx.db.ledger.delete({
        where: { id: input.id },
      });
    }),
});
