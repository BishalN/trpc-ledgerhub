import { NavBar } from "@/components/navbar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: { ledgerId: string };
}) {
  console.log(params.ledgerId);
  const session = await getServerAuthSession();
  const ledger = await api.ledger.getById.query({ id: params.ledgerId });
  if (!ledger) return notFound();

  return (
    <main className="text-white">
      <NavBar session={session} />
      <h1 className="font-bold text-white">
        Products:
        <span className=" block text-4xl">{ledger.name}</span>
      </h1>
    </main>
  );
}
