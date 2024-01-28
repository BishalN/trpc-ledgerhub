"use client";

import { MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { type Supplier } from "@prisma/client";
import { api } from "@/trpc/react";
import { toast } from "./ui/use-toast";

import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { EditSupplierDialog } from "./edit-supplier-dialog";

export const SupplierMenuDropdown = ({ supplier }: { supplier: Supplier }) => {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline">
          <MoreVertical className="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage Supplier</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="outline" onClick={() => setEditOpen(!editOpen)}>
              <Trash className="mr-2 h-4 w-4" />
              Edit Supplier
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="outline"
              onClick={() => setDeleteAlertOpen(!deleteAlertOpen)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Supplier
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCustomerAlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        supplierId={supplier.id}
      />
      <EditSupplierDialog
        open={editOpen}
        setOpen={setEditOpen}
        supplier={supplier}
      />
    </div>
  );
};

export const DeleteCustomerAlertDialog = ({
  supplierId,
  open,
  setOpen,
}: {
  supplierId: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const deleteSupplier = api.supplier.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Supplier Deleted Successfully",
      });
      router.refresh();
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message,
      });
    },
  });

  const handleSupplierDelete = async () => {
    await deleteSupplier.mutateAsync({ supplierId });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSupplierDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
