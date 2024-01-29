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
import React, { useMemo, useState } from "react";
import {
  type Transaction,
  TransactionType,
  type Product,
} from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useGetCustomerByName } from "@/hooks/useGetCustomerByName";
import { useGetProductsByName } from "@/hooks/useGetProductsByName";
import { useGetSupplierByName } from "@/hooks/useGetSupplierByName";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { Card, CardHeader } from "./ui/card";

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

  const [customerName, setCustomerName] = useState("");
  const customerResult = useGetCustomerByName(customerName);

  const [supplierName, setSupplierName] = useState("");
  const supplierResult = useGetSupplierByName(supplierName);

  const [productName, setProductName] = useState("");
  const productResult = useGetProductsByName(productName);

  const productsResult = api.product.getByIds.useQuery(
    transaction.products.map((product) => product.id),
    {
      enabled: transaction.products.length > 0,
    },
  );

  const selectedCustomerResult = api.customer.getByCustomerId.useQuery(
    { customerId: transaction.customerId ?? "" },
    {
      enabled: transaction.customerId !== null,
    },
  );

  console.log(selectedCustomerResult.data?.name);

  const selectedSupplierResult = api.supplier.getBySupplierId.useQuery(
    { supplierId: transaction.supplierId ?? "" },
    {
      enabled: transaction.supplierId !== null,
    },
  );

  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Product>
  >({});

  // update the value of selected products when productsResult changes or is fetched
  useMemo(() => {
    if (productsResult.data) {
      setSelectedProducts(
        productsResult.data.reduce((acc, curr) => {
          acc[curr.id] = curr;
          return acc;
        }, {}),
      );
    }
  }, [productsResult.data]);

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
      products: transaction.products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        price: product.price,
      })),
    },
  });

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
            {form.getValues("products").length === 0 && (
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
            )}

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

            {form.getValues("type") === TransactionType.RECEIVED ||
            form.getValues("type") === TransactionType.RECEIVABLE ? (
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Customer</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              " justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {customerResult?.data?.find(
                              (customer) => customer.id === field?.value,
                            )?.name ??
                              selectedCustomerResult?.data?.name ??
                              "Select a customer"}

                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput
                            value={customerName}
                            onValueChange={setCustomerName}
                            placeholder="Search customer..."
                          />
                          <CommandEmpty>No customer found.</CommandEmpty>
                          <CommandGroup>
                            {customerResult?.data?.map((customer) => (
                              <CommandItem
                                value={customer.name}
                                key={customer.id}
                                onSelect={() => {
                                  form.setValue("customerId", customer.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    customer.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {customer.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            ) : (
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Supplier</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              " justify-between",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {supplierResult?.data?.find(
                              (supplier) => supplier.id === field?.value,
                            )?.name ??
                              selectedSupplierResult?.data?.name ??
                              "Select a supplier"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" p-0">
                        <Command>
                          <CommandInput
                            value={supplierName}
                            onValueChange={setSupplierName}
                            placeholder="Search supplier..."
                          />
                          <CommandEmpty>No supplier found.</CommandEmpty>
                          <CommandGroup>
                            {supplierResult?.data?.map((supplier) => (
                              <CommandItem
                                value={supplier.name}
                                key={supplier.id}
                                onSelect={() => {
                                  form.setValue("supplierId", supplier.id);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    supplier.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {supplier.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            )}

            <FormField
              control={form.control}
              name="products"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Products</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="justify-between"
                          role="combobox"
                        >
                          Select Products
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className=" p-0">
                      <Command>
                        <CommandInput
                          value={productName}
                          onValueChange={setProductName}
                          placeholder="Search product..."
                        />
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {productResult?.data?.map((product) => (
                            <CommandItem
                              value={product.name}
                              key={product.id}
                              onSelect={() => {
                                setSelectedProducts({
                                  ...selectedProducts,
                                  [product.id]: product,
                                });
                                form.setValue("products", [
                                  ...field.value!,
                                  {
                                    id: product.id,
                                    quantity: 1,
                                    price: product.sellingPrice,
                                  },
                                ]);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value?.some((p) => p.id === product.id)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                              {product.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                  {form.getValues("products").length > 0 && (
                    <div className="rounded-md bg-gray-100 px-2 py-1">
                      <p className="font-semibold">Selected Products</p>
                      {form.getValues("products").map((product) => (
                        <Card key={product.id}>
                          <CardHeader className="flex flex-row items-baseline space-x-2">
                            <span>
                              {selectedProducts?.[product?.id]?.name} x{" "}
                            </span>
                            <input
                              className="inline w-24 rounded-md border-2 border-gray-200 p-1"
                              placeholder="Quantity"
                              type="number"
                              value={product.quantity}
                              onChange={(e) => {
                                const newProducts = form
                                  .getValues("products")
                                  ?.map((p) => {
                                    if (p.id === product.id) {
                                      return {
                                        ...p,
                                        quantity: Number(e.target.value),
                                      };
                                    }
                                    return p;
                                  });
                                form.setValue("products", newProducts);
                              }}
                            />
                            <span>
                              {" "}
                              ={" $"}
                              {selectedProducts[product?.id]?.sellingPrice *
                                product.quantity}
                            </span>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const newProducts = form
                                  .getValues("products")
                                  ?.filter((p) => p.id !== product.id);
                                form.setValue("products", newProducts);
                              }}
                            >
                              <X className="h-6 w-6 text-gray-400" />
                            </Button>
                          </CardHeader>
                        </Card>
                      ))}
                      <div className="py-2 font-bold">
                        <p className="inline">Total Amount = </p>
                        <p className="inline">
                          $
                          {form
                            .getValues("products")
                            ?.reduce(
                              (acc, curr) =>
                                acc +
                                selectedProducts[curr.id]?.sellingPrice *
                                  curr.quantity,
                              0,
                            )}
                        </p>
                      </div>
                    </div>
                  )}
                </FormItem>
              )}
            ></FormField>

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
