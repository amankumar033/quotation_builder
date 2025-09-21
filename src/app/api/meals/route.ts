import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust path if needed

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { type, vegOption, nonVegOption, price } = body;
    const agencyId = "cmfntj4f60000nq4wt321fgsa";

    // Convert inputs to correct types
    const parsedVeg = vegOption === true || vegOption === "true";
    const parsedNonVeg = nonVegOption === true || nonVegOption === "true";
    const parsedPrice = parseFloat(price);

    // Basic validation
    if (!type || isNaN(parsedPrice) || !agencyId) {
      return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
    }

    // Ensure only one option
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

    return NextResponse.json({ success: true, meal });
  } catch (error: any) {
    console.error("Meal creation error:", error);
    return NextResponse.json({ success: false, error: error.message || "Something went wrong" }, { status: 500 });
  }
}
export async function GET() {
  try {
    const meals = await prisma.meal.findMany();
    console.log("tptal meals available:",meals)
    return NextResponse.json({ success: true, data: meals });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Get meals ID from query params
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Meal ID is required" }, { status: 400 });
    }

    // Delete the meal and its related room types
    const deletedMeal = await prisma.meal.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, hotel: deletedMeal });
  } catch (error) {
    console.error("Meal deletion error:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}