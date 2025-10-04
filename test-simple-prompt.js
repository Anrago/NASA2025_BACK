// Ejemplo de uso del nuevo endpoint /vertex-ai/prompt
// Ejecutar: node test-simple-prompt.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testSimplePrompt() {
  try {
    console.log('🚀 Probando el nuevo endpoint /vertex-ai/prompt...\n');

    // 1. Prompt básico
    console.log('1. 📝 Enviando prompt básico...');
    try {
      const basicPrompt = {
        prompt: '¿Cuáles son los beneficios de la inteligencia artificial?'
      };

      console.log('Enviando:', JSON.stringify(basicPrompt, null, 2));
      const response1 = await axios.post(`${BASE_URL}/vertex-ai/prompt`, basicPrompt);
      
      console.log('\n✅ Respuesta recibida:');
      console.log(JSON.stringify(response1.data, null, 2));
      
    } catch (error) {
      console.log('❌ Error en prompt básico:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 2. Prompt con parámetros personalizados
    console.log('2. ⚙️ Enviando prompt con parámetros personalizados...');
    try {
      const customPrompt = {
        prompt: 'Escribe un haiku sobre la tecnología',
        temperature: 0.9,
        maxTokens: 100
      };

      console.log('Enviando:', JSON.stringify(customPrompt, null, 2));
      const response2 = await axios.post(`${BASE_URL}/vertex-ai/prompt`, customPrompt);
      
      console.log('\n✅ Respuesta recibida:');
      console.log(JSON.stringify(response2.data, null, 2));
      
    } catch (error) {
      console.log('❌ Error en prompt personalizado:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 3. Prompt para generar JSON estructurado
    console.log('3. 🗂️ Enviando prompt para generar JSON estructurado...');
    try {
      const jsonPrompt = {
        prompt: 'Genera un perfil de usuario ficticio en formato JSON con los campos: nombre, edad, profesión, hobbies (array), y ubicación. Responde solo con el JSON válido.',
        temperature: 0.5,
        maxTokens: 200
      };

      console.log('Enviando:', JSON.stringify(jsonPrompt, null, 2));
      const response3 = await axios.post(`${BASE_URL}/vertex-ai/prompt`, jsonPrompt);
      
      console.log('\n✅ Respuesta recibida:');
      console.log(JSON.stringify(response3.data, null, 2));
      
      // Intentar parsear el JSON generado
      try {
        const generatedJSON = JSON.parse(response3.data.data.response);
        console.log('\n🎯 JSON parseado exitosamente:');
        console.log(JSON.stringify(generatedJSON, null, 2));
      } catch (parseError) {
        console.log('\n⚠️ El contenido generado no es JSON válido');
      }
      
    } catch (error) {
      console.log('❌ Error en prompt JSON:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(80) + '\n');

    // 4. Probar validación de errores
    console.log('4. 🔍 Probando validación de errores...');
    try {
      const invalidPrompt = {
        prompt: '', // Prompt vacío
        temperature: 3.0, // Temperatura inválida
        maxTokens: -1 // Tokens inválidos
      };

      console.log('Enviando prompt inválido:', JSON.stringify(invalidPrompt, null, 2));
      const response4 = await axios.post(`${BASE_URL}/vertex-ai/prompt`, invalidPrompt);
      
      console.log('⚠️ No se esperaba respuesta exitosa:', response4.data);
      
    } catch (error) {
      console.log('✅ Error de validación capturado correctamente:');
      console.log('Estado HTTP:', error.response?.status);
      console.log('Errores:', JSON.stringify(error.response?.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función para mostrar ejemplos con curl
function showCurlExamples() {
  console.log('\n' + '='.repeat(80));
  console.log('📋 EJEMPLOS CON CURL PARA EL NUEVO ENDPOINT:');
  console.log('='.repeat(80));
  
  console.log('\n1. Prompt básico:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/prompt \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explícame qué es el machine learning"
  }'`);
  
  console.log('\n2. Prompt con parámetros:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/prompt \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Crea una lista de 5 consejos para programar mejor",
    "temperature": 0.8,
    "maxTokens": 300
  }'`);
  
  console.log('\n3. Prompt para generar datos estructurados:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/prompt \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Genera un array JSON de 3 países con sus capitales y población",
    "temperature": 0.3,
    "maxTokens": 250
  }'`);
}

// Mostrar ejemplos de curl
showCurlExamples();

// Ejecutar pruebas automáticas
console.log('\n' + '='.repeat(80));
console.log('🧪 INICIANDO PRUEBAS AUTOMÁTICAS...');
console.log('='.repeat(80));
console.log('Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
console.log('Para iniciarlo: npm run start:dev\n');

// Esperar 2 segundos antes de ejecutar las pruebas
setTimeout(testSimplePrompt, 2000);