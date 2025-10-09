import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      include: { 
        roomTypes: true,
        meals: true,
        activities: true,
      },
    });

    if (!hotel) {
      return NextResponse.json(
        { success: false, error: "Hotel not found" },
        { status: 404 }
      );
    }

    // Parse JSON fields
    const hotelWithParsedData = {
      ...hotel,
      inclusions: hotel.inclusions ? JSON.parse(hotel.inclusions) : [],
      photos: hotel.photos ? JSON.parse(hotel.photos) : [],
      roomTypes: hotel.roomTypes.map(room => ({
        ...room,
        amenities: room.amenities ? JSON.parse(room.amenities) : [],
      }))
    };

    return NextResponse.json({ success: true, data: hotelWithParsedData });
  } catch (error: any) {
    console.error("Hotel fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      name, 
      city, 
      starCategory, 
      cancellation, 
      inclusions, 
      photos, 
      roomTypes, 
      meals, 
      activities 
    } = body;

    // Update hotel with all related data
    const updatedHotel = await prisma.hotel.update({
      where: { id },
      data: {
        name,
        city,
        starCategory: Number(starCategory),
        cancellation: cancellation || null,
        inclusions: inclusions?.length ? JSON.stringify(inclusions) : null,
        photos: photos?.length ? JSON.stringify(photos) : null,
        // Update room types with single image
        roomTypes: {
          deleteMany: {},
          create: roomTypes?.map((room: any) => ({
            type: room.type,
            price: room.price,
            maxAdults: Number(room.maxAdults) || 2,
            maxChildren: Number(room.maxChildren) || 0,
            bedType: room.bedType || null,
            amenities: room.amenities?.length ? JSON.stringify(room.amenities) : null,
            description: room.description || null,
            image: room.image || null, // Single image instead of photos array
          })),
        },
        // Update meals
        meals: {
          deleteMany: {},
          create: meals?.map((meal: any) => ({
            name: meal.name,
            type: meal.type,
            category: meal.category,
            vegOption: meal.category === 'veg',
            nonVegOption: meal.category === 'non-veg',
            price: parseFloat(meal.price),
            image: meal.image || null,
            agencyId: "AGC1",
          })),
        },
        // Update activities
        activities: {
          deleteMany: {},
          create: activities?.map((activity: any) => ({
            name: activity.name,
            description: activity.description || null,
            price: parseFloat(activity.price),
            duration: activity.duration || null,
            photos: activity.photos?.length ? JSON.stringify(activity.photos) : null,
            image: activity.image || null,
            agencyId: "AGC1",
          })),
        },
      },
      include: { 
        roomTypes: true,
        meals: true,
        activities: true,
      },
    });

    // Parse JSON fields for the response
    const hotelWithParsedData = {
      ...updatedHotel,
      inclusions: updatedHotel.inclusions ? JSON.parse(updatedHotel.inclusions) : [],
      photos: updatedHotel.photos ? JSON.parse(updatedHotel.photos) : [],
      roomTypes: updatedHotel.roomTypes.map(room => ({
        ...room,
        amenities: room.amenities ? JSON.parse(room.amenities) : [],
      }))
    };

    return NextResponse.json({ success: true, data: hotelWithParsedData });
  } catch (error: any) {
    console.error("Hotel update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest, 
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

    console.log("Deleting hotel with ID:", id);

    // Delete the hotel (Prisma cascades roomTypes, meals, activities)
    const deletedHotel = await prisma.hotel.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, data: deletedHotel });
  } catch (error: any) {
    console.error("Hotel deletion error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}