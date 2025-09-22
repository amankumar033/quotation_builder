import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description, duration, price, photos } = body;
    const agencyId = "cmfntj4f60000nq4wt321fgsa"; // replace with session later

    // Validate price
    const parsedPrice = parseFloat(price);
    if (!name || isNaN(parsedPrice)) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    // Create activity
    const activity = await prisma.activity.create({
      data: {
        name,
        description: description || null,
        duration: duration || null,
        price: parsedPrice,
        photos: photos || [],
        agencyId,
      },
    });

    return NextResponse.json({ success: true, activity }, { status: 201 });
  } catch (error: any) {
    console.error("Activity creation error:", error);
    return NextResponse.json({ success: false, error: error.message || "Something went wrong" }, { status: 500 });
  }
}

// GET /api/activities/:id
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const activity = await prisma.activity.findUnique({
    where: { id },
  });

  if (!activity) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: activity });
}


// DELETE /api/activities/:id
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const deleted = await prisma.activity.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, data: deleted });
}


export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
 const agencyId = "cmfntj4f60000nq4wt321fgsa"; // replace with session later

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description || null,
        duration: body.duration || null,
        price: parseFloat(body.price),
        photos: body.photos || [],
    agencyId,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Activity update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}


