"use client";

import { useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { Button } from "./ui/button";
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
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { EditTransactionDialog } from "./edit-transaction-dialog";
import { type Transaction } from "@prisma/client";

export function TransactionItemDropDownMenu({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="inline h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Update Transaction</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="outline" onClick={() => setEditOpen(!editOpen)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Transaction
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="outline"
              onClick={() => setDeleteAlertOpen(!deleteAlertOpen)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Transaction
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteTransactionAlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        transactionId={transaction.id}
      />
      <EditTransactionDialog
        open={editOpen}
        setOpen={setEditOpen}
        transaction={transaction}
      />
    </div>
  );
}

export const DeleteTransactionAlertDialog = ({
  transactionId,
  open,
  setOpen,
}: {
  transactionId: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const deleteTransaction = api.transaction.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction Deleted Successfully",
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

  const handleTransactionDelete = async () => {
    await deleteTransaction.mutateAsync({ id: transactionId });
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
          <AlertDialogAction onClick={handleTransactionDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
