# 🤖 Endpoint Simple de VertexAI

## Descripción

Endpoint optimizado para enviar prompts simples a VertexAI y recibir respuestas estructuradas en formato JSON.

## 📍 Endpoint

```
POST /vertex-ai/prompt
```

## 📝 Request Body

### Estructura

```json
{
  "prompt": "Tu pregunta o solicitud aquí",
  "temperature": 0.7, // Opcional: 0.0 - 2.0
  "maxTokens": 1024 // Opcional: 1 - 8192
}
```

### Campos

- **`prompt`** (requerido): El texto que quieres enviar a la IA
- **`temperature`** (opcional): Controla la creatividad de la respuesta
  - `0.0`: Respuestas muy predecibles y consistentes
  - `1.0`: Balance entre creatividad y coherencia
  - `2.0`: Máxima creatividad (puede ser impredecible)
- **`maxTokens`** (opcional): Máximo número de tokens en la respuesta (1-8192)

## 📊 Response Structure

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {
    "response": "Respuesta generada por la IA",
    "model": "gemini-1.5-flash",
    "promptTokens": 25,
    "responseTokens": 150,
    "totalTokens": 175,
    "temperature": 0.7,
    "processingTime": "1250ms"
  },
  "metadata": {
    "requestId": "req_1728123456789_abc123",
    "timestamp": "2025-10-04T14:30:45.123Z",
    "version": "1.0.0"
  }
}
```

### Respuesta con Error

```json
{
  "success": false,
  "data": {
    "response": "",
    "model": "gemini-1.5-flash",
    "temperature": 0.7,
    "processingTime": "500ms"
  },
  "metadata": {
    "requestId": "req_1728123456789_def456",
    "timestamp": "2025-10-04T14:30:45.123Z",
    "version": "1.0.0"
  },
  "error": {
    "code": "GENERATION_ERROR",
    "message": "Descripción del error",
    "details": "Detalles técnicos del error"
  }
}
```

## 🚀 Ejemplos de Uso

### 1. Pregunta Simple

```bash
curl -X POST http://localhost:3000/vertex-ai/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "¿Qué es la inteligencia artificial?"
  }'
```

### 2. Con Parámetros Personalizados

```bash
curl -X POST http://localhost:3000/vertex-ai/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Escribe un poema sobre la tecnología",
    "temperature": 0.9,
    "maxTokens": 200
  }'
```

### 3. Generar Datos Estructurados

```bash
curl -X POST http://localhost:3000/vertex-ai/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Genera un objeto JSON con información de un producto: nombre, precio, categoría y descripción",
    "temperature": 0.3,
    "maxTokens": 300
  }'
```

### 4. Lista de Elementos

```bash
curl -X POST http://localhost:3000/vertex-ai/prompt \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Dame 5 consejos para ser más productivo trabajando desde casa",
    "temperature": 0.6,
    "maxTokens": 400
  }'
```

## 📈 Casos de Uso

### ✅ Ideal para:

- Preguntas y respuestas rápidas
- Generación de contenido creativo
- Creación de datos de prueba
- Explicaciones y tutoriales
- Generación de código
- Traducción de textos
- Resúmenes de información

### 🎯 Ejemplos Prácticos:

#### Generación de Código

```json
{
  "prompt": "Crea una función en JavaScript que valide si un email es válido",
  "temperature": 0.2,
  "maxTokens": 300
}
```

#### Datos de Prueba

```json
{
  "prompt": "Genera un array JSON de 5 usuarios ficticios con nombre, email, edad y ciudad",
  "temperature": 0.5,
  "maxTokens": 500
}
```

#### Explicaciones Técnicas

```json
{
  "prompt": "Explica qué son las APIs REST y cómo funcionan, en términos simples",
  "temperature": 0.4,
  "maxTokens": 600
}
```

#### Contenido Creativo

```json
{
  "prompt": "Escribe una historia corta de ciencia ficción sobre robots que aprenden a sentir emociones",
  "temperature": 0.8,
  "maxTokens": 800
}
```

## 🔧 Parámetros de Configuración

### Temperature Guidelines

- **0.0 - 0.3**: Para tareas que requieren precisión (código, datos, fórmulas)
- **0.4 - 0.7**: Para contenido equilibrado (explicaciones, documentación)
- **0.8 - 1.0**: Para contenido creativo (historias, ideas)
- **1.1 - 2.0**: Para máxima creatividad (experimental)

### MaxTokens Guidelines

- **50-100**: Respuestas muy cortas
- **100-300**: Respuestas medianas
- **300-600**: Respuestas largas
- **600-1024**: Respuestas muy extensas
- **1024+**: Contenido muy largo (artículos, historias)

## ⚠️ Consideraciones

1. **Rate Limiting**: El endpoint puede tener límites de uso
2. **Timeout**: Requests muy complejos pueden tardar más tiempo
3. **Costos**: Cada request consume tokens que pueden tener costo
4. **Contenido**: Evita prompts que generen contenido inapropiado

## 🔍 Debugging

### Usar el Request ID

Cada respuesta incluye un `requestId` único que puedes usar para tracking:

```json
"metadata": {
  "requestId": "req_1728123456789_abc123"
}
```

### Monitorear Processing Time

```json
"data": {
  "processingTime": "1250ms"
}
```

### Token Usage

```json
"data": {
  "promptTokens": 25,
  "responseTokens": 150,
  "totalTokens": 175
}
```

## 🧪 Script de Pruebas

Ejecuta el script de pruebas incluido:

```bash
node test-simple-prompt.js
```
