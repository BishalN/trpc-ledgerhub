import { z } from "zod";

export const ProductValidationSchema = z.object({
  name: z.string().min(3),
  price: z.number().positive(),
  quantity: z.number().positive(),
});

export const TransactionValidationSchema = z.object({
  remarks: z.string().min(3).optional(),
  amount: z.number().positive(),
  customerId: z.string().uuid().optional(),
  ledgerId: z.string().uuid(),
  supplierId: z.string().uuid().optional(),
  // Need to certain on this
  type: z.enum(["credit", "debit"]).optional(),
  products: z.array(ProductValidationSchema).optional(),
});
