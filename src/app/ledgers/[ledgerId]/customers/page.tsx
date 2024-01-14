import { CreateCustomerDialog } from "@/components/create-customer-dialog";
import { NavBar } from "@/components/navbar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { CustomerCardMenuDropdown } from "@/components/customer-card-menu-dropdown";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";

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

  console.log(customers);

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
      {customers.map((customer) => (
        <Card className="my-4" key={customer.id}>
          <CardHeader className="flex flex-row items-baseline justify-between">
            <div>{customer.name}</div>
            <CustomerCardMenuDropdown customer={customer} />
          </CardHeader>
          <CardFooter className="text-sm lowercase text-gray-400">
            Created {formatDistanceToNow(customer.createdAt)} ago{" "}
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}
