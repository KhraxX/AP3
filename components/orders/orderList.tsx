"use client"

import React, { forwardRef, useImperativeHandle } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Commande, Utilisateur, Stock, DetailsCommande } from "@prisma/client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Types pour les relations
export type OrderWithRelations = Commande & {
  utilisateur: Utilisateur;
  detailsCommande: (DetailsCommande & {
    stock: Stock;
  })[];
};

// Type pour la référence du composant
export type OrderListRef = {
  refresh: () => void;
};

const OrderList = forwardRef<OrderListRef>((_, ref) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Récupération des commandes
  const { 
    data: orders, 
    isLoading, 
    error, 
    refetch 
  } = useQuery<OrderWithRelations[], Error>({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/orders");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Erreur lors de la récupération des commandes");
        }
        const data = await response.json();
        console.log("Commandes récupérées:", data);
        return data;
      } catch (error) {
        console.error("Erreur lors de la récupération des commandes:", error);
        throw error;
      }
    },
  });

  // Mutation pour la suppression
  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression de la commande");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: 'Succès',
        description: 'Commande supprimée avec succès',
        variant: 'default',
      });
    },
    onError: (error) => {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        variant: 'destructive',
      });
    },
  });

  // Expose la méthode refresh pour le parent
  useImperativeHandle(ref, () => ({
    refresh: refetch,
  }));

  // Gestion du chargement
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-muted-foreground">Chargement des commandes...</p>
      </div>
    );
  }

  // Gestion des erreurs
  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
        <p className="text-destructive">Erreur: {error.message}</p>
      </div>
    );
  }

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'validee':
        return 'text-green-600 bg-green-100 px-2 py-1 rounded';
      case 'invalidee':
        return 'text-red-600 bg-red-100 px-2 py-1 rounded';
      default:
        return 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded';
    }
  };

  // Fonction pour formatter la date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Si pas de commandes
  if (!orders || orders.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-muted-foreground">Aucune commande trouvée</p>
      </div>
    );
  }

  // Rendu du tableau
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-center">Quantité</TableHead>
            <TableHead>Date de commande</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            order.detailsCommande.map((detail) => (
              <TableRow key={`${order.id}-${detail.idStock}`}>
                <TableCell className="font-medium">{detail.stock.nom}</TableCell>
                <TableCell>{detail.stock.description}</TableCell>
                <TableCell className="text-center">{detail.quantite}</TableCell>
                <TableCell>{formatDate(order.dateCommande.toString())}</TableCell>
                <TableCell>
                  <span className={`font-medium ${getStatusColor(order.statut)}`}>
                    {order.statut}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
                          deleteOrderMutation.mutate(order.id);
                        }
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

OrderList.displayName = "OrderList";

export default OrderList;