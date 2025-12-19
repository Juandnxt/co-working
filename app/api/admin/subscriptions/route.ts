import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import sql from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscriptions = await sql`
      SELECT 
        s.*,
        u.email as user_email,
        u.name as user_name
      FROM "Subscription" s
      INNER JOIN "User" u ON s."userId" = u.id
      ORDER BY s."createdAt" DESC
    `;

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Error fetching subscriptions" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession();
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM "Subscription"
      WHERE id = ${subscriptionId}
    `;

    return NextResponse.json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return NextResponse.json(
      { error: "Error deleting subscription" },
      { status: 500 }
    );
  }
}

