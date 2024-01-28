import NextLink from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CreateLedgerDialog } from "@/components/create-ledger-dialog";
import { NavBar } from "@/components/navbar";
import { EmptyLedgerState } from "@/components/empty-ledger-state";

export default async function Home() {
  const session = await getServerAuthSession();
  const ledgers = await api.ledger.getAll.query();

  // redirect to login if not logged in
  if (!session?.user) return redirect("/api/auth/signin");

  return (
    <main>
      <NavBar session={session} />
      {ledgers.length > 0 ? (
        <div>
          <h1 className="my-4 text-3xl font-bold text-white">Your Ledgers:</h1>
          <ul className="my-4">
            {ledgers.map((ledger) => (
              <NextLink key={ledger.id} href={`/ledgers/${ledger.id}`} passHref>
                <li className="cursor-pointer rounded-lg bg-[#D9D9D9] p-4 shadow-md transition-shadow hover:shadow-lg">
                  {ledger.name}
                </li>
              </NextLink>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyLedgerState />
      )}
    </main>
  );
}
