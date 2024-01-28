import { formatDistanceToNow } from "date-fns";
import { CreateTransactionDialog } from "@/components/create-transaction-dialog";
import { api } from "@/trpc/server";
import { TransactionItemDropDownMenu } from "@/components/transaction-dropdown-menu";
import { NavBar } from "@/components/navbar";
import { getServerAuthSession } from "@/server/auth";
import { EmptyTransactionState } from "@/components/empty-transaction-state";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

export default async function LedgerPage({
  params,
}: {
  params: { ledgerId: string };
}) {
  const session = await getServerAuthSession();
  const ledger = await api.ledger.getById.query({ id: params.ledgerId });
  if (!ledger) return notFound();

  return (
    <main className="text-white">
      <NavBar session={session} />
      <CreateTransactionDialog />
      <h1 className="my-4 text-4xl font-bold">{ledger.name}</h1>

      <p className="text-lg font-semibold">Recent Transactions</p>
      {ledger.transactions.length > 0 ? (
        <div className="space-y-4">
          {ledger.transactions.map((transaction) => {
            return (
              <Card key={transaction.id}>
                <CardHeader className="flex flex-row items-baseline justify-between">
                  <div>
                    $ {transaction.amount} {transaction.type}
                  </div>
                  <TransactionItemDropDownMenu transactionId={transaction.id} />
                </CardHeader>
                {transaction.remarks && (
                  <CardContent>
                    <div>{transaction.remarks}</div>
                  </CardContent>
                )}
                <CardFooter>
                  created {formatDistanceToNow(new Date(transaction.createdAt))}{" "}
                  ago
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyTransactionState />
      )}
    </main>
  );
}
