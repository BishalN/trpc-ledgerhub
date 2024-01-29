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

// TODO: add transform to handle the case when type is receivable or payable then customerId is required
// else supplierId is required
export const TransactionValidationSchema = z
  .object({
    amount: z.coerce.number().min(1),
    type: z.enum(["RECEIVABLE", "PAYABLE", "RECEIVED", "PAID"]),
    remarks: z.string().optional(),
    customerId: z.string().optional(),
    ledgerId: z.string(),
    supplierId: z.string().optional(),
    products: z
      .array(
        z.object({
          id: z.string(),
          quantity: z.coerce.number().min(1),
          price: z.coerce.number().min(1),
        }),
      )
      .optional(),
  })
  .transform((data) => {
    if (data.products) {
      const amount = data.products.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0,
      );
      return { ...data, amount };
    }
    return data;
  });

export const UpdateTransactionValidationSchema = z
  .object({
    transactionId: z.string(),
    amount: z.coerce.number().min(1),
    type: z.enum(["RECEIVABLE", "PAYABLE", "RECEIVED", "PAID"]),
    remarks: z.string().optional(),
    customerId: z.string().optional(),
    ledgerId: z.string(),
    supplierId: z.string().optional(),
    products: z
      .array(
        z.object({
          id: z.string(),
          quantity: z.coerce.number().min(1),
          price: z.coerce.number().min(1),
        }),
      )
      .optional(),
  })
  .transform((data) => {
    if (data.products) {
      const amount = data.products.reduce(
        (acc, curr) => acc + curr.quantity * curr.price,
        0,
      );
      return { ...data, amount };
    }
    return data;
  });

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
  z.object({ customerId: z.string() }),
);

export const SupplierValidationSchema = z.object({
  ledgerId: z.string({ required_error: "Ledger Id is required" }),
  name: z.string({ required_error: "Name is required" }).min(3),
  description: z.string().optional(),
  avatar: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const UpdateSupplierValidationSchema = SupplierValidationSchema.merge(
  z.object({ supplierId: z.string() }),
);
