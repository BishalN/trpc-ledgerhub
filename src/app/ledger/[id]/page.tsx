import { NavBar } from "@/app/layout";
import { CreateTransactionDialog } from "@/components/create-transaction-dialog";
import { api } from "@/trpc/server";

export default async function LedgerPage({
  params,
}: {
  params: { id: string };
}) {
  const ledger = await api.ledger.getById.query({ id: params.id });
  // TODO: show 404 if ledger is null
  if (!ledger) return null;
  return (
    <main className="text-white">
      <NavBar />
      <h1 className="my-4 text-4xl font-bold">{ledger.name}</h1>

      <p className="mt-6 text-lg font-semibold">Recent Transactions</p>
      {ledger.transactions.length > 0 ? (
        <div>Transactions</div>
      ) : (
        <div className="rounded-lg bg-gray-500 p-4 text-center">
          <p>No Transactions.</p>
          <CreateTransactionDialog />
        </div>
      )}
    </main>
  );
}
