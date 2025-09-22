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

export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: { roomTypes: true }, // include room types
    });
    console.log(hotels)
    return NextResponse.json({ success: true, data: hotels });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get hotel ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Hotel ID is required" }, { status: 400 });
    }

    // Delete the hotel and its related room types
    const deletedHotel = await prisma.hotel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, hotel: deletedHotel });
  } catch (error) {
    console.error("Hotel deletion error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}