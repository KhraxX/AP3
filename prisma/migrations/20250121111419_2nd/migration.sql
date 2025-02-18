-- CreateEnum
CREATE TYPE "TypeMouvement" AS ENUM ('entree', 'sortie');

-- CreateEnum
CREATE TYPE "TypeStock" AS ENUM ('medicament', 'materiel');

-- CreateEnum
CREATE TYPE "StatutCommande" AS ENUM ('en_attente', 'validee', 'invalidee');

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "idRole" INTEGER NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantiteDisponible" INTEGER NOT NULL,
    "type" "TypeStock" NOT NULL,

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "idUtilisateur" INTEGER NOT NULL,
    "dateCommande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutCommande" NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DetailsCommande" (
    "idCommande" INTEGER NOT NULL,
    "idStock" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,

    CONSTRAINT "DetailsCommande_pkey" PRIMARY KEY ("idCommande","idStock")
);

-- CreateTable
CREATE TABLE "Mouvement" (
    "id" SERIAL NOT NULL,
    "idStock" INTEGER NOT NULL,
    "typeMouvement" "TypeMouvement" NOT NULL,
    "quantite" INTEGER NOT NULL,
    "dateMouvement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idCommande" INTEGER,

    CONSTRAINT "Mouvement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_nom_key" ON "Role"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- AddForeignKey
ALTER TABLE "Utilisateur" ADD CONSTRAINT "Utilisateur_idRole_fkey" FOREIGN KEY ("idRole") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_idUtilisateur_fkey" FOREIGN KEY ("idUtilisateur") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailsCommande" ADD CONSTRAINT "DetailsCommande_idCommande_fkey" FOREIGN KEY ("idCommande") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetailsCommande" ADD CONSTRAINT "DetailsCommande_idStock_fkey" FOREIGN KEY ("idStock") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouvement" ADD CONSTRAINT "Mouvement_idStock_fkey" FOREIGN KEY ("idStock") REFERENCES "Stock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mouvement" ADD CONSTRAINT "Mouvement_idCommande_fkey" FOREIGN KEY ("idCommande") REFERENCES "Commande"("id") ON DELETE SET NULL ON UPDATE CASCADE;
