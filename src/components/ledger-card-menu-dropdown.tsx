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
import { type Ledger } from "@prisma/client";
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
import { EditLedgerDialog } from "./edit-ledger-dialog";

export const LedgerCardMenuDropdown = ({ ledger }: { ledger: Ledger }) => {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline">
          <MoreVertical className="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage Ledger</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="outline" onClick={() => setEditOpen(!editOpen)}>
              <Trash className="mr-2 h-4 w-4" />
              Edit Ledger
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="outline"
              onClick={() => setDeleteAlertOpen(!deleteAlertOpen)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Ledger
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteLedgerAlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        ledgerId={ledger.id}
      />
      <EditLedgerDialog open={editOpen} setOpen={setEditOpen} ledger={ledger} />
    </div>
  );
};

export const DeleteLedgerAlertDialog = ({
  ledgerId,
  open,
  setOpen,
}: {
  ledgerId: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const deleteLedger = api.ledger.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ledger Deleted Successfully",
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

  const handleLedgerDelete = async () => {
    await deleteLedger.mutateAsync({ id: ledgerId });
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
          <AlertDialogAction onClick={handleLedgerDelete}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
