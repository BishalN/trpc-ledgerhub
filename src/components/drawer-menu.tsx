import * as React from "react";
import { Factory, Menu, ScanLine, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

export function DrawerMenu({ ledgerId }: { ledgerId: string }) {
  const MenuData = [
    {
      label: "Manage Products",
      Icon: ScanLine,
      href: `/ledgers/${ledgerId}/products`,
    },
    {
      label: `Manage Customers`,
      Icon: User,
      href: `/ledgers/${ledgerId}/customers`,
    },
    {
      label: "Manage Suppliers",
      Icon: Factory,
      href: `/ledgers/${ledgerId}/suppliers`,
    },
  ];

  const router = useRouter();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Menu color="white" size={24} />
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerFooter>
            {MenuData.map((item) => (
              <DrawerClose key={item.label} asChild>
                <Button
                  onClick={() => {
                    router.push(item.href);
                  }}
                  variant="outline"
                >
                  <item.Icon className="mr-2 inline" />
                  {item.label}
                </Button>
              </DrawerClose>
            ))}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
