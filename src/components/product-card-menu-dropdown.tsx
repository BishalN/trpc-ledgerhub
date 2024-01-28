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
import { type Product } from "@prisma/client";
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
import { EditProductDialog } from "./edit-product-dialog";

export const ProductCardMenuDropdown = ({ product }: { product: Product }) => {
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  return (
    // Hack to stop link from opening when clicking on the dropdown
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline">
          <MoreVertical className="" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Manage Product</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Button variant="outline" onClick={() => setEditOpen(!editOpen)}>
              <Trash className="mr-2 h-4 w-4" />
              Edit Product
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button
              variant="outline"
              onClick={() => setDeleteAlertOpen(!deleteAlertOpen)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Product
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteProductAlertDialog
        open={deleteAlertOpen}
        setOpen={setDeleteAlertOpen}
        productId={product.id}
      />
      <EditProductDialog
        open={editOpen}
        setOpen={setEditOpen}
        product={product}
      />
    </div>
  );
};

export const DeleteProductAlertDialog = ({
  productId,
  open,
  setOpen,
}: {
  productId: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) => {
  const router = useRouter();
  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product Deleted Successfully",
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
    await deleteProduct.mutateAsync({ productId });
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
