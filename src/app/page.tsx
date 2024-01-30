import NextLink from "next/link";

import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { CreateLedgerDialog } from "@/components/create-ledger-dialog";
import { NavBar } from "@/components/navbar";
import { EmptyLedgerState } from "@/components/empty-ledger-state";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { LedgerCardMenuDropdown } from "@/components/ledger-card-menu-dropdown";

export default async function Home() {
  const session = await getServerAuthSession();
  // TODO: use middleware instead of this
  // redirect to login if not logged in
  if (!session?.user) return redirect("/api/auth/signin");

  const ledgers = await api.ledger.getAll.query();

  return (
    <main>
      <NavBar session={session} />
      <CreateLedgerDialog />
      {ledgers.length > 0 ? (
        <div>
          <h1 className="mt-4 text-3xl font-bold text-white">Your Ledgers:</h1>
          <ul>
            {ledgers.map((ledger) => (
              <NextLink key={ledger.id} href={`/ledgers/${ledger.id}`} passHref>
                <Card className="my-3">
                  <CardHeader className="flex-row justify-between text-xl font-bold">
                    <span>{ledger.name}</span>
                    <LedgerCardMenuDropdown ledger={ledger} />
                  </CardHeader>
                  <CardFooter>
                    <p className="text-sm text-muted-foreground">
                      last updated {formatDistanceToNow(ledger.updatedAt)} ago
                    </p>
                  </CardFooter>
                </Card>
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
