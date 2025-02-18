import { GetAllStocks } from "@/services/stockService";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const stocks = await GetAllStocks();
    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}