import { CreateCustomerDialog } from "@/components/create-customer-dialog";
import { NavBar } from "@/components/navbar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomerCardMenuDropdown } from "@/components/customer-card-menu-dropdown";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { EmptyCustomerState } from "@/components/empty-customer-state";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";

export default async function Home({
  params,
}: {
  params: { ledgerId: string };
}) {
  const session = await getServerAuthSession();
  const ledger = await api.ledger.getById.query({ id: params.ledgerId });
  const customers = await api.customer.getAllByLedgerId.query({
    ledgerId: params.ledgerId,
  });

  if (!ledger) return notFound();
  return (
    <main>
      <NavBar session={session} />
      <div className="space-y-4">
        <CreateCustomerDialog />
        <h1 className="space-y-4 font-bold text-white">
          <span className=" block text-4xl">{ledger.name}</span>
          <span>Customers: </span>
        </h1>
      </div>
      {/* TODO: Add search use params to store info */}
      <div className="my-3">
        <div className="relative mt-1 rounded-md shadow-sm">
          <Input placeholder="Search by customer name" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>
      {customers.length > 0 ? (
        customers.map((customer) => (
          <Link
            key={customer.id}
            href={`/ledgers/${ledger.id}/customers/${customer.id}`}
          >
            <Card className="my-4">
              <CardHeader className="flex flex-row items-baseline justify-between">
                <div>{customer.name}</div>
                <CustomerCardMenuDropdown customer={customer} />
              </CardHeader>
              <CardFooter className="text-sm lowercase text-gray-400">
                Created {formatDistanceToNow(customer.createdAt)} ago{" "}
              </CardFooter>
            </Card>
          </Link>
        ))
      ) : (
        <EmptyCustomerState />
      )}
    </main>
  );
}
