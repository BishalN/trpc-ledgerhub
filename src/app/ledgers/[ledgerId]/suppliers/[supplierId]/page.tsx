import { NavBar } from "@/components/navbar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";

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
          <h1 className="font-bold text-white">{supplier.name}</h1>
          <p className="font-semibold text-gray-300"> $200 receivable </p>
          <p className="text-xs text-gray-200">created 10 days ago </p>
        </div>
      </div>
      <div>{supplier.description}</div>
      <div>Contacts: here</div>
      <div>
        {supplier.products.map((product) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
      <div>Recent Transactions: here</div>
    </main>
  );
}
