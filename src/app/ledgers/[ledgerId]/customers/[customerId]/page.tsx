import { NavBar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: { ledgerId: string; customerId: string };
}) {
  const session = await getServerAuthSession();
  const customer = await api.customer.getByCustomerId.query({
    customerId: params.customerId,
  });
  if (!customer) return notFound();

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
          <h1 className="font-bold text-white">{customer.name}</h1>
          <p className="font-semibold text-gray-300"> $200 receivable </p>
          <p className="text-xs text-gray-200">created 10 days ago </p>
        </div>
      </div>
      <div>Description: here</div>
      <div>Contacts: here</div>
      <div>Recent Transactions: here</div>
    </main>
  );
}
