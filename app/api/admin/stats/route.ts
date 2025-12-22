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

    // Get total bookings
    const [totalBookings] = await sql`
      SELECT COUNT(*) as count FROM "Booking"
    `;

    // Get pending bookings
    const [pendingBookings] = await sql`
      SELECT COUNT(*) as count FROM "Booking" WHERE status = 'pending'
    `;

    // Get confirmed bookings
    const [confirmedBookings] = await sql`
      SELECT COUNT(*) as count FROM "Booking" WHERE status = 'confirmed'
    `;

    // Get total subscriptions
    const [totalSubscriptions] = await sql`
      SELECT COUNT(*) as count FROM "Subscription"
    `;

    // Get active subscriptions
    const [activeSubscriptions] = await sql`
      SELECT COUNT(*) as count FROM "Subscription" WHERE status = 'active'
    `;

    // Get total users
    const [totalUsers] = await sql`
      SELECT COUNT(*) as count FROM "User"
    `;

    // Get available spaces
    const [availableSpaces] = await sql`
      SELECT COUNT(*) as count FROM "Space" WHERE available = true
    `;

    // Get total revenue (from paid bookings)
    const [revenue] = await sql`
      SELECT COALESCE(SUM(amount), 0) as total FROM "Booking" WHERE "paymentStatus" = 'paid'
    `;

    return NextResponse.json({
      stats: {
        totalBookings: Number(totalBookings?.count || 0),
        pendingBookings: Number(pendingBookings?.count || 0),
        confirmedBookings: Number(confirmedBookings?.count || 0),
        totalSubscriptions: Number(totalSubscriptions?.count || 0),
        activeSubscriptions: Number(activeSubscriptions?.count || 0),
        totalUsers: Number(totalUsers?.count || 0),
        availableSpaces: Number(availableSpaces?.count || 0),
        revenue: Number(revenue?.total || 0),
      }
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error fetching stats" },
      { status: 500 }
    );
  }
}

