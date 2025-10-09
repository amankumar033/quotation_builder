import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get single meal by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Meal ID is required" 
      }, { status: 400 });
    }

    const meal = await prisma.meal.findUnique({
      where: { id },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    if (!meal) {
      return NextResponse.json({ 
        success: false, 
        error: "Meal not found" 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: meal
    });
  } catch (error: any) {
    console.error("Meal fetch error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT: Update meal
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      name, 
      type, 
      category, 
      vegOption, 
      nonVegOption, 
      price, 
      image, 
      hotelId 
    } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Meal ID is required" 
      }, { status: 400 });
    }

    // Check if meal exists
    const existingMeal = await prisma.meal.findUnique({
      where: { id }
    });

    if (!existingMeal) {
      return NextResponse.json({ 
        success: false, 
        error: "Meal not found" 
      }, { status: 404 });
    }

    const updatedMeal = await prisma.meal.update({
      where: { id },
      data: {
        name: name || existingMeal.name,
        type: type || existingMeal.type,
        category: category || existingMeal.category,
        vegOption: vegOption !== undefined ? Boolean(vegOption) : existingMeal.vegOption,
        nonVegOption: nonVegOption !== undefined ? Boolean(nonVegOption) : existingMeal.nonVegOption,
        price: price !== undefined ? parseFloat(price) : existingMeal.price,
        image: image !== undefined ? image : existingMeal.image,
        hotelId: hotelId !== undefined ? hotelId : existingMeal.hotelId,
      },
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            city: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedMeal 
    });
  } catch (error: any) {
    console.error("Meal update error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Something went wrong" 
    }, { status: 500 });
  }
}

// DELETE: Delete meal
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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