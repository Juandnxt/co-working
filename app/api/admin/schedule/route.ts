import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import sql from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const schedules = await sql`
      SELECT * FROM "Schedule"
      ORDER BY "dayOfWeek", "openTime"
    `;

    return NextResponse.json({ schedules });
  } catch (error) {
    console.error("Error fetching schedule:", error);
    return NextResponse.json(
      { error: "Error fetching schedule" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { dayOfWeek, openTime, closeTime, isOpen, spaceId } = body;

    if (dayOfWeek === undefined || !openTime || !closeTime) {
      return NextResponse.json(
        { error: "dayOfWeek, openTime, and closeTime are required" },
        { status: 400 }
      );
    }

    const id = crypto.randomUUID();
    await sql`
      INSERT INTO "Schedule" (id, "dayOfWeek", "openTime", "closeTime", "isOpen", "spaceId", "createdAt", "updatedAt")
      VALUES (${id}, ${dayOfWeek}, ${openTime}, ${closeTime}, ${isOpen ?? true}, ${spaceId || null}, NOW(), NOW())
    `;

    return NextResponse.json({ success: true, message: "Schedule created" });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: "Error creating schedule" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as {
      id?: string;
      openTime?: string;
      closeTime?: string;
      isOpen?: boolean;
      spaceId?: string | null;
    };
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Schedule ID is required" },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: Array<string | number | boolean | null> = [];
    
    if (updateData.openTime) {
      updateFields.push('openTime');
      updateValues.push(updateData.openTime);
    }
    if (updateData.closeTime) {
      updateFields.push('closeTime');
      updateValues.push(updateData.closeTime);
    }
    if (updateData.isOpen !== undefined) {
      updateFields.push('isOpen');
      updateValues.push(updateData.isOpen);
    }
    if (updateData.spaceId !== undefined) {
      updateFields.push('spaceId');
      updateValues.push(updateData.spaceId);
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    // Build SET clause
    const setClause = updateFields.map((field, index) => 
      `"${field}" = $${index + 1}`
    ).join(', ');

    await sql.unsafe(`
      UPDATE "Schedule"
      SET ${setClause}, "updatedAt" = NOW()
      WHERE id = $${updateFields.length + 1}
    `, [...updateValues, id]);

    return NextResponse.json({ success: true, message: "Schedule updated" });
  } catch (error) {
    console.error("Error updating schedule:", error);
    return NextResponse.json(
      { error: "Error updating schedule" },
      { status: 500 }
    );
  }
}

