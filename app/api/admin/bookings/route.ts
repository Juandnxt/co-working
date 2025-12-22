import { NextResponse } from "next/server";
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

    const bookings = await sql`
      SELECT 
        b.*,
        u.email as user_email,
        u.name as user_name
      FROM "Booking" b
      INNER JOIN "User" u ON b."userId" = u.id
      ORDER BY b."createdAt" DESC
    `;

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Error fetching bookings" },
      { status: 500 }
    );
  }
}

