import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      name, 
      description, 
      duration, 
      price, 
     
      image, 
      hotelId, 
      agencyId 
    } = body;

    // Basic validation
    if (!name || price === undefined) {
      return NextResponse.json({ 
        success: false, 
        error: "Name and price are required" 
      }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        description: description || null,
        duration: duration || null,
        price: parseFloat(price),
       
        image: image || null,
        hotelId: hotelId || null,
        agencyId: agencyId || "AGC1",
      },
    });

    return NextResponse.json({ 
      success: true, 
      data: activity 
    }, { status: 201 });
  } catch (error: any) {
    console.error("Activity creation error:", error);
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
          { hotelId: null } // Include standalone activities
        ]
      };
    }

    const activities = await prisma.activity.findMany({
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

    // Parse JSON fields for response
    const activitiesWithParsedData = activities.map(activity => ({
      ...activity,
      photos: activity.photos ? JSON.parse(activity.photos) : [],
    }));

    return NextResponse.json({ 
      success: true, 
      data: activitiesWithParsedData 
    });
  } catch (error: any) {
    console.error("Activities fetch error:", error);
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
        error: "Activity ID is required" 
      }, { status: 400 });
    }

    const deletedActivity = await prisma.activity.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      data: deletedActivity 
    });
  } catch (error: any) {
    console.error("Activity deletion error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Something went wrong" 
    }, { status: 500 });
  }
}