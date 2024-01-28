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
import { type Customer } from "@prisma/client";
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
import { EditCustomerDialog } from "./edit-customer-dialog";

export const CustomerCardMenuDropdown = ({
  customer,
}: {
  customer: Customer;
}) => {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline">
          <MoreVertical className="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage Customer</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="outline" onClick={() => setEditOpen(!editOpen)}>
              <Trash className="mr-2 h-4 w-4" />
              Edit Customer
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="outline"
              onClick={() => setDeleteAlertOpen(!deleteAlertOpen)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Customer
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCustomerAlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        customerId={customer.id}
      />
      <EditCustomerDialog
        open={editOpen}
        setOpen={setEditOpen}
        customer={customer}
      />
    </div>
  );
};

export const DeleteCustomerAlertDialog = ({
  customerId,
  open,
  setOpen,
}: {
  customerId: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const deleteCustomer = api.customer.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Customer Deleted Successfully",
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

  const handleCustomerDelete = async () => {
    await deleteCustomer.mutateAsync({ customerId });
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
          <AlertDialogAction onClick={handleCustomerDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
