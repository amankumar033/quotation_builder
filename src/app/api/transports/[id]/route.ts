import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single transport by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transport ID is required" },
        { status: 400 }
      );
    }

    const transport = await prisma.transport.findUnique({
      where: { id },
    });

    if (!transport) {
      return NextResponse.json(
        { success: false, error: "Transport not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: transport });
  } catch (error: any) {
    console.error("Transport fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// UPDATE transport by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transport ID is required for update" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { vehicleType, perDay, perKm, maxCapacity, notes, photos } = body;

    // Validate required fields
    if (!vehicleType || perDay == null || perKm == null || !maxCapacity) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if transport exists
    const existingTransport = await prisma.transport.findUnique({
      where: { id },
    });

    if (!existingTransport) {
      return NextResponse.json(
        { success: false, error: "Transport not found" },
        { status: 404 }
      );
    }

    // Update transport
    const transport = await prisma.transport.update({
      where: { id },
      data: {
        vehicleType,
        perDay: Number(perDay),
        perKm: Number(perKm),
        maxCapacity: Number(maxCapacity),
        notes: notes || null,
        photos: photos && photos.length > 0 ? JSON.stringify(photos) : null,
      },
    });

    return NextResponse.json({ success: true, data: transport }, { status: 200 });
  } catch (error: any) {
    console.error("Transport update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

// DELETE transport by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transport ID is required" },
        { status: 400 }
      );
    }

    const deletedTransport = await prisma.transport.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deletedTransport });
  } catch (error: any) {
    console.error("Transport deletion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}