// app/api/orders/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/services/orderService";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    // Vérifier si la commande existe
    const order = await prisma.commande.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Commande non trouvée" },
        { status: 404 }
      );
    }

    // Supprimer les détails de la commande d'abord
    await prisma.detailsCommande.deleteMany({
      where: { idCommande: orderId },
    });

    // Supprimer la commande
    await prisma.commande.delete({
      where: { id: orderId },
    });

    return NextResponse.json(
      { message: "Commande supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de la commande:", error);
    return NextResponse.json(
      { error: "Impossible de supprimer la commande" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const body = await req.json();
    const { statut } = body;

    if (!statut || !['validee', 'invalidee'].includes(statut)) {
      return NextResponse.json(
        { error: "Statut de commande invalide" },
        { status: 400 }
      );
    }

    const updatedOrder = await updateOrderStatus(orderId, statut);

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la commande" },
      { status: 500 }
    );
  }
}