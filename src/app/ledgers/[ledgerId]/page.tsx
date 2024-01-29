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
import { TransactionType } from "@prisma/client";
import NextLink from "next/link";
import { type TransactionProductType } from "@/lib/validation";

export default async function LedgerPage({
  params,
}: {
  params: { ledgerId: string };
}) {
  const session = await getServerAuthSession();
  const ledger = await api.ledger.getById.query({ id: params.ledgerId });

  if (!ledger) return notFound();

  const txnTypeToLabelAndColor = {
    [TransactionType.PAID]: { label: "Paid", color: "bg-green-300" },
    [TransactionType.PAYABLE]: { label: "Payable", color: "bg-red-300" },
    [TransactionType.RECEIVABLE]: {
      label: "Receivable",
      color: "bg-red-300",
    },
    [TransactionType.RECEIVED]: { label: "Received", color: "bg-green-300" },
  };

  // TODO: comeup with better name for this
  const generateHeadline = (transaction: (typeof ledger.transactions)[0]) => {
    if (!transaction.customerId && !transaction.supplierId) {
      return { ...txnTypeToLabelAndColor[transaction.type], link: "#" };
    } else if (transaction.customerId) {
      return {
        label:
          txnTypeToLabelAndColor[transaction.type].label +
          " from " +
          " " +
          transaction.customer?.name,
        link: `/ledgers/${params.ledgerId}/customers/${transaction.customerId}`,
      };
    } else if (transaction.supplierId) {
      return {
        label:
          txnTypeToLabelAndColor[transaction.type].label +
          " to " +
          " " +
          transaction.supplier?.name,
        link: `/ledgers/${params.ledgerId}/suppliers/${transaction.supplierId}`,
      };
    }
  };

  return (
    <main className="text-white">
      <NavBar session={session} />
      <CreateTransactionDialog />
      <h1 className="my-4 text-4xl font-bold">{ledger.name}</h1>
      <p className="text-lg font-semibold">Recent Transactions</p>
      {ledger.transactions.length > 0 ? (
        <div className="space-y-4">
          {ledger.transactions.map((transaction) => {
            const transactionProducts =
              transaction.products as TransactionProductType;
            return (
              <Card key={transaction.id}>
                <CardHeader className="flex flex-row items-baseline justify-between">
                  <div className="space-x-2">
                    <span className="text-2xl font-bold">
                      ${transaction.amount}
                    </span>
                    <NextLink
                      href={generateHeadline(transaction).link}
                      className={`rounded-md ${
                        txnTypeToLabelAndColor[transaction.type].color
                      } px-1`}
                    >
                      {generateHeadline(transaction)?.label}
                    </NextLink>
                  </div>
                  <TransactionItemDropDownMenu transaction={transaction} />
                </CardHeader>
                {transaction.remarks && (
                  <CardContent>
                    <div className="text-sm text-gray-500">
                      {transaction.remarks}
                    </div>
                    {transactionProducts && transactionProducts.length > 0 && (
                      <div className="mt-2 rounded-md bg-gray-200 p-2 text-muted-foreground">
                        <p className="text-semibold">Products:</p>
                        {transactionProducts.map((prod) => (
                          <p key={prod.id}>
                            {prod.name ?? prod.id} x {prod.quantity} = $
                            {prod.price * prod.quantity}{" "}
                          </p>
                        ))}
                      </div>
                    )}
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
