import { createTRPCRouter } from "@/server/api/trpc";
import { ledgerRouter } from "./routers/ledger";
import { transactionRouter } from "./routers/transaction";
import { customerRouter } from "./routers/customer";
import { productRouter } from "./routers/product";
import { supplierRouter } from "./routers/supplier";
import { type inferProcedureOutput } from "@trpc/server";

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

// export procedure type definition of API
export type AppRouterProcedure = AppRouter["_def"]["procedures"];

// export type of ledger procedure
export type LedgerProcedure = AppRouterProcedure["ledger"];

// export type of output of ledger procedure
export type LPGetByIdOutput = inferProcedureOutput<LedgerProcedure["getById"]>;
