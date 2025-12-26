import { NextRequest, NextResponse } from "next/server";

// URL DIRECTA del webhook de confirmación
const WEBHOOK_CONFIRMAR_URL = "https://dnxt.app.n8n.cloud/webhook/confirmar-reserva-email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId es requerido" },
        { status: 400 }
      );
    }

    console.log("[confirmar-pago] Session ID:", sessionId);
    console.log("[confirmar-pago] Llamando a:", WEBHOOK_CONFIRMAR_URL);

    const response = await fetch(WEBHOOK_CONFIRMAR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stripe_session_id: sessionId,
        sessionId: sessionId,
      }),
    });

    console.log("[confirmar-pago] Status:", response.status);

    let result;
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      console.log("[confirmar-pago] Respuesta texto:", text);
      result = { raw: text };
    }
    
    console.log("[confirmar-pago] Respuesta:", JSON.stringify(result));

    return NextResponse.json({
      success: true,
      message: "Confirmación procesada",
      data: result,
    });
  } catch (error) {
    console.error("[confirmar-pago] Error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
