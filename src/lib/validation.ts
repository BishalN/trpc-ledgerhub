import { z } from "zod";

export const ProductValidationSchema = z.object({
  name: z.string().min(3),
  costPrice: z.coerce.number(),
  sellingPrice: z.coerce.number().min(1),
  stock: z.coerce.number(),
  description: z.string().optional(),
  thumbnail: z.string().optional(),
  barcode: z.string().optional(),
  supplierIds: z.array(z.string()).optional(),
});

export const ProductUpdateValidationSchema = ProductValidationSchema.merge(
  z.object({ id: z.string() }),
);

export const TransactionValidationSchema = z
  .object({
    amount: z.coerce.number(),
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

export type TransactionType = z.infer<typeof TransactionValidationSchema>;

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
