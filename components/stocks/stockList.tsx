import React, { forwardRef, useImperativeHandle } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stock } from "@prisma/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import { useToast } from "@/hooks/use-toast";

export type StockWithRelations = Stock
export type StockListRef = {
  refresh: () => void;
};

const StockList = forwardRef<StockListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupération des stocks
  const { data: stocks, isLoading, error, refetch } = useQuery<StockWithRelations[], Error>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((res) => res.json()),
  });

  // Expose la méthode `refresh` au composant parent
  useImperativeHandle(ref, () => ({
    refresh: refetch,
  }));

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Produit</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks?.map((stock) => (
          <TableRow key={stock.id}>
            <TableCell>{stock.nom}</TableCell>
            <TableCell>{stock.description}</TableCell>
            <TableCell>{stock.quantiteDisponible}</TableCell>
            <TableCell>{stock.type}</TableCell>
            
            
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});

StockList.displayName = "StockList";

export default StockList;
