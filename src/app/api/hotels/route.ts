import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // path to your singleton


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, city, starCategory, cancellation, inclusions, photos, roomTypes } = body;
const agencyId="cmfntj4f60000nq4wt321fgsa";
    const hotel = await prisma.hotel.create({
      data: {
        name,
        city,
        starCategory: Number(starCategory),
        cancellation: cancellation || null,
        inclusions: inclusions.length ? JSON.stringify(inclusions) : null,
        photos: photos.length ? JSON.stringify(photos) : null,
        agencyId,
        roomTypes: {
          create: roomTypes.map((room: { type: string; price: number }) => ({
            type: room.type,
            price: room.price,
          })),
        },
      },
      include: { roomTypes: true },
    });

    return NextResponse.json({ success: true, hotel }, { status: 201 });
  } catch (error) {
    console.error("Hotel creation error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}


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