import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
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
    
    const agencyId = "AGC1";

    const hotel = await prisma.hotel.create({
      data: {
        name,
        city,
        starCategory: Number(starCategory),
        cancellation: cancellation || null,
        inclusions: inclusions?.length ? JSON.stringify(inclusions) : null,
        photos: photos?.length ? JSON.stringify(photos) : null,
        agencyId,
        // Create room types with single image
        roomTypes: {
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
        // Create meals
        meals: {
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
        // Create activities
        activities: {
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

    return NextResponse.json({ success: true, data: hotel }, { status: 201 });
  } catch (error) {
    console.error("Hotel creation error:", error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const agencyId = searchParams.get("agencyId") || "AGC1";

    if (id) {
      // Fetch single hotel by ID
      const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: { 
          roomTypes: true,
          meals: true,
          activities: true,
        },
      });
      
      if (!hotel) {
        return NextResponse.json({ 
          success: false, 
          error: "Hotel not found" 
        }, { status: 404 });
      }

      // Parse JSON fields
      const hotelWithParsedData = {
        ...hotel,
        inclusions: hotel.inclusions ? JSON.parse(hotel.inclusions) : [],
        photos: hotel.photos ? JSON.parse(hotel.photos) : [],
        roomTypes: hotel.roomTypes.map(room => ({
          ...room,
          amenities: room.amenities ? JSON.parse(room.amenities) : [],
          // No need to parse photos array since it's now a single image
        }))
      };
      
      return NextResponse.json({ success: true, data: hotelWithParsedData });
    }

    // Fetch all hotels for agency AGC1
    const hotels = await prisma.hotel.findMany({
      where: { agencyId: "AGC1" },
      include: { 
        roomTypes: true,
        meals: true,
        activities: true,
      },
      orderBy: { createdAt: "desc" }
    });

    // Parse JSON fields for all hotels
    const hotelsWithParsedData = hotels.map(hotel => ({
      ...hotel,
      inclusions: hotel.inclusions ? JSON.parse(hotel.inclusions) : [],
      photos: hotel.photos ? JSON.parse(hotel.photos) : [],
      roomTypes: hotel.roomTypes.map(room => ({
        ...room,
        amenities: room.amenities ? JSON.parse(room.amenities) : [],
      }))
    }));
    
    return NextResponse.json({ success: true, data: hotelsWithParsedData });
  } catch (error: any) {
    console.error("Hotels fetch error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}