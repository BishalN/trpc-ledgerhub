import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  CustomerValidationSchema,
  UpdateCustomerValidationSchema,
} from "@/lib/validation";

export const customerRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CustomerValidationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.customer.create({
        data: {
          name: input.name,
          description: input.description,
          avatar: input.avatar,
          contact: JSON.stringify({
            email: input?.email,
            phone: input?.phone,
            address: input?.address,
          }),
          ledger: { connect: { id: input.ledgerId } },
        },
      });
    }),

  getAllByLedgerId: protectedProcedure
    .input(
      z.object({
        ledgerId: z.string({ required_error: "LedgerId is required" }),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.customer.findMany({
        where: { ledgerId: input.ledgerId },
      });
    }),

  getByCustomerId: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.customer.findUnique({
        where: { id: input.customerId },
      });
    }),

  update: protectedProcedure
    .input(UpdateCustomerValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({
        where: { id: input.userId },
        include: { ledger: true },
      });
      if (!customer) {
        throw new Error("customer not found");
      }
      if (customer.ledger?.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized");
      }
      return ctx.db.customer.update({
        where: { id: input.userId },
        data: {
          name: input.name,
          description: input.description,
          avatar: input.avatar,
          contact: JSON.stringify({
            email: input?.email,
            phone: input?.phone,
            address: input?.address,
          }),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ customerId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const customer = await ctx.db.customer.findUnique({
        where: { id: input.customerId },
        include: { ledger: true },
      });
      if (!customer) {
        throw new Error("customer not found");
      }
      if (customer.ledger?.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized");
      }
      return ctx.db.customer.delete({
        where: { id: input.customerId },
      });
    }),
});
