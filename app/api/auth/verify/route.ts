import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/auth";
import { z } from "zod";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  isLogin: z.boolean().optional().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Verification request:', { email: body.email, code: body.code, isLogin: body.isLogin });
    
    const { email, code, isLogin } = verifySchema.parse(body);

    // Only registration uses verification codes now
    if (isLogin) {
      return NextResponse.json(
        { error: "Login no longer requires verification code. Use email and password only." },
        { status: 400 }
      );
    }

    const user = await verifyCode(email, code);

    if (!user) {
      console.log('Verification failed: invalid or expired code');
      return NextResponse.json(
        { error: "Invalid or expired code. Please check the code and try again." },
        { status: 400 }
      );
    }

    console.log('Verification successful for user:', user.id);

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error.errors);
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Error verifying code. Please try again." },
      { status: 500 }
    );
  }
}

