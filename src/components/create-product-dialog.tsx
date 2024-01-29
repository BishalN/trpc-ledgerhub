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
import { ProductValidationSchema } from "@/lib/validation";
import { Textarea } from "./ui/textarea";
import { useRouter } from "next/navigation";
import { ArrowLeftRight } from "lucide-react";
import React from "react";

export function CreateProductDialog() {
  // use params to get the ledger id
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product Created Successfully",
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
    schema: ProductValidationSchema,
    defaultValues: {
      name: "",
      description: "",
      costPrice: 0,
      sellingPrice: 0,
      stock: 0,
      barcode: "",
      thumbnail: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createProduct.mutateAsync(values);
    form.reset();
    // TODO: close the dialog
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowLeftRight className="mr-2 h-4 w-4" /> Create Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
          <DialogDescription>Enter details of your product</DialogDescription>
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
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="costPrice" className="text-right">
                    Cost Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="costPrice"
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
              name="sellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="sellingPrice" className="text-right">
                    Selling Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="sellingPrice"
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
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="stock" className="text-right">
                    Stocks
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="stock"
                      type="number"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    No. of Items available in inventory
                  </FormDescription>
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
