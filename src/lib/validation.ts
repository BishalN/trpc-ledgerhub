import { z } from "zod";

// Extract the enum zod type using transaction type

export const ProductValidationSchema = z
  .object({
    name: z.string().min(3),
    price: z.string(),
    quantity: z.string(),
  })
  .transform((data) => ({
    ...data,
    price: Number(data.price),
    quantity: Number(data.quantity),
  }));

// start number as string to avoid error than transform to number
export const TransactionValidationSchema = z
  .object({
    amount: z.string(),
    // TODO: use directly from prisma client type
    type: z.enum(["RECEIVABLE", "PAYABLE", "RECEIVED", "PAID"]),
    remarks: z.string().min(3).optional(),
    customerId: z.string().optional(),
    ledgerId: z.string(),
    supplierId: z.string().optional(),
    products: z.array(ProductValidationSchema).optional(),
  })
  .transform((data) => ({
    ...data,
    amount: Number(data.amount),
  }));

// TODO: use a single validation schema for both client and server
export const ServerTransactionValidationSchema = z.object({
  amount: z.number(),
  // TODO: use directly from prisma client type
  type: z.enum(["RECEIVABLE", "PAYABLE", "RECEIVED", "PAID"]),
  remarks: z.string().min(3).optional(),
  customerId: z.string().optional(),
  ledgerId: z.string(),
  supplierId: z.string().optional(),
  products: z.array(ProductValidationSchema).optional(),
});

export type TransactionType = z.infer<typeof TransactionValidationSchema>;
export type ServerTransactionType = z.infer<
  typeof ServerTransactionValidationSchema
>;
