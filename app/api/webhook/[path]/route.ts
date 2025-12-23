import { NextRequest, NextResponse } from "next/server";

const N8N_WEBHOOK_BASE_URL = "https://dnxt.app.n8n.cloud/webhook";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string }> }
) {
  try {
    const { path } = await params;
    const body = await request.json();

    console.log("Webhook request received:", { path, body });

    // Construir la URL completa del webhook de n8n
    const webhookUrl = `${N8N_WEBHOOK_BASE_URL}/${path}`;
    console.log("Calling n8n webhook:", webhookUrl);

    // Enviar la solicitud al webhook de n8n
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log("n8n response status:", response.status, response.statusText);
    console.log("n8n response headers:", Object.fromEntries(response.headers.entries()));

    // Obtener el contenido de la respuesta
    // Clonar la respuesta para poder leerla múltiples veces si es necesario
    const contentType = response.headers.get("content-type") || "";
    let data;
    
    // Leer primero como texto para poder intentar parsear después
    const rawText = await response.text();
    console.log("n8n raw response:", rawText);
    console.log("Content-Type:", contentType);

    // Intentar parsear como JSON
    if (contentType.includes("application/json") || rawText.trim().startsWith("{")) {
      try {
        data = JSON.parse(rawText);
        console.log("Parsed as JSON:", data);
      } catch (error) {
        // Si falla el parseo JSON, tratar como texto plano
        console.log("Failed to parse as JSON, treating as plain text");
        data = { response: rawText, message: rawText, text: rawText };
      }
    } else {
      // Si no es JSON, devolver como mensaje
      console.log("Treating as plain text");
      data = { response: rawText, message: rawText, text: rawText };
    }

    console.log("n8n response data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error(`Error from n8n webhook: ${response.status} ${response.statusText}`, data);
      
      // Manejar el caso específico cuando el workflow no está activo
      if (response.status === 404 && data?.message?.includes("not registered")) {
        return NextResponse.json(
          { 
            error: "El workflow de n8n no está activado",
            message: "Por favor, activa el workflow en n8n para que el chatbot funcione.",
            hint: data.hint || "Activa el workflow usando el toggle en la esquina superior derecha del editor de n8n"
          },
          { status: 503 } // Service Unavailable - más apropiado que 404
        );
      }
      
      return NextResponse.json(
        { 
          error: "Error al procesar la solicitud del chatbot",
          details: data
        },
        { status: response.status }
      );
    }

    // n8n puede devolver la respuesta en diferentes formatos:
    // 1. Array de objetos: [{ json: { answer: "..." } }]
    // 2. Objeto directo: { answer: "..." } o { response: "..." }
    // 3. String directo: "respuesta"
    // 4. En el body de un objeto: { body: "respuesta" }
    
    let processedData = data;
    
    // Si es un array (formato típico de n8n)
    if (Array.isArray(data) && data.length > 0) {
      // Tomar el primer elemento
      const firstItem = data[0];
      // n8n suele poner los datos en .json o directamente en el objeto
      processedData = firstItem.json || firstItem.body || firstItem;
    }
    
    // Si es un objeto con body (respuesta HTTP)
    if (processedData && typeof processedData === 'object' && processedData.body) {
      // Intentar parsear el body si es string
      if (typeof processedData.body === 'string') {
        try {
          processedData = JSON.parse(processedData.body);
        } catch {
          processedData = { answer: processedData.body, response: processedData.body, message: processedData.body, text: processedData.body };
        }
      } else {
        processedData = processedData.body;
      }
    }
    
    // Asegurar que siempre sea un objeto con campos estándar
    if (typeof processedData === 'string') {
      processedData = { answer: processedData, response: processedData, message: processedData, text: processedData };
    } else if (processedData && typeof processedData === 'object') {
      // Si el objeto tiene "answer", asegurarse de que también esté en otros campos comunes
      if (processedData.answer && !processedData.response) {
        processedData.response = processedData.answer;
        processedData.message = processedData.answer;
        processedData.text = processedData.answer;
      }
    }

    console.log("Processed n8n data:", JSON.stringify(processedData, null, 2));

    return NextResponse.json(processedData);
  } catch (error: any) {
    console.error("Error calling n8n webhook:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    return NextResponse.json(
      { 
        error: "Error al conectar con el chatbot",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

