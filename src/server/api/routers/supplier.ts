import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  SupplierValidationSchema,
  UpdateSupplierValidationSchema,
} from "@/lib/validation";
import { TransactionType } from "@prisma/client";

export const supplierRouter = createTRPCRouter({
  create: protectedProcedure
    .input(SupplierValidationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.supplier.create({
        data: {
          name: input.name,
          description: input.description ?? "",
          avatar: input.avatar,
          contact: JSON.stringify({
            email: input?.email,
            phone: input?.phone,
            address: input?.address,
          }),
          ledger: {
            connect: { id: input.ledgerId },
          },
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
      return ctx.db.supplier.findMany({
        where: { ledgerId: input.ledgerId },
      });
    }),

  getBySupplierId: protectedProcedure
    .input(z.object({ supplierId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.supplier.findUnique({
        where: { id: input.supplierId },
        select: {
          id: true,
          name: true,
          description: true,
          avatar: true,
          contact: true,
          ledger: true,
          products: true,
        },
      });
    }),

  getSupplierByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.supplier.findMany({
        where: { name: { contains: input.name, mode: "insensitive" } },
      });
    }),

  update: protectedProcedure
    .input(UpdateSupplierValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const supplier = await ctx.db.supplier.findUnique({
        where: { id: input.supplierId },
        include: { ledger: true },
      });
      if (!supplier) {
        throw new Error("supplier not found");
      }
      if (supplier.ledger?.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized");
      }
      return ctx.db.supplier.update({
        where: { id: input.supplierId },
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
    .input(z.object({ supplierId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const supplier = await ctx.db.supplier.findUnique({
        where: { id: input.supplierId },
        include: { ledger: true },
      });
      if (!supplier) {
        throw new Error("supplier not found");
      }
      if (supplier.ledger?.ownerId !== ctx.session.user.id) {
        throw new Error("not authorized");
      }
      return ctx.db.supplier.delete({
        where: { id: input.supplierId },
      });
    }),

  aggregate: protectedProcedure
    .input(z.object({ supplierId: z.string() }))
    .query(async ({ ctx, input }) => {
      const payable = await ctx.db.transaction.aggregate({
        where: {
          supplierId: input.supplierId,
          type: TransactionType.PAYABLE,
        },
        _sum: {
          amount: true,
        },
      });

      const paid = await ctx.db.transaction.aggregate({
        where: {
          supplierId: input.supplierId,
          type: TransactionType.PAID,
        },
        _sum: {
          amount: true,
        },
      });

      return {
        payable: payable._sum.amount ?? 0,
        paid: paid._sum.amount ?? 0,
      };
    }),

  recentTransactions: protectedProcedure
    .input(
      z.object({
        supplierId: z.string(),
        skip: z.number().optional().default(0),
        take: z.number().optional().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const txns = await ctx.db.transaction.findMany({
        where: {
          supplierId: input.supplierId,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: input.skip,
        take: input.take,
      });

      return txns;
    }),
});
