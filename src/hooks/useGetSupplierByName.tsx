import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { api } from "@/trpc/react";

export function useGetSupplierByName(supplierName: string) {
  const [debouncedName, setDebouncedName] = useState(supplierName);

  const debounced = useDebouncedCallback(
    (name: string) => {
      setDebouncedName(name);
    },
    100, // debounce time in ms
  );

  useEffect(() => {
    debounced(supplierName);
  }, [supplierName, debounced]);

  return api.supplier.getSupplierByName.useQuery(
    { name: debouncedName },
    {
      enabled: debouncedName !== "",
      staleTime: Infinity,
    },
  );
}
