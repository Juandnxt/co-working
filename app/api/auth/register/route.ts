import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = registerSchema.parse(body);

    // Check if user already exists
    const sql = (await import("@/lib/db")).default;
    const [existingUser] = await sql`
      SELECT id FROM "User" WHERE email = ${email} LIMIT 1
    `;

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await createUser(email, password, name);

    if (!user || !user.id) {
      console.error("User creation returned invalid user:", user);
      return NextResponse.json(
        { error: "Failed to create user - please try again" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent to your email",
      userId: user.id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    const err = error instanceof Error ? error : new Error("Error registering user");
    console.error("Registration error:", err);
    console.error("Error stack:", err.stack);
    
    // Return more detailed error message
    const errorMessage = err.message || "Error registering user";
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      },
      { status: 500 }
    );
  }
}

