"use client"

import { useRef, useState } from "react"
import OrderList, { OrderListRef } from "@/components/orders/orderList"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useAuth } from "@/context/AuthContext"
import { Plus } from "lucide-react"
import { OrderForm } from "@/components/orders/orderForm"
import { cn } from "@/lib/utils"
import { useToast } from '@/hooks/use-toast'

export default function Page() {
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const orderListRef = useRef<OrderListRef>(null)

  const handleNewOrder = () => {
    setIsDialogOpen(true)
  }

  const handleFormSubmit = async (formData: { idStock: string; quantite: number; description?: string }) => {
    try {
      if (!user?.id) {
        throw new Error("Utilisateur non connecté");
      }
  
      console.log("Données du formulaire:", formData);
  
      const payload = {
        idUtilisateur: 1, // À remplacer par l'ID réel de l'utilisateur
        details: [{
          idStock: parseInt(formData.idStock),
          quantite: formData.quantite
        }]
      };
  
      console.log("Payload à envoyer:", payload);
  
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
  
      const responseData = await response.json();
      console.log("Réponse du serveur:", responseData);
  
      if (!response.ok) {
        throw new Error(responseData.error || "Erreur lors de la création de la commande");
      }
  
      setIsDialogOpen(false);
      toast({
        title: 'Succès',
        description: 'Commande créée avec succès',
        variant: 'default',
      });
      orderListRef.current?.refresh();
  
    } catch (error) {
      console.error("Erreur détaillée:", error);
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Impossible de créer la commande',
        variant: 'destructive',
      });
    }
  }

  if (loading) return <p>Chargement...</p>

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Gestion des commandes</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="border-none">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between">
                  <h2>Liste des commandes</h2>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={handleNewOrder}>
                        <Plus className="mr-2 h-4 w-4" /> 
                        Nouvelle commande
                      </Button>
                    </DialogTrigger>
                    <DialogContent
                      className={cn(
                        "sm:max-w-[600px] w-full max-h-[90vh]",
                        "overflow-y-auto"
                      )}
                      
                    >
                      <DialogHeader>
                        <DialogTitle>Nouvelle commande</DialogTitle>
                      </DialogHeader>
                      <div className="grid py-4 gap-4">
                        <OrderForm onFormSubmit={handleFormSubmit} />
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <OrderList ref={orderListRef}/>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}