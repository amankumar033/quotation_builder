import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      type, 
      category, 
      vegOption, 
      nonVegOption, 
      price, 
      image, 
      hotelId, 
      agencyId 
    } = body;

    // Basic validation
    if (!name || !type || !category || price === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: "Name, type, category, and price are required" 
      }, { status: 400 });
    }

    const meal = await prisma.meal.create({
      data: {
        name,
        type,
        category,
        vegOption: Boolean(vegOption),
        nonVegOption: Boolean(nonVegOption),
        price: parseFloat(price),
        image: image || null,
        hotelId: hotelId || null,
        agencyId: agencyId || "AGC1",
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: meal 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Meal creation error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Something went wrong" 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const agencyId = searchParams.get("agencyId") || "AGC1";
    const hotelId = searchParams.get("hotelId");

    let whereClause: any = { agencyId };
    
    if (hotelId) {
      whereClause = {
        ...whereClause,
        OR: [
          { hotelId: hotelId },
          { hotelId: null } // Include standalone meals
        ]
      };
    }

    const meals = await prisma.meal.findMany({
      where: whereClause,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ 
      success: true, 
      data: meals 
    });
  } catch (error: any) {
    console.error("Meals fetch error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Meal ID is required" 
      }, { status: 400 });
    }

    const deletedMeal = await prisma.meal.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      data: deletedMeal 
    });
  } catch (error: any) {
    console.error("Meal deletion error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Something went wrong" 
    }, { status: 500 });
  }
}