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
  params: { ledgerId: string; supplierId: string };
}) {
  const session = await getServerAuthSession();
  const supplier = await api.supplier.getBySupplierId.query({
    supplierId: params.supplierId,
  });

  if (!supplier) return notFound();

  const aggregate = await api.supplier.aggregate.query({
    supplierId: params.supplierId,
  });

  const recentTransactions = await api.supplier.recentTransactions.query({
    supplierId: params.supplierId,
  });

  const parsedSupplierContact = JSON.parse(supplier.contact as string) as {
    email?: string;
    phone?: string;
    address?: string;
  };

  return (
    <main className="text-white">
      <NavBar session={session} />
      <div className="my-8 flex">
        <Avatar className="h-24 w-24">
          <AvatarImage src={supplier.avatar} alt={supplier.name} />
          {/* // TODO: avatar fallback name derive from supplier name */}
          <AvatarFallback>{supplier.name.split(" ")[0][0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h1 className="text-3xl font-bold text-white">{supplier.name}</h1>
          <div className="rounded-md bg-gray-100 px-2 py-1 font-semibold text-black">
            <p className="space-x-1">
              <span className="text-xl font-bold">
                {readableCurrency(aggregate.payable)}
              </span>
              <span className="rounded-md bg-red-300 px-2 text-gray-600">
                payable
              </span>
            </p>
            <p className="space-x-1">
              <span className="text-xl font-bold">
                {readableCurrency(aggregate.paid)}
              </span>
              <span className="rounded-md bg-green-300 px-2 text-gray-600">
                paid
              </span>
            </p>
          </div>
          <p className="text-xs text-gray-400">created 10 days ago </p>
        </div>
      </div>

      <div className="rounded-md bg-white px-6 py-4 text-black">
        <p className="my-4 font-semibold">{supplier.description}</p>
        {/* TODO: Handle contact not added case */}
        <div>
          <p className="font-bold">Contact Info</p>
          <div className="mb-4 text-muted-foreground">
            <NextLink href={`mailto:${parsedSupplierContact.email}`}>
              <p>{parsedSupplierContact.email}</p>
            </NextLink>

            <NextLink href={`tel:${parsedSupplierContact.phone}`}>
              <p>{parsedSupplierContact.phone}</p>
            </NextLink>

            <p>{parsedSupplierContact.address}</p>
          </div>
        </div>
      </div>

      {/* TODO: Add a ui to create product and associate it with supplier */}
      <div>
        {supplier.products.map((product) => (
          <div key={product.id}>{product.name}</div>
        ))}
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
