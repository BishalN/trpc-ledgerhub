import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { api } from "@/trpc/react";

export function useGetCustomerByName(customerName: string) {
  const [debouncedName, setDebouncedName] = useState(customerName);

  const debounced = useDebouncedCallback(
    (name: string) => {
      setDebouncedName(name);
    },
    100, // debounce time in ms
  );

  useEffect(() => {
    debounced(customerName);
  }, [customerName, debounced]);

  return api.customer.getCustomerByName.useQuery(
    { name: debouncedName },
    {
      enabled: debouncedName !== "",
      staleTime: Infinity,
    },
  );
}
