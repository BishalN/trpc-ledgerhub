import * as React from "react";
import { Factory, Menu, ScanLine, User } from "lucide-react";
import NextLink from "next/link";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

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
                <Button variant="outline">
                  <NextLink href={item.href} passHref>
                    <item.Icon className="mr-2 inline" />
                    {item.label}
                  </NextLink>
                </Button>
              </DrawerClose>
            ))}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
