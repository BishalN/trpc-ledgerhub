import { NavBar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: { ledgerId: string; productId: string };
}) {
  const session = await getServerAuthSession();
  const product = await api.product.getById.query({ id: params.productId });
  if (!product) return notFound();

  return (
    <main className="text-white">
      <NavBar session={session} />
      <div className="my-8 flex">
        <Avatar className="h-24 w-24">
          <AvatarImage src={product.thumbnail} alt={product.name} />
          {/* // TODO: avatar fallback name derive from product name */}
          <AvatarFallback>{product.name.split(" ")[0][0]}</AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <h1 className="font-bold text-white">{product.name}</h1>
          <p className="font-semibold text-gray-300">
            {" "}
            ${product.sellingPrice} selling price
          </p>
          <p className="text-xs text-gray-200">created 10 days ago </p>
        </div>
      </div>
      <div>${product.costPrice} cost price </div>
      <div>{product.description}</div>
      <div>
        {product.suppliers.length > 0 ? (
          product.suppliers.map((supplier) => (
            <div key={supplier.id}>{supplier.name}</div>
          ))
        ) : (
          <div>
            No suppliers TODO: empty supplier state with button to add supplier
          </div>
        )}
      </div>
    </main>
  );
}
