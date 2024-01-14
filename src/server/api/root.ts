import { createTRPCRouter } from "@/server/api/trpc";
import { ledgerRouter } from "./routers/ledger";
import { transactionRouter } from "./routers/transaction";
import { customerRouter } from "./routers/customer";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  ledger: ledgerRouter,
  transaction: transactionRouter,
  customer: customerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
