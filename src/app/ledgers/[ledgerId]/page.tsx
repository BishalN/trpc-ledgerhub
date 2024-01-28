import { formatDistanceToNow } from "date-fns";
import { CreateTransactionDialog } from "@/components/create-transaction-dialog";
import { api } from "@/trpc/server";
import { TransactionItemDropDownMenu } from "@/components/transaction-dropdown-menu";
import { NavBar } from "@/components/navbar";
import { getServerAuthSession } from "@/server/auth";
import { EmptyTransactionState } from "@/components/empty-transaction-state";

export default async function LedgerPage({
  params,
}: {
  params: { ledgerId: string };
}) {
  const session = await getServerAuthSession();
  const ledger = await api.ledger.getById.query({ id: params.ledgerId });
  // TODO: show 404 if ledger is null
  if (!ledger) return null;
  return (
    <main className="text-white">
      <NavBar session={session} />
      <CreateTransactionDialog />
      <h1 className="my-4 text-4xl font-bold">{ledger.name}</h1>

      <p className="mt-6 text-lg font-semibold">Recent Transactions</p>
      {ledger.transactions.length > 0 ? (
        <div className="space-y-4">
          {ledger.transactions.map((transaction) => {
            return (
              <div
                className="space-x-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-600"
                key={transaction.id}
              >
                <span className="text-2xl text-green-700">
                  $ {transaction.amount}
                </span>
                <span>{transaction.type}</span>
                <TransactionItemDropDownMenu transactionId={transaction.id} />
                {/* <span>
                  {transaction.type === "RECEIVABLE" ||
                  transaction.type === "RECEIVED"
                    ? "from"
                    : "to"}
                </span> */}

                <div>{transaction.remarks}</div>
                <div>
                  created {formatDistanceToNow(new Date(transaction.createdAt))}{" "}
                  ago
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyTransactionState />
      )}
    </main>
  );
}
