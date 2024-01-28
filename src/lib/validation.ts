import { z } from "zod";

export const ClientProductValidationSchema = z.object({
  name: z.string().min(3),
  costPrice: z.string(),
  sellingPrice: z.string(),
  stock: z.string(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  barcode: z.string().optional(),
  supplierIds: z.array(z.string()).optional(),
  id: z.string().optional(),
});

export const ServerProductValidationSchema = z.object({
  name: z.string().min(3),
  costPrice: z.number(),
  sellingPrice: z.number(),
  stock: z.number(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  barcode: z.string().optional(),
  supplierIds: z.array(z.string()).optional(),
});

export const ServerProductUpdateValidationSchema =
  ServerProductValidationSchema.merge(z.object({ id: z.string() }));

export const TransactionValidationSchema = z
  .object({
    amount: z.string(),
    // TODO: use directly from prisma client type
    type: z.enum(["RECEIVABLE", "PAYABLE", "RECEIVED", "PAID"]),
    remarks: z.string().min(3).optional(),
    customerId: z.string().optional(),
    ledgerId: z.string(),
    supplierId: z.string().optional(),
    // products: z.array(ProductValidationSchema).optional(),
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
  // products: z.array(ProductValidationSchema).optional(),
});

export type TransactionType = z.infer<typeof TransactionValidationSchema>;
export type ServerTransactionType = z.infer<
  typeof ServerTransactionValidationSchema
>;

export const CustomerValidationSchema = z.object({
  ledgerId: z.string({ required_error: "Ledger Id is required" }),
  name: z.string({ required_error: "Name is required" }).min(3),
  description: z.string().optional(),
  avatar: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const UpdateCustomerValidationSchema = CustomerValidationSchema.merge(
  z.object({ userId: z.string() }),
);
