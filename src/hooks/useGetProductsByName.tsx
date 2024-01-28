import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { api } from "@/trpc/react";

export function useGetProductsByName(productName: string) {
  const [debouncedName, setDebouncedName] = useState(productName);

  const debounced = useDebouncedCallback(
    (name: string) => {
      setDebouncedName(name);
    },
    100, // debounce time in ms
  );

  useEffect(() => {
    debounced(productName);
  }, [productName, debounced]);

  return api.product.getProductByName.useQuery(
    { name: debouncedName },
    {
      enabled: debouncedName !== "",
      staleTime: Infinity,
    },
  );
}
