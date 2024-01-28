import { createTRPCRouter } from "@/server/api/trpc";
import { ledgerRouter } from "./routers/ledger";
import { transactionRouter } from "./routers/transaction";
import { customerRouter } from "./routers/customer";
import { productRouter } from "./routers/product";
import { supplierRouter } from "./routers/supplier";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ledger: ledgerRouter,
  transaction: transactionRouter,
  customer: customerRouter,
  product: productRouter,
  supplier: supplierRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
