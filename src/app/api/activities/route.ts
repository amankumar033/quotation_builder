import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path if different

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, duration, price, photos } = body;
    const agencyId = "cmfntj4f60000nq4wt321fgsa"; // replace with session later

    // Parse values
    const parsedPrice = parseFloat(price);

    if (!name || isNaN(parsedPrice) || !agencyId) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        description,
        duration,
        price: parsedPrice,
        photos: photos || [],
        agencyId,
      },
    });

    return NextResponse.json({ success: true, activity });
  } catch (error: any) {
    console.error("Activity creation error:", error);
    return NextResponse.json({ success: false, error: error.message || "Something went wrong" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const activities = await prisma.activity.findMany();
    return NextResponse.json({ success: true, data: activities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get activities ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Activity ID is required" }, { status: 400 });
    }

    // Delete the activity and its related room types
    const deletedActivity = await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, hotel: deletedActivity });
  } catch (error) {
    console.error(" Activity error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}