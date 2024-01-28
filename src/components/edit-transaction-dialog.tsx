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
import { UpdateTransactionValidationSchema } from "@/lib/validation";
import { Textarea } from "./ui/textarea";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { type Transaction, TransactionType } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function EditTransactionDialog({
  transaction,
  open,
  setOpen,
}: {
  transaction: Transaction;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const { ledgerId } = useParams();

  const updateTransaction = api.transaction.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction Updated Successfully",
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
    schema: UpdateTransactionValidationSchema,
    defaultValues: {
      amount: transaction.amount,
      type: transaction.type,
      remarks: transaction.remarks as TransactionType,
      ledgerId: String(ledgerId ?? ""),
      transactionId: transaction.id,
      customerId: transaction.customerId ?? "",
      supplierId: transaction.supplierId ?? "",
    },
  });

  console.log(form.formState.errors);

  const onSubmit = form.handleSubmit(async (values) => {
    await updateTransaction.mutateAsync(values);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>
            Update details of your transaction
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={onSubmit}>
            {/* // TODO: use a dollar sign icon */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="amount" className="text-right">
                    Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="Amount"
                      type="number"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="type" className="text-right">
                    Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Transaction Types</SelectLabel>
                          <SelectItem value={TransactionType.RECEIVED}>
                            {TransactionType.RECEIVED}
                          </SelectItem>
                          <SelectItem value={TransactionType.RECEIVABLE}>
                            {TransactionType.RECEIVABLE}
                          </SelectItem>
                          <SelectItem value={TransactionType.PAID}>
                            {TransactionType.PAID}
                          </SelectItem>
                          <SelectItem value={TransactionType.PAYABLE}>
                            {TransactionType.PAYABLE}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="remarks" className="text-right">
                    Remarks
                  </FormLabel>
                  <FormControl>
                    <Textarea id="remarks" className="col-span-3" {...field} />
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
