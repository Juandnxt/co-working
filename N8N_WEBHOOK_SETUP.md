# Guía de Configuración del Webhook de n8n

## 🔴 Problema Actual
El workflow de n8n **NO está activado**. El error indica:
```
"The requested webhook "POST e05bf1eb-8902-4711-beb1-136110b75941" is not registered."
"The workflow must be active for a production URL to run successfully."
```

## ✅ Solución: Activar el Workflow en n8n

### Paso 1: Activar el Workflow
1. Abre tu cuenta de n8n: https://app.n8n.cloud
2. Ve al workflow que contiene el webhook con el path: `e05bf1eb-8902-4711-beb1-136110b75941`
3. En la **esquina superior derecha** del editor, encontrarás un **toggle (interruptor)**
4. **Activa el toggle** - debe quedar en verde/ON
5. Guarda el workflow si es necesario

### Paso 2: Verificar la Configuración del Webhook

#### 2.1 Método HTTP
- El webhook debe aceptar **POST**
- Verifica que el nodo Webhook esté configurado para recibir POST requests

#### 2.2 Formato de Datos que Recibe
Tu aplicación envía los siguientes datos al webhook:
```json
{
  "message": "texto del usuario",
  "conversationId": "chat-widget"
}
```

**Si tu webhook espera otros campos**, puedes:
- Usar un nodo "Set" o "Function" para mapear los datos
- O decirme qué campos espera y ajusto el código

#### 2.3 Formato de Respuesta que Debe Devolver
El webhook debe devolver un JSON con la respuesta en uno de estos campos:
```json
{
  "response": "tu respuesta aquí"
}
```
o
```json
{
  "message": "tu respuesta aquí"
}
```
o
```json
{
  "text": "tu respuesta aquí"
}
```

**Ejemplo de workflow básico en n8n:**
```
Webhook (POST) → Procesar mensaje → Responder con JSON
```

### Paso 3: Probar el Webhook

Una vez activado, puedes probar directamente desde n8n:
1. Haz clic en el nodo Webhook
2. Copia la URL de producción
3. Úsala en Postman o curl para probar:

```bash
curl -X POST https://dnxt.app.n8n.cloud/webhook/e05bf1eb-8902-4711-beb1-136110b75941 \
  -H "Content-Type: application/json" \
  -d '{"message": "Hola", "conversationId": "test"}'
```

## 📋 Checklist de Configuración

- [ ] Workflow activado en n8n (toggle ON)
- [ ] Webhook configurado para aceptar POST
- [ ] Webhook devuelve JSON con `response`, `message` o `text`
- [ ] URL de producción correcta: `https://dnxt.app.n8n.cloud/webhook/e05bf1eb-8902-4711-beb1-136110b75941`

## 🔧 Si Necesitas Cambiar el Formato de Datos

Si tu webhook de n8n espera un formato diferente, dímelo y ajusto el código. Por ejemplo:
- Si espera `query` en lugar de `message`
- Si espera `input` en lugar de `message`
- Si necesita otros campos adicionales

## 🐛 Troubleshooting

### Error: "Webhook not registered"
→ **Solución**: Activa el workflow en n8n

### Error: "Method not allowed"
→ **Solución**: Verifica que el webhook acepte POST

### Error: "Invalid JSON response"
→ **Solución**: Asegúrate de que el webhook devuelva JSON válido

### El chatbot no responde correctamente
→ **Solución**: Verifica que la respuesta incluya `response`, `message` o `text`

## 📞 Próximos Pasos

1. **Activa el workflow en n8n** (Paso 1)
2. **Prueba el webhook** directamente desde n8n o Postman
3. **Prueba el chatbot** en tu aplicación
4. Si hay problemas, comparte:
   - El formato exacto que espera tu webhook
   - El formato exacto que devuelve tu webhook
   - Cualquier error que veas en los logs

