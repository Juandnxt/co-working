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

    const spaces = await sql`
      SELECT * FROM "Space"
      ORDER BY "createdAt" DESC
    `;

    // Get available spaces count
    const availableSpaces = (spaces as Array<{ available?: boolean }>).filter((s) => s.available).length;

    return NextResponse.json({ spaces, availableCount: availableSpaces, totalCount: spaces.length });
  } catch (error) {
    console.error("Error fetching spaces:", error);
    return NextResponse.json(
      { error: "Error fetching spaces" },
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

    const body = await request.json();
    const { id, available, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Space ID is required" },
        { status: 400 }
      );
    }

    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: Array<string | number | boolean | null> = [];
    
    if (available !== undefined) {
      updateFields.push('available');
      updateValues.push(available);
    }
    if (updateData.name) {
      updateFields.push('name');
      updateValues.push(updateData.name);
    }
    if (updateData.price !== undefined) {
      updateFields.push('price');
      updateValues.push(updateData.price);
    }
    if (updateData.capacity !== undefined) {
      updateFields.push('capacity');
      updateValues.push(updateData.capacity);
    }
    if (updateData.description !== undefined) {
      updateFields.push('description');
      updateValues.push(updateData.description);
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
      UPDATE "Space"
      SET ${setClause}, "updatedAt" = NOW()
      WHERE id = $${updateFields.length + 1}
    `, [...updateValues, id]);

    return NextResponse.json({ success: true, message: "Space updated" });
  } catch (error) {
    console.error("Error updating space:", error);
    return NextResponse.json(
      { error: "Error updating space" },
      { status: 500 }
    );
  }
}

