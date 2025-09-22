import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // path to your singleton



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Fetch single hotel by ID
      const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: { roomTypes: true },
      });
      if (!hotel) {
        return NextResponse.json({ success: false, error: "Hotel not found" }, { status: 404 });
      }
      return NextResponse.json(hotel);
    }

    // Fetch all hotels if no ID
    const hotels = await prisma.hotel.findMany({
      include: { roomTypes: true },
    });
    return NextResponse.json({ success: true, data: hotels });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}