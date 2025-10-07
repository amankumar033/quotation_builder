import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // path to your singleton



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Hotel ID is required" },
        { status: 400 }
      );
    }

    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: { roomTypes: true },
    });

    if (!hotel) {
      return NextResponse.json(
        { success: false, error: "hotel not found" },
        { status: 404 }
      );
    }

    console.log("gvvhjhbhjbjbjjkkjkjkjjopipoiohjbhjbb b vhcghgfyugyyuijnj ",hotel)
    return NextResponse.json({ success: true, data: hotel });
  } catch (error: any) {
    console.error("hotel fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}


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



export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, city, starCategory, cancellation, inclusions, photos, roomTypes } = body;

    // Update hotel
    const updatedHotel = await prisma.hotel.update({
      where: { id },
      data: {
        name,
        city,
        starCategory: Number(starCategory),
        cancellation: cancellation || null,
        inclusions: inclusions.length ? JSON.stringify(inclusions) : null,
        photos: photos.length ? JSON.stringify(photos) : null,
        roomTypes: {
          // delete old room types and create new
          deleteMany: {},
          create: roomTypes.map((r: { type: string; price: number }) => ({
            type: r.type,
            price: r.price,
          })),
        },
      },
      include: { roomTypes: true },
    });

    return NextResponse.json({ success: true, hotel: updatedHotel });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}


export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // params contains the hotel id
    if (!id) {
      return NextResponse.json({ success: false, error: "Hotel ID is required" }, { status: 400 });
    }

    console.log("Deleting hotel with ID:", id);

    // Delete the hotel (Prisma cascades roomTypes if defined with onDelete)
    const deletedHotel = await prisma.hotel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, hotel: deletedHotel });
  } catch (error) {
    console.error("Hotel deletion error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}