import { NavBar } from "@/components/navbar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { EmptySupplierState } from "@/components/empty-supplier-state";
import { SupplierMenuDropdown } from "@/components/supplier-menu-dropdown";
import { CreateSupplierDialog } from "@/components/create-supplier-dialog";

export default async function Home({
  params,
}: {
  params: { ledgerId: string };
}) {
  const session = await getServerAuthSession();
  const ledger = await api.ledger.getById.query({ id: params.ledgerId });
  const suppliers = await api.supplier.getAllByLedgerId.query({
    ledgerId: params.ledgerId,
  });

  if (!ledger) return notFound();
  return (
    <main>
      <NavBar session={session} />
      <div className="space-y-4">
        <CreateSupplierDialog />
        <h1 className="space-y-4 font-bold text-white">
          <span className=" block text-4xl">{ledger.name}</span>
          <span>Suppliers: </span>
        </h1>
      </div>
      {/* TODO: Add search use params to store info */}
      <div className="my-3">
        <div className="relative mt-1 rounded-md shadow-sm">
          <Input placeholder="Search by supplier name" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>
      {suppliers.length > 0 ? (
        suppliers.map((supplier) => (
          <Link
            key={supplier.id}
            href={`/ledgers/${ledger.id}/suppliers/${supplier.id}`}
          >
            <Card className="my-4">
              <CardHeader className="flex flex-row items-baseline justify-between">
                <div>
                  <p className="text-xl font-bold">{supplier.name}</p>
                </div>
                <SupplierMenuDropdown supplier={supplier} />
              </CardHeader>
              <CardFooter className="text-sm lowercase text-gray-400">
                Created {formatDistanceToNow(supplier.createdAt)} ago{" "}
              </CardFooter>
            </Card>
          </Link>
        ))
      ) : (
        <EmptySupplierState />
      )}
    </main>
  );
}
