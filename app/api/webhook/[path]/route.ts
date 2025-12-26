import { NextRequest, NextResponse } from "next/server";

// URL base del webhook de n8n - configurable via variable de entorno
// Ejemplo: N8N_WEBHOOK_URL=https://tu-instancia.app.n8n.cloud/webhook
const N8N_WEBHOOK_BASE_URL = process.env.N8N_WEBHOOK_URL || "https://n8n.gaiacoworking.pt/webhook";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path } = await params;
    const body = await request.json();
    
    // Construir la URL del webhook de n8n
    // Si N8N_WEBHOOK_URL ya incluye el path completo, usarla directamente
    // Si no, agregar el path
    let webhookUrl: string;
    if (N8N_WEBHOOK_BASE_URL.includes(path)) {
      webhookUrl = N8N_WEBHOOK_BASE_URL;
    } else {
      webhookUrl = `${N8N_WEBHOOK_BASE_URL}/${path}`;
    }
    
    console.log(`[n8n Proxy] URL configurada: ${N8N_WEBHOOK_BASE_URL}`);
    console.log(`[n8n Proxy] Enviando a: ${webhookUrl}`);
    console.log(`[n8n Proxy] Body:`, JSON.stringify(body, null, 2));

    // Reenviar la petición al webhook de n8n
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // Si n8n no está disponible o el workflow no está activo
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`n8n webhook error (${response.status}):`, errorText);
      
      // Verificar si el error es porque el workflow no está registrado
      if (response.status === 404 || errorText.includes("not registered")) {
        return NextResponse.json(
          { 
            error: "El workflow de n8n no está activado",
            message: "Por favor, activa el workflow en n8n para recibir mensajes.",
            details: errorText,
            debug: {
              urlUsada: webhookUrl,
              urlConfigurada: N8N_WEBHOOK_BASE_URL,
              path: path,
              sugerencia: "Verifica que N8N_WEBHOOK_URL en .env sea la URL del webhook (no del workflow). Ejemplo: https://tu-instancia.app.n8n.cloud/webhook"
            }
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Error al comunicarse con el chatbot",
          message: errorText || `Error ${response.status}`,
        },
        { status: response.status }
      );
    }

    // Obtener la respuesta de n8n
    const contentType = response.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      const data = await response.json();
      console.log("n8n response:", JSON.stringify(data, null, 2));
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      console.log("n8n response (text):", text);
      return NextResponse.json({ response: text });
    }

  } catch (error: unknown) {
    console.error("Error in webhook proxy:", error);
    
    // Si es un error de conexión (n8n no disponible)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return NextResponse.json(
        { 
          error: "No se pudo conectar con el servidor de n8n",
          message: "El servidor de chatbot no está disponible. Por favor, intente más tarde o contacte via WhatsApp.",
        },
        { status: 503 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json(
      { 
        error: "Error interno del servidor",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

// También soportar GET para pruebas
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  const { path } = await params;
  return NextResponse.json({ 
    message: "Webhook proxy activo",
    path,
    n8nUrl: `${N8N_WEBHOOK_BASE_URL}/${path}`,
    note: "Use POST para enviar mensajes al chatbot"
  });
}

