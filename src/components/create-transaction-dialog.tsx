/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  type ServerTransactionType,
  TransactionValidationSchema,
} from "@/lib/validation";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "./ui/select";
import { TransactionType } from "@prisma/client";
import { Textarea } from "./ui/textarea";
import { useParams, useRouter } from "next/navigation";

export function CreateTransactionDialog() {
  // use params to get the ledger id
  const { id: ledgerId } = useParams();
  const router = useRouter();
  const createTransaction = api.transaction.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction Created Successfully",
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

  console.log(ledgerId);

  const form = useZodForm({
    schema: TransactionValidationSchema,
    defaultValues: {
      amount: "0.00",
      type: TransactionType.RECEIVED,
      remarks: "",
      ledgerId: String(ledgerId ?? ""),
    },
  });

  console.log(form.formState.errors);

  const onSubmit = form.handleSubmit(async (values) => {
    console.log(values);
    // @ts-expect-error
    await createTransaction.mutateAsync(values as ServerTransactionType);
    form.reset();
    // TODO: close the dialog
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Transaction</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Transaction</DialogTitle>
          <DialogDescription>
            Enter details of your transaction
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
