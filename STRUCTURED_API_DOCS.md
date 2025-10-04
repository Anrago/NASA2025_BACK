# 🧠 Endpoint de VertexAI Estructurado

## Descripción

Endpoint avanzado que procesa prompts y retorna respuestas altamente estructuradas con análisis de contenido, segmentación por temas y subtemas, ejemplos de código, y métricas de calidad.

## 📍 Endpoint

```
POST /vertex-ai/structured
```

## 📝 Request Body

### Estructura Completa

```json
{
  "prompt": "Tu pregunta o solicitud aquí",
  "responseFormat": "structured", // Opcional: text, structured, json, markdown
  "contentType": "explanation", // Opcional: explanation, list, tutorial, code, creative, analysis, question_answer
  "includeExamples": true, // Opcional: incluir ejemplos prácticos
  "includeSources": false, // Opcional: incluir referencias (futuro)
  "temperature": 0.7, // Opcional: 0.0 - 2.0
  "maxTokens": 2048, // Opcional: 1 - 8192
  "context": "Contexto adicional..." // Opcional: contexto para mejorar la respuesta
}
```

### Campos Detallados

#### `prompt` (requerido)

El texto principal que quieres enviar a la IA.

#### `responseFormat` (opcional)

- **`text`**: Respuesta en texto plano
- **`structured`**: Respuesta estructurada con secciones (por defecto)
- **`json`**: Incluye datos estructurados en JSON cuando sea apropiado
- **`markdown`**: Formato markdown completo

#### `contentType` (opcional)

- **`explanation`**: Explicaciones detalladas y educativas (por defecto)
- **`list`**: Listas organizadas y categorizadas
- **`tutorial`**: Tutoriales paso a paso
- **`code`**: Contenido técnico con ejemplos de código
- **`creative`**: Contenido creativo (historias, ideas)
- **`analysis`**: Análisis profundos y comparativos
- **`question_answer`**: Respuestas directas a preguntas

## 📊 Response Structure

### Respuesta Exitosa Completa

```json
{
  "success": true,
  "data": {
    "rawResponse": "Respuesta original de la IA...",
    "structuredContent": {
      "summary": "Resumen conciso del contenido",
      "mainTopic": "Tema principal identificado",
      "sections": [
        {
          "title": "Título de la sección",
          "content": "Contenido de la sección...",
          "subsections": [
            {
              "title": "Subsección",
              "content": "Contenido de subsección..."
            }
          ],
          "keyPoints": ["Punto clave 1", "Punto clave 2"],
          "examples": ["Ejemplo práctico 1", "Ejemplo práctico 2"],
          "codeSnippets": [
            {
              "language": "javascript",
              "code": "console.log('Hola mundo');",
              "description": "Ejemplo básico",
              "filename": "ejemplo.js"
            }
          ]
        }
      ],
      "keyTakeaways": ["Conclusión importante 1", "Conclusión importante 2"],
      "relatedTopics": ["Tema relacionado 1", "Tema relacionado 2"],
      "difficulty": "intermediate",
      "estimatedReadTime": "5 minutos"
    },
    "performance": {
      "processingTime": "2341ms",
      "promptTokens": 45,
      "responseTokens": 892,
      "totalTokens": 937,
      "modelConfidence": 0.87,
      "contentQuality": 0.92
    }
  },
  "metadata": {
    "requestId": "req_1728123456789_abc123",
    "timestamp": "2025-10-04T14:30:45.123Z",
    "version": "2.0.0",
    "model": "gemini-1.5-flash",
    "temperature": 0.7,
    "maxTokens": 2048,
    "responseFormat": "structured",
    "contentType": "explanation"
  }
}
```

### Métricas de Performance

#### `modelConfidence` (0.0 - 1.0)

Nivel de confianza estimado del modelo en la respuesta generada.

#### `contentQuality` (0.0 - 1.0)

Evaluación de la calidad estructural del contenido procesado.

### Sistema de Dificultad

- **`beginner`**: Contenido básico, fácil de entender
- **`intermediate`**: Contenido que requiere conocimiento previo
- **`advanced`**: Contenido técnico avanzado

## 🚀 Ejemplos de Uso

### 1. Explicación Técnica Estructurada

```bash
curl -X POST http://localhost:3000/vertex-ai/structured \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Explícame qué son los microservicios y sus ventajas",
    "responseFormat": "structured",
    "contentType": "explanation",
    "includeExamples": true,
    "temperature": 0.6,
    "maxTokens": 1500
  }'
```

**Respuesta esperada:**

- Resumen conciso de microservicios
- Secciones: Definición, Características, Ventajas, Desventajas
- Ejemplos prácticos de implementación
- Puntos clave para recordar
- Temas relacionados (Docker, Kubernetes, etc.)

### 2. Tutorial Paso a Paso

```bash
curl -X POST http://localhost:3000/vertex-ai/structured \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Tutorial para crear una API REST con Express.js",
    "responseFormat": "markdown",
    "contentType": "tutorial",
    "includeExamples": true,
    "maxTokens": 2000
  }'
```

**Respuesta esperada:**

- Pasos numerados y organizados
- Código de ejemplo para cada paso
- Explicación de cada componente
- Consejos y mejores prácticas

### 3. Lista Categorizada

```bash
curl -X POST http://localhost:3000/vertex-ai/structured \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Lista de herramientas esenciales para desarrollo frontend",
    "responseFormat": "structured",
    "contentType": "list",
    "includeExamples": true,
    "context": "Para desarrolladores que inician en React"
  }'
```

**Respuesta esperada:**

- Categorías organizadas (Editores, Frameworks, Testing, etc.)
- Descripciones de cada herramienta
- Ejemplos de uso
- Recomendaciones específicas

### 4. Análisis Comparativo

```bash
curl -X POST http://localhost:3000/vertex-ai/structured \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Compara React vs Vue.js para proyectos enterprise",
    "responseFormat": "structured",
    "contentType": "analysis",
    "includeExamples": true,
    "temperature": 0.4
  }'
```

**Respuesta esperada:**

- Secciones comparativas (Performance, Ecosistema, Curva de aprendizaje)
- Ejemplos de código en ambos frameworks
- Pros y contras estructurados
- Recomendaciones finales

### 5. Contenido con Código

```bash
curl -X POST http://localhost:3000/vertex-ai/structured \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Implementa un sistema de autenticación JWT en Node.js",
    "responseFormat": "structured",
    "contentType": "code",
    "includeExamples": true,
    "maxTokens": 2500
  }'
```

**Respuesta esperada:**

- Código completo comentado
- Explicación de cada función
- Ejemplos de uso de la API
- Consideraciones de seguridad

## 📈 Casos de Uso Ideales

### ✅ Perfecto para:

- **Documentación técnica**: Generar documentación estructurada
- **Material educativo**: Crear contenido de aprendizaje organizado
- **Análisis profundos**: Comparaciones y evaluaciones detalladas
- **Tutoriales**: Guías paso a paso con ejemplos
- **Arquitectura de software**: Explicaciones de patrones y diseños
- **Code reviews**: Análisis estructurado de código
- **Investigación**: Contenido académico y técnico

### 🎯 Industries y Sectores:

- **EdTech**: Plataformas de aprendizaje
- **Software Development**: Documentación y tutoriales
- **Consulting**: Informes y análisis
- **Research**: Papers y estudios
- **Training**: Material de capacitación

## 🔧 Configuración Avanzada

### Optimización por Tipo de Contenido

#### Para Explicaciones (`explanation`)

```json
{
  "temperature": 0.5-0.7,
  "maxTokens": 1500-2500,
  "includeExamples": true
}
```

#### Para Tutoriales (`tutorial`)

```json
{
  "temperature": 0.3-0.5,
  "maxTokens": 2000-3000,
  "includeExamples": true,
  "responseFormat": "markdown"
}
```

#### Para Análisis (`analysis`)

```json
{
  "temperature": 0.3-0.6,
  "maxTokens": 1800-2500,
  "includeExamples": true
}
```

#### Para Código (`code`)

```json
{
  "temperature": 0.2-0.4,
  "maxTokens": 2000-4000,
  "includeExamples": true,
  "responseFormat": "structured"
}
```

#### Para Contenido Creativo (`creative`)

```json
{
  "temperature": 0.8-1.2,
  "maxTokens": 1000-2000,
  "responseFormat": "structured"
}
```

## 📊 Métricas y Monitoreo

### Interpretar Model Confidence

- **0.0-0.4**: Baja confianza, revisar prompt
- **0.4-0.7**: Confianza media, contenido aceptable
- **0.7-1.0**: Alta confianza, contenido de calidad

### Interpretar Content Quality

- **0.0-0.5**: Estructura básica
- **0.5-0.8**: Bien estructurado
- **0.8-1.0**: Excelente organización

### Optimizar Performance

- **Processing Time > 5s**: Reducir maxTokens o simplificar prompt
- **Token Usage > 80%**: Considerar dividir en múltiples requests
- **Low Quality Score**: Ser más específico en el prompt

## ⚠️ Limitaciones y Consideraciones

1. **Complexity**: Prompts muy complejos pueden afectar la calidad de segmentación
2. **Language**: Optimizado para español, funciona en otros idiomas
3. **Context Length**: Límite de contexto del modelo (varía según versión)
4. **Processing Time**: Contenido complejo toma más tiempo
5. **Cost**: Mayor uso de tokens que endpoints simples

## 🧪 Testing y Debugging

### Script de Pruebas

```bash
node test-structured-prompt.js
```

### Debugging Tips

1. **Usar Request ID**: Cada request tiene un ID único para tracking
2. **Monitorear Performance**: Revisar métricas de tiempo y tokens
3. **Analizar Quality Score**: Ajustar prompt si la calidad es baja
4. **Revisar Sections**: Verificar que la segmentación sea correcta

## 🔮 Próximas Características

- **AI-powered categorization**: Categorización automática mejorada
- **Custom templates**: Plantillas personalizables por industry
- **Multi-language optimization**: Mejor soporte para múltiples idiomas
- **Integration APIs**: Conectores para CMS y plataformas de documentación
- **Advanced analytics**: Métricas más detalladas de calidad de contenido
