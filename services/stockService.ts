import { PrismaClient, Stock} from "@prisma/client";

const prisma = new PrismaClient();

export async function GetAllStocks(): Promise<Stock[]> {
  try {
      const stocks = await prisma.stock.findMany({
          
      });
      return stocks;
  } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch bookings");
  }
}