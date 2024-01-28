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
import { UpdateCustomerValidationSchema } from "@/lib/validation";
import { Textarea } from "./ui/textarea";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { type Customer } from "@prisma/client";

export function EditCustomerDialog({
  customer,
  open,
  setOpen,
}: {
  customer: Customer;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  console.log(customer);

  const updateCustomer = api.customer.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Customer Updated Successfully",
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
    schema: UpdateCustomerValidationSchema,
    defaultValues: {
      ledgerId: customer.ledgerId,
      name: customer.name,
      description: customer.description ?? "",
      userId: customer.id,
      // email: customer.email,
      // phone: customer.phone,
      // address: customer.address,
    },
  });

  console.log(form.formState.errors);

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    await updateCustomer.mutateAsync(values);
    form.reset();
    // TODO: close the dialog
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Customer</DialogTitle>
          <DialogDescription>Enter details of your customer</DialogDescription>
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
