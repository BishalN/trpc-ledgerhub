import { NavBar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { readableCurrency } from "../../page";

export default async function Home({
  params,
}: {
  params: { ledgerId: string; customerId: string };
}) {
  const session = await getServerAuthSession();
  const customer = await api.customer.getByCustomerId.query({
    customerId: params.customerId,
  });
  const aggregate = await api.customer.aggregate.query({
    customerId: params.customerId,
  });
  if (!customer) return notFound();

  // TODO: Add Aggregate ui and Recent transaction ui
  return (
    <main className="text-white">
      <NavBar session={session} />
      <div className="my-8 flex">
        <Avatar className="h-24 w-24">
          <AvatarImage src={customer.avatar} alt={customer.name} />
          {/* // TODO: avatar fallback name derive from customer name */}
          <AvatarFallback>{customer.name.split(" ")[0][0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-white">{customer.name}</h1>
          <p className="text-xl font-semibold text-gray-300">
            <span>{readableCurrency(200)}</span> receivable
          </p>
          <p className="text-xs text-gray-400">created 10 days ago </p>
        </div>
      </div>

      <div className="rounded-md bg-white px-6 py-4 text-black">
        <p className="my-4 font-semibold">{customer.description}</p>
        <pre className="my-4">
          Contacts: {JSON.stringify(customer.contact, null, 2)}
        </pre>
        <div>Recent Transactions: here</div>
      </div>
    </main>
  );
}
