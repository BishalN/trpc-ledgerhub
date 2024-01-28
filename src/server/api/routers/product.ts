import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  ServerProductUpdateValidationSchema,
  ServerProductValidationSchema,
} from "@/lib/validation";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(ServerProductValidationSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          costPrice: input.costPrice,
          sellingPrice: input.sellingPrice,
          stock: input.stock,
          thumbnail: input.thumbnail,
          barcode: input.barcode,
          suppliers: {
            connect: input.supplierIds?.map((id) => ({ id })) ?? [],
          },
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.product.findMany();
  }),

  getAllById: protectedProcedure
    .input(
      z.object({
        id: z.string({ required_error: "ProductId is required" }),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.product.findUnique({
        where: { id: input.id },
      });
    }),

  update: protectedProcedure
    .input(ServerProductUpdateValidationSchema)
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });
      if (!product) {
        throw new Error("product not found");
      }
      // TODO: Add owner for the product resource and check here for ownership
      return ctx.db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          costPrice: input.costPrice,
          sellingPrice: input.sellingPrice,
          stock: input.stock,
          thumbnail: input.thumbnail,
          barcode: input.barcode,
          suppliers: {
            connect: input.supplierIds?.map((id) => ({ id })) ?? [],
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.productId },
      });
      if (!product) {
        throw new Error("product not found");
      }
      // TODO: Add owner for the product resource and check here for ownership
      return ctx.db.product.delete({
        where: { id: input.productId },
      });
    }),
});
