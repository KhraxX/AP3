"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"

// Définition du schéma de validation
const OrderFormSchema = z.object({
  idStock: z.string().min(1, {
    message: "Veuillez sélectionner un produit.",
  }),
  quantite: z.coerce.number().min(1, {
    message: "La quantité doit être supérieure à 0.",
  }),
  description: z.string().optional(),
})

type OrderFormValues = z.infer<typeof OrderFormSchema>

type Stock = {
  id: number
  nom: string
  quantiteDisponible: number
  type: 'medicament' | 'materiel'
}

export function OrderForm({ onFormSubmit }: { onFormSubmit: (data: OrderFormValues) => void }) {
  // Récupération des stocks
  const { data: stocks = [], isLoading: isLoadingStocks } = useQuery<Stock[]>({
    queryKey: ["stocks"],
    queryFn: () => fetch("/api/stocks").then((res) => res.json()),
  })

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(OrderFormSchema),
    defaultValues: {
      idStock: "",
      quantite: 1,
      description: "",
    },
  })

  function onSubmit(values: OrderFormValues) {
    console.log("Valeurs du formulaire:", values)
    onFormSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="idStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produit</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un produit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {stocks.map((stock) => (
                    <SelectItem key={stock.id} value={stock.id.toString()}>
                      {stock.nom} ({stock.quantiteDisponible} disponibles)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quantite"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantité</FormLabel>
              <FormControl>
                <Input type="number" min="1" {...field} />
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
              <FormLabel>Description (optionnelle)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Commander</Button>
      </form>
    </Form>
  )
}