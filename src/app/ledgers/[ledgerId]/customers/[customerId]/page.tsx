import { NavBar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { TransactionCard, readableCurrency } from "../../page";

import NextLink from "next/link";

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

  const aggregate = await api.customer.aggregate.query({
    customerId: params.customerId,
  });
  const recentTransactions = await api.customer.recentTransactions.query({
    customerId: params.customerId,
  });

  const parsedCustomerContact = JSON.parse(customer.contact as string) as {
    email?: string;
    phone?: string;
    address?: string;
  };

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
          <div className="rounded-md bg-gray-100 px-2 py-1 font-semibold text-black">
            <p className="space-x-1">
              <span className="text-xl font-bold">
                {readableCurrency(aggregate.receivable)}
              </span>
              <span className="rounded-md bg-red-300 px-2 text-gray-600">
                receivable
              </span>
            </p>
            <p className="space-x-1">
              <span className="text-xl font-bold">
                {readableCurrency(aggregate.received)}
              </span>
              <span className="rounded-md bg-green-300 px-2 text-gray-600">
                received
              </span>
            </p>
          </div>
          <p className="text-xs text-gray-400">created 10 days ago </p>
        </div>
      </div>

      <div className="rounded-md bg-white px-6 py-4 text-black">
        <p className="my-4 font-semibold">{customer.description}</p>
        {/* TODO: Handle contact not added case */}
        <div>
          <p className="font-bold">Contact Info</p>
          <div className="mb-4 text-muted-foreground">
            <NextLink href={`mailto:${parsedCustomerContact.email}`}>
              <p>{parsedCustomerContact.email}</p>
            </NextLink>

            <NextLink href={`tel:${parsedCustomerContact.phone}`}>
              <p>{parsedCustomerContact.phone}</p>
            </NextLink>

            <p>{parsedCustomerContact.address}</p>
          </div>
        </div>
      </div>

      {recentTransactions.length > 0 && (
        <div className="my-8">
          <p className="font-bold">Recent Transactions</p>
          {/* TODO: fix undefined name issue */}
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionCard key={transaction.id} transaction={transaction} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
