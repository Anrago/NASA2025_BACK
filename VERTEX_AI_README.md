# VertexAI API Documentation

## Configuración

1. **Configurar Google Cloud Credentials:**
   - Instalar Google Cloud CLI
   - Ejecutar: `gcloud auth application-default login`
   - O configurar la variable de entorno `GOOGLE_APPLICATION_CREDENTIALS` con la ruta al archivo de credenciales

2. **Variables de Entorno:**
   - Copiar `.env.example` a `.env`
   - Configurar `GOOGLE_CLOUD_PROJECT_ID` con tu ID de proyecto de Google Cloud
   - Configurar `GOOGLE_CLOUD_LOCATION` (por defecto: us-central1)

## Endpoints

### POST /vertex-ai/generate

Genera contenido usando VertexAI.

**Request Body:**

```json
{
  "prompt": "Tu prompt aquí",
  "parameters": {
    "temperature": 0.7,
    "maxOutputTokens": 1024,
    "topP": 0.8,
    "topK": 40
  },
  "model": "gemini-1.5-pro"
}
```

**Campos:**

- `prompt` (requerido): El texto del prompt para enviar a VertexAI
- `parameters` (opcional): Parámetros de generación
  - `temperature`: Controla la creatividad (0.0-1.0)
  - `maxOutputTokens`: Máximo número de tokens en la respuesta
  - `topP`: Sampling parameter
  - `topK`: Sampling parameter
- `model` (opcional): Modelo a usar (por defecto: gemini-1.5-pro)

**Response:**

```json
{
  "success": true,
  "data": {
    "generatedText": "Respuesta generada por VertexAI",
    "model": "gemini-1.5-pro",
    "parameters": {
      "temperature": 0.7,
      "maxOutputTokens": 1024
    }
  },
  "message": "Content generated successfully",
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

### GET /vertex-ai/health

Verifica el estado del servicio VertexAI.

**Response:**

```json
{
  "success": true,
  "data": {
    "status": "healthy"
  },
  "message": "VertexAI service is working correctly",
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

## Ejemplos de uso

### Generar texto simple

```bash
curl -X POST http://localhost:3000/vertex-ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Escribe un breve resumen sobre la inteligencia artificial"
  }'
```

### Generar con parámetros personalizados

```bash
curl -X POST http://localhost:3000/vertex-ai/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Crea una historia corta sobre el espacio",
    "parameters": {
      "temperature": 0.9,
      "maxOutputTokens": 500
    }
  }'
```

### Verificar estado del servicio

```bash
curl -X GET http://localhost:3000/vertex-ai/health
```

## Manejo de errores

El API retorna errores en el siguiente formato:

```json
{
  "success": false,
  "error": "Descripción del error",
  "message": "Mensaje descriptivo",
  "timestamp": "2025-10-04T12:00:00.000Z"
}
```

## Códigos de estado HTTP

- `200`: Éxito
- `400`: Error en la validación de datos
- `500`: Error interno del servidor
- `503`: Servicio no disponible
