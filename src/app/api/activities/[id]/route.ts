import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Get single activity by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Activity ID is required" 
      }, { status: 400 });
    }

    const activity = await prisma.activity.findUnique({
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

    if (!activity) {
      return NextResponse.json({ 
        success: false, 
        error: "Activity not found" 
      }, { status: 404 });
    }

    // Parse JSON fields for response
    const activityWithParsedData = {
      ...activity,

    };

    // Print activity data to console
    console.log("GET Activity Data:", activityWithParsedData);

    return NextResponse.json({
      success: true,
      data: activityWithParsedData
    });
  } catch (error: any) {
    console.error("Activity fetch error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT: Update activity
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { 
      name, 
      description, 
      duration, 
      price, 
    
      image, 
      hotelId 
    } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Activity ID is required" 
      }, { status: 400 });
    }

    // Check if activity exists
    const existingActivity = await prisma.activity.findUnique({
      where: { id }
    });

    if (!existingActivity) {
      return NextResponse.json({ 
        success: false, 
        error: "Activity not found" 
      }, { status: 404 });
    }

    // Print existing activity data and update data to console
    console.log("PUT - Existing Activity Data:", existingActivity);
    console.log("PUT - Update Data:", body);

    const updatedActivity = await prisma.activity.update({
      where: { id },
      data: {
        name: name || existingActivity.name,
        description: description !== undefined ? description : existingActivity.description,
        duration: duration !== undefined ? duration : existingActivity.duration,
        price: price !== undefined ? parseFloat(price) : existingActivity.price,

        image: image !== undefined ? image : existingActivity.image,
        hotelId: hotelId !== undefined ? hotelId : existingActivity.hotelId,
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

    // Parse JSON fields for response
    const activityWithParsedData = {
      ...updatedActivity,
    
    };

    // Print updated activity data to console
    console.log("PUT - Updated Activity Data:", activityWithParsedData);

    return NextResponse.json({ 
      success: true, 
      data: activityWithParsedData 
    });
  } catch (error: any) {
    console.error("Activity update error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Something went wrong" 
    }, { status: 500 });
  }
}

// DELETE: Delete activity
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: "Activity ID is required" 
      }, { status: 400 });
    }

    // Get activity data before deletion to print it
    const activityToDelete = await prisma.activity.findUnique({
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

    if (!activityToDelete) {
      return NextResponse.json({ 
        success: false, 
        error: "Activity not found" 
      }, { status: 404 });
    }

    const deletedActivity = await prisma.activity.delete({
      where: { id },
    });

    // Parse JSON fields for console output
    const activityWithParsedData = {
      ...activityToDelete,
   
    };

    // Print deleted activity data to console
    console.log("DELETE - Deleted Activity Data:", activityWithParsedData);

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