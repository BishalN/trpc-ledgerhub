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
import { TransactionValidationSchema } from "@/lib/validation";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "./ui/select";
import { type Product, TransactionType } from "@prisma/client";
import { Textarea } from "./ui/textarea";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  Check,
  ChevronsUpDown,
  CrossIcon,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useGetCustomerByName } from "@/hooks/useGetCustomerByName";
import { useGetSupplierByName } from "@/hooks/useGetSupplierByName";
import { useGetProductsByName } from "@/hooks/useGetProductsByName";
import { Card, CardHeader } from "./ui/card";
import { CreateCustomerDialog } from "./create-customer-dialog";
import { CreateProductDialog } from "./create-product-dialog";

export function CreateTransactionDialog() {
  const { ledgerId } = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const customerResult = useGetCustomerByName(customerName);

  const [supplierName, setSupplierName] = useState("");
  const supplierResult = useGetSupplierByName(supplierName);

  const [productName, setProductName] = useState("");
  const productResult = useGetProductsByName(productName);

  const [selectedProducts, setSelectedProducts] = useState<
    Record<string, Product>
  >({});

  const createTransaction = api.transaction.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Transaction Created Successfully",
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

  // TODO: Handle the stocks of the products as well
  const form = useZodForm({
    schema: TransactionValidationSchema,
    defaultValues: {
      amount: 2, // if products is defined then amount is disabled and derived from products
      type: TransactionType.RECEIVED,
      remarks: "",
      ledgerId: String(ledgerId ?? ""),
      customerId: "",
      supplierId: "",
      products: [],
    },
  });

  console.log(form.formState.errors);

  const onSubmit = form.handleSubmit(async (values) => {
    await createTransaction.mutateAsync(values);
    form.reset();
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <ArrowLeftRight className="mr-2 h-4 w-4" /> Create Transaction
        </Button>
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
                            {/* // here label will be name and value will be customerId */}
                            {field.value
                              ? customerResult?.data?.find(
                                  (customer) => customer.id === field.value,
                                )?.name
                              : "Select a customer"}
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
                          {/* Todo: 
                          Handle autoclose of transaction dialog before create customer
                          */}
                          <CommandEmpty>
                            <div className="space-y-2">
                              <p>No customer found.</p>
                              <CreateCustomerDialog />
                            </div>
                          </CommandEmpty>
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
                            {/* // here label will be name and value will be customerId */}
                            {field.value
                              ? supplierResult?.data?.find(
                                  (supplier) => supplier.id === field.value,
                                )?.name
                              : "Select a supplier"}
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
                        <CommandEmpty>
                          <div className="space-y-3">
                            <p>No product found.</p>
                            <CreateProductDialog />
                          </div>
                        </CommandEmpty>
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
                                    name: product.name,
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
                            <span>{selectedProducts[product.id]?.name} x </span>
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
                                selectedProducts[curr.id].sellingPrice *
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
