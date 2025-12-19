import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { createSession } from "@/lib/session";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const result = await loginUser(email, password);

    if (!result) {
      return NextResponse.json(
        { error: "Incorrect email or password" },
        { status: 401 }
      );
    }

    // Check if there's an error (like email not verified)
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Create session directly
    await createSession(result.user.id);

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: result.user,
      isAdmin: result.user.role === 'admin',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error logging in" },
      { status: 500 }
    );
  }
}

