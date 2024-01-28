import { NavBar } from "@/components/navbar";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { CreateProductDialog } from "@/components/create-product-dialog";
import { EmptyProductState } from "@/components/empty-product-state";
import { ProductCardMenuDropdown } from "@/components/product-card-menu-dropdown";

export default async function Home({
  params,
}: {
  params: { ledgerId: string };
}) {
  const session = await getServerAuthSession();
  const ledger = await api.ledger.getById.query({ id: params.ledgerId });
  const products = await api.product.getAll.query();

  console.log(products);

  if (!ledger) return notFound();
  return (
    <main>
      <NavBar session={session} />
      <div className="space-y-4">
        <CreateProductDialog />
        <h1 className="space-y-4 font-bold text-white">
          <span className=" block text-4xl">{ledger.name}</span>
          <span>Products: </span>
        </h1>
      </div>
      {/* TODO: Add search use params to store info */}
      <div className="my-3">
        <div className="relative mt-1 rounded-md shadow-sm">
          <Input placeholder="Search by product name" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
        </div>
      </div>
      {products.length > 0 ? (
        products.map((product) => (
          <Link
            key={product.id}
            href={`/ledgers/${ledger.id}/products/${product.id}`}
          >
            <Card className="my-4">
              <CardHeader className="flex flex-row items-baseline justify-between">
                <div>{product.name}</div>
                <ProductCardMenuDropdown product={product} />
              </CardHeader>
              <CardFooter className="text-sm lowercase text-gray-400">
                Created {formatDistanceToNow(product.createdAt)} ago{" "}
              </CardFooter>
            </Card>
          </Link>
        ))
      ) : (
        <EmptyProductState />
      )}
    </main>
  );
}
