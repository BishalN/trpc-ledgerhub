"use client";

import { useParams } from "next/navigation";
import { DrawerMenu } from "./drawer-menu";
import { UserDropDown } from "./user-dropdown";
import { type getServerAuthSession } from "@/server/auth";

export function NavBar({
  session,
}: {
  session: Awaited<ReturnType<typeof getServerAuthSession>>;
}) {
  const { ledgerId } = useParams();
  // TODO: Use a static sidebar instead of drawer
  return (
    <div className="flex justify-between pt-4">
      <DrawerMenu ledgerId={ledgerId as string} />
      <UserDropDown session={session} />
    </div>
  );
}
