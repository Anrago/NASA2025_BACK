// Ejemplo de uso del endpoint VertexAI
// Ejecutar: node test-vertex-ai.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testVertexAI() {
  try {
    console.log('🧪 Probando el endpoint de VertexAI...\n');

    // 1. Verificar el estado del servicio
    console.log('1. Verificando estado del servicio...');
    try {
      const healthResponse = await axios.get(`${BASE_URL}/vertex-ai/health`);
      console.log('✅ Estado del servicio:', healthResponse.data);
    } catch (error) {
      console.log('❌ Error en health check:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. Generar contenido con prompt simple
    console.log('2. Generando contenido con prompt simple...');
    try {
      const simpleRequest = {
        prompt: 'Explícame qué es la inteligencia artificial en 2 párrafos'
      };

      const simpleResponse = await axios.post(`${BASE_URL}/vertex-ai/generate`, simpleRequest);
      console.log('✅ Respuesta generada:');
      console.log('Prompt:', simpleRequest.prompt);
      console.log('Respuesta:', simpleResponse.data.data.generatedText);
      console.log('Modelo usado:', simpleResponse.data.data.model);
    } catch (error) {
      console.log('❌ Error en generación simple:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 3. Generar contenido con parámetros personalizados
    console.log('3. Generando contenido con parámetros personalizados...');
    try {
      const advancedRequest = {
        prompt: 'Crea una historia corta sobre un astronauta que descubre vida en Marte',
        parameters: {
          temperature: 0.8,
          maxOutputTokens: 300,
          topP: 0.9
        },
        model: 'gemini-2.5-flash-lite'
      };

      const advancedResponse = await axios.post(`${BASE_URL}/vertex-ai/generate`, advancedRequest);
      console.log('✅ Historia generada:');
      console.log('Prompt:', advancedRequest.prompt);
      console.log('Historia:', advancedResponse.data.data.generatedText);
      console.log('Parámetros usados:', advancedResponse.data.data.parameters);
    } catch (error) {
      console.log('❌ Error en generación avanzada:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 4. Probar validación de errores
    console.log('4. Probando validación de errores...');
    try {
      const invalidRequest = {
        // prompt vacío para provocar error de validación
        prompt: '',
        parameters: {
          temperature: 2.0 // valor inválido
        }
      };

      const errorResponse = await axios.post(`${BASE_URL}/vertex-ai/generate`, invalidRequest);
      console.log('⚠️ No se esperaba una respuesta exitosa:', errorResponse.data);
    } catch (error) {
      console.log('✅ Error de validación capturado correctamente:');
      console.log('Estado:', error.response?.status);
      console.log('Error:', error.response?.data);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función para probar con curl (comandos que puedes copiar y pegar)
function showCurlExamples() {
  console.log('\n' + '='.repeat(50));
  console.log('📋 EJEMPLOS CON CURL:');
  console.log('='.repeat(50));
  
  console.log('\n1. Health Check:');
  console.log('curl -X GET http://localhost:3000/vertex-ai/health');
  
  console.log('\n2. Generar contenido simple:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explícame la teoría de la relatividad de Einstein"
  }'`);
  
  console.log('\n3. Generar contenido con parámetros:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/generate \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Escribe un poema sobre el espacio",
    "parameters": {
      "temperature": 0.9,
      "maxOutputTokens": 200
    }
  }'`);
}

// Mostrar ejemplos de curl
showCurlExamples();

// Si axios está disponible, ejecutar las pruebas
if (typeof require !== 'undefined') {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 INICIANDO PRUEBAS AUTOMÁTICAS...');
  console.log('='.repeat(50));
  console.log('Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
  console.log('Para iniciarlo: npm run start:dev\n');
  
  // Esperar 2 segundos antes de ejecutar las pruebas
  setTimeout(testVertexAI, 2000);
}