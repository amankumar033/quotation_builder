// app/api/transports/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vehicleType, perDay, perKm, maxCapacity, notes, photos} = body;
    const agencyId = "cmfntj4f60000nq4wt321fgsa"
    // Validate required fields
    if (!vehicleType || perDay == null || perKm == null || !maxCapacity || !agencyId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Ensure agency exists
    const agency = await prisma.agency.findUnique({ where: { id: agencyId } });
    if (!agency) {
      return NextResponse.json(
        { success: false, error: "Agency not found" },
        { status: 400 }
      );
    }

    // Create transport
    const transport = await prisma.transport.create({
      data: {
        vehicleType,
        perDay: Number(perDay),
        perKm: Number(perKm),
        maxCapacity: Number(maxCapacity),
        notes: notes || null,
        photos: photos && photos.length > 0 ? JSON.stringify(photos) : null,
        agencyId,
      },
    });

    return NextResponse.json({ success: true, transport });
  } catch (error: any) {
    console.error("Error creating transport:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const transports = await prisma.transport.findMany();
    return NextResponse.json({ success: true, data: transports });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}