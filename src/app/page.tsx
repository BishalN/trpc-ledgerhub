import NextLink from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";
import { NavBar } from "./layout";
import { Button } from "@/components/ui/button";
import { CreateLedgerDialog } from "@/components/create-ledger-dialog";

export default async function Home() {
  const session = await getServerAuthSession();
  const ledgers = await api.ledger.getAll.query();

  // redirect to login if not logged in
  if (!session?.user) return redirect("/api/auth/signin");

  return (
    <main>
      <NavBar />
      {ledgers.length > 0 ? (
        <div>
          <h1 className="my-4 text-3xl font-bold text-white">Your Ledgers:</h1>
          <ul className="my-4">
            {ledgers.map((ledger) => (
              <NextLink key={ledger.id} href={`/ledger/${ledger.id}`} passHref>
                <li className="cursor-pointer rounded-lg bg-[#D9D9D9] p-4 shadow-md transition-shadow hover:shadow-lg">
                  {ledger.name}
                </li>
              </NextLink>
            ))}
          </ul>
        </div>
      ) : (
        <div className="my-10  space-y-2 rounded-lg bg-[#D9D9D9] p-4 text-center font-bold">
          <p>No Ledger Associated with your account found</p>
          <CreateLedgerDialog />
        </div>
      )}
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}

export function LedgerEmptyState() {
  return (
    <div className="my-10  space-y-2 rounded-lg bg-[#D9D9D9] p-4 text-center font-bold">
      <p>No Ledger Associated with your account found</p>
      <Button>Create Ledger</Button>
    </div>
  );
}
