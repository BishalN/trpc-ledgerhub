import { NavBar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { readableCurrency } from "../../page";

export default async function Home({
  params,
}: {
  params: { ledgerId: string; productId: string };
}) {
  const session = await getServerAuthSession();
  const product = await api.product.getById.query({ id: params.productId });
  if (!product) return notFound();

  // TODO: Calculate the aggregates of a product
  //  total units sold, total units in stock, total units bought, total units returned
  // total cost price, total selling price, total profit

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
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <p className="text-xl font-semibold text-gray-300">
            {" "}
            {readableCurrency(product.sellingPrice)} selling price
          </p>
          <p className="text-xs text-gray-400">created 10 days ago </p>
        </div>
      </div>

      <div className="rounded-md bg-white px-6 py-4 text-black">
        <p className="text-xl font-bold">
          {readableCurrency(product.costPrice)} cost price{" "}
        </p>
        <p className="my-2 italic text-gray-600">
          {product.stock} items left in stock
        </p>
        <p className="my-4 font-semibold text-gray-600">
          {product.description}
        </p>
        {/* <div>
          {product.suppliers.length > 0 ? (
            product.suppliers.map((supplier) => (
              <div key={supplier.id}>{supplier.name}</div>
            ))
          ) : (
            <div>
              No suppliers TODO: empty supplier state with button to add
              supplier
            </div>
          )}
        </div> */}
      </div>
    </main>
  );
}
