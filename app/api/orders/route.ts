// app/api/orders/route.ts
import { createOrder } from "@/services/orderService";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const commandes = await prisma.commande.findMany({
      include: {
        utilisateur: true,
        detailsCommande: {
          include: {
            stock: true,
          },
        },
      },
      orderBy: {
        dateCommande: 'desc',
      },
    });

    return NextResponse.json(commandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les commandes" },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle commande
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Données reçues dans l'API:", body);

    if (!body.idUtilisateur || !body.details || !Array.isArray(body.details) || body.details.length === 0) {
      console.error("Données invalides:", body);
      return NextResponse.json(
        { error: "Données de commande invalides" },
        { status: 400 }
      );
    }

    // Validation des détails
    const invalidDetails = body.details.some(
      (detail: any) => !detail.idStock || typeof detail.quantite !== 'number'
    );

    if (invalidDetails) {
      console.error("Détails de commande invalides:", body.details);
      return NextResponse.json(
        { error: "Les détails de la commande sont invalides" },
        { status: 400 }
      );
    }

    const newOrder = await createOrder({
      idUtilisateur: body.idUtilisateur,
      details: body.details,
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}