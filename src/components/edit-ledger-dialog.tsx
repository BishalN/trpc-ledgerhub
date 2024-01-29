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
import { type Ledger } from "@prisma/client";

export const LedgerValidationSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(3),
  id: z.string(),
});

export function EditLedgerDialog({
  ledger,
  open,
  setOpen,
}: {
  ledger: Ledger;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();

  const updateLedger = api.ledger.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Ledger Updated Successfully",
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
    schema: LedgerValidationSchema,
    defaultValues: {
      name: ledger.name,
      id: ledger.id,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await updateLedger.mutateAsync(values);
    form.reset();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Ledger</DialogTitle>
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
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
