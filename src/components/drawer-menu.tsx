import * as React from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";

export const MenuData = [
  {
    label: "Create Transaction",
  },
  {
    label: "Products",
  },
  {
    label: `Customers`,
  },
  {
    label: "Suppliers",
  },
];

export function DrawerMenu() {
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
                <Button variant="outline">{item.label}</Button>
              </DrawerClose>
            ))}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
