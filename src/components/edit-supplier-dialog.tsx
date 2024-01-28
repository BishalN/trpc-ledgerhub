"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";

import { toast } from "./ui/use-toast";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { UpdateSupplierValidationSchema } from "@/lib/validation";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import React from "react";
import { type Supplier } from "@prisma/client";

export function EditSupplierDialog({
  supplier,
  open,
  setOpen,
}: {
  supplier: Supplier;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  const updateSupplier = api.supplier.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Supplier Updated Successfully",
      });
      router.refresh();
      setOpen(false);
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message,
      });
    },
  });

  const form = useZodForm({
    schema: UpdateSupplierValidationSchema,
    defaultValues: {
      ledgerId: supplier.ledgerId,
      name: supplier.name,
      description: supplier.description ?? "",
      supplierId: supplier.id,
      // email: customer.email,
      // phone: customer.phone,
      // address: customer.address,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await updateSupplier.mutateAsync(values);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>Enter details of your supplier</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* // TODO: use a dollar sign icon */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="text-right">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input id="name" className="col-span-3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="description" className="text-right">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="description"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email" className="text-right">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input id="email" className="col-span-3" {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="phone" className="text-right">
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input id="phone" className="col-span-3" {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="address" className="text-right">
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input id="address" className="col-span-3" {...field} />
                  </FormControl>
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="my-4">
              {/* <Button type="button" variant="outline">
                Cancel
              </Button> */}
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
