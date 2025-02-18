import { PrismaClient, StatutCommande } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllOrders() {
  try {
    const orders = await prisma.commande.findMany({
      include: {
        utilisateur: true,
        detailsCommande: {  // En camelCase
          include: {
            stock: true,
          },
        },
      },
    });
    return orders;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de récupérer les commandes");
  }
}

export async function createOrder(data: {
  idUtilisateur: number;
  details: Array<{
    idStock: number;
    quantite: number;
  }>;
}) {
  try {
    // Vérification de l'utilisateur
    const userExists = await prisma.utilisateur.findUnique({
      where: { id: data.idUtilisateur },
    });

    if (!userExists) {
      throw new Error("Utilisateur non trouvé");
    }

    const order = await prisma.commande.create({
      data: {
        idUtilisateur: data.idUtilisateur,
        statut: "en_attente" as StatutCommande,
        detailsCommande: {  // En camelCase
          create: data.details.map(detail => ({
            idStock: detail.idStock,
            quantite: detail.quantite,
          })),
        },
      },
      include: {
        utilisateur: true,
        detailsCommande: {  // En camelCase
          include: {
            stock: true,
          },
        },
      },
    });

    return order;
  } catch (error) {
    console.error("Erreur détaillée lors de la création de la commande:", error);
    if (error instanceof Error) {
      throw new Error(`Erreur lors de la création de la commande: ${error.message}`);
    }
    throw new Error("Erreur lors de la création de la commande");
  }
}

export async function getAllStock() {
  try {
    const stocks = await prisma.stock.findMany();
    return stocks;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de récupérer le stock");
  }
}

export async function updateOrderStatus(id: number, statut: 'validee' | 'invalidee') {
  try {
    const order = await prisma.commande.update({
      where: { id },
      data: { statut },
    });
    return order;
  } catch (error) {
    console.error(error);
    throw new Error("Impossible de mettre à jour le statut de la commande");
  }
}