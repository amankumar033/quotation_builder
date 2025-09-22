import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Create meal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, vegOption, nonVegOption, price } = body;
    const agencyId = "cmfntj4f60000nq4wt321fgsa";

    const parsedVeg = vegOption === true || vegOption === "true";
    const parsedNonVeg = nonVegOption === true || nonVegOption === "true";
    const parsedPrice = parseFloat(price);

    if (!type || isNaN(parsedPrice)) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    if (parsedVeg && parsedNonVeg) {
      return NextResponse.json({ success: false, error: "Cannot select both Veg and Non-Veg" }, { status: 400 });
    }

    const meal = await prisma.meal.create({
      data: {
        type,
        vegOption: parsedVeg,
        nonVegOption: parsedNonVeg,
        price: parsedPrice,
        agencyId,
      },
    });

    return NextResponse.json({ success: true, meal }, { status: 201 });
  } catch (error: any) {
    console.error("Meal creation error:", error);
    return NextResponse.json({ success: false, error: error.message || "Something went wrong" }, { status: 500 });
  }
}

// PUT: Update meal - FIXED to use path parameter
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { type, vegOption, nonVegOption, price } = body;

    if (!id) return NextResponse.json({ success: false, error: "Meal ID required" }, { status: 400 });

    const parsedVeg = vegOption === true || vegOption === "true";
    const parsedNonVeg = nonVegOption === true || nonVegOption === "true";
    const parsedPrice = parseFloat(price);

    const meal = await prisma.meal.update({
      where: { id },
      data: {
        type,
        vegOption: parsedVeg,
        nonVegOption: parsedNonVeg,
        price: parsedPrice,
      },
    });

    return NextResponse.json({ success: true, meal }, { status: 200 });
  } catch (error: any) {
    console.error("Meal update error:", error);
    return NextResponse.json({ success: false, error: error.message || "Something went wrong" }, { status: 500 });
  }
}

// GET: Get single meal by ID (path parameter) or all meals - FIXED
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // If ID is provided in path, return single meal
    if (id) {
      const meal = await prisma.meal.findUnique({ 
        where: { id } 
      });
      
      if (!meal) {
        return NextResponse.json({ 
          success: false, 
          error: "Meal not found" 
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: { ...meal, price: Number(meal.price) }
      });
    }

    // Return all meals if no ID in path (this case shouldn't happen with [id] route)
    const meals = await prisma.meal.findMany();
    return NextResponse.json({ success: true, data: meals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Delete meal by ID - ADD THIS
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ success: false, error: "Meal ID required" }, { status: 400 });
    }

    const meal = await prisma.meal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: meal });
  } catch (error: any) {
    console.error("Meal deletion error:", error);
    return NextResponse.json({ success: false, error: error.message || "Something went wrong" }, { status: 500 });
  }
}