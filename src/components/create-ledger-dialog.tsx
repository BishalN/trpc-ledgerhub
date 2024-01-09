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

import { z } from "zod";
import { toast } from "./ui/use-toast";
import { useZodForm } from "@/hooks/use-zod-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useRouter } from "next/navigation";

export const LedgerValidationSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
});

export function CreateLedgerDialog() {
  const router = useRouter();
  const createLedger = api.ledger.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ledger Created Successfully",
      });

      router.refresh();
      // TODO: close the dialog
      // refresh the page
    },
    onError: (e) => {
      toast({
        title: "Error",
        description: e.message,
      });
    },
  });

  const form = useZodForm({
    schema: LedgerValidationSchema,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createLedger.mutateAsync(values);
    form.reset();
    // TODO: close the dialog
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create Ledger</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Ledger</DialogTitle>
          <DialogDescription>
            Ledger allows you to manage your business transactions
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="text-right">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="Enter Your Business Name"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="my-4">
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
