// Ejemplo de uso del nuevo endpoint /vertex-ai/structured
// Ejecutar: node test-structured-prompt.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testStructuredPrompt() {
  try {
    console.log('🚀 Probando el nuevo endpoint /vertex-ai/structured...\n');

    // 1. Explicación estructurada
    console.log('1. 📚 Solicitud de explicación estructurada...');
    try {
      const explanationPrompt = {
        prompt: 'Explícame qué es la inteligencia artificial y cómo funciona el machine learning',
        responseFormat: 'structured',
        contentType: 'explanation',
        includeExamples: true,
        temperature: 0.6,
        maxTokens: 1500
      };

      console.log('Enviando:', JSON.stringify(explanationPrompt, null, 2));
      const response1 = await axios.post(`${BASE_URL}/vertex-ai/structured`, explanationPrompt);
      
      console.log('\n✅ Respuesta estructurada recibida:');
      console.log('📊 Metadata:', JSON.stringify(response1.data.metadata, null, 2));
      console.log('\n📈 Performance:', JSON.stringify(response1.data.performance, null, 2));
      console.log('\n📝 Contenido estructurado:');
      console.log('Resumen:', response1.data.data.structuredContent.summary);
      console.log('Tema principal:', response1.data.data.structuredContent.mainTopic);
      console.log('Número de secciones:', response1.data.data.structuredContent.sections.length);
      console.log('Puntos clave:', response1.data.data.structuredContent.keyTakeaways);
      console.log('Dificultad:', response1.data.data.structuredContent.difficulty);
      console.log('Tiempo de lectura:', response1.data.data.structuredContent.estimatedReadTime);
      
      // Mostrar las primeras secciones
      response1.data.data.structuredContent.sections.slice(0, 2).forEach((section, index) => {
        console.log(`\n📖 Sección ${index + 1}: ${section.title}`);
        console.log(`Contenido: ${section.content.substring(0, 200)}...`);
        if (section.keyPoints && section.keyPoints.length > 0) {
          console.log(`Puntos clave: ${section.keyPoints.join(', ')}`);
        }
      });
      
    } catch (error) {
      console.log('❌ Error en explicación estructurada:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(100) + '\n');

    // 2. Tutorial paso a paso
    console.log('2. 📋 Solicitud de tutorial estructurado...');
    try {
      const tutorialPrompt = {
        prompt: 'Crea un tutorial para aprender a usar Git desde cero',
        responseFormat: 'markdown',
        contentType: 'tutorial',
        includeExamples: true,
        includeSources: true,
        temperature: 0.4,
        maxTokens: 2000
      };

      console.log('Enviando:', JSON.stringify(tutorialPrompt, null, 2));
      const response2 = await axios.post(`${BASE_URL}/vertex-ai/structured`, tutorialPrompt);
      
      console.log('\n✅ Tutorial estructurado recibido:');
      console.log('📊 Performance:', JSON.stringify(response2.data.performance, null, 2));
      console.log('\n📝 Estructura del tutorial:');
      console.log('Tema:', response2.data.data.structuredContent.mainTopic);
      console.log('Resumen:', response2.data.data.structuredContent.summary);
      console.log('Secciones:');
      
      response2.data.data.structuredContent.sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title}`);
        if (section.examples && section.examples.length > 0) {
          console.log(`     Ejemplos: ${section.examples.length}`);
        }
        if (section.codeSnippets && section.codeSnippets.length > 0) {
          console.log(`     Código: ${section.codeSnippets.length} snippets`);
        }
      });
      
    } catch (error) {
      console.log('❌ Error en tutorial estructurado:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(100) + '\n');

    // 3. Lista estructurada
    console.log('3. 📝 Solicitud de lista estructurada...');
    try {
      const listPrompt = {
        prompt: 'Dame una lista completa de las mejores prácticas para desarrollo web',
        responseFormat: 'structured',
        contentType: 'list',
        includeExamples: true,
        temperature: 0.5,
        maxTokens: 1200,
        context: 'Para desarrolladores frontend y backend con experiencia intermedia'
      };

      console.log('Enviando:', JSON.stringify(listPrompt, null, 2));
      const response3 = await axios.post(`${BASE_URL}/vertex-ai/structured`, listPrompt);
      
      console.log('\n✅ Lista estructurada recibida:');
      console.log('📊 Calidad del contenido:', response3.data.performance.contentQuality);
      console.log('📊 Confianza del modelo:', response3.data.performance.modelConfidence);
      console.log('\n📋 Estructura de la lista:');
      
      response3.data.data.structuredContent.sections.forEach((section, index) => {
        console.log(`\n📂 ${section.title}`);
        if (section.keyPoints) {
          section.keyPoints.slice(0, 3).forEach((point, i) => {
            console.log(`  • ${point}`);
          });
        }
      });
      
      console.log('\n🎯 Puntos clave generales:');
      response3.data.data.structuredContent.keyTakeaways.forEach(takeaway => {
        console.log(`  ✓ ${takeaway}`);
      });
      
    } catch (error) {
      console.log('❌ Error en lista estructurada:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(100) + '\n');

    // 4. Análisis con código
    console.log('4. 💻 Solicitud de análisis de código...');
    try {
      const codePrompt = {
        prompt: 'Analiza las ventajas y desventajas de React vs Vue.js, incluye ejemplos de código',
        responseFormat: 'structured',
        contentType: 'analysis',
        includeExamples: true,
        temperature: 0.3,
        maxTokens: 1800
      };

      console.log('Enviando:', JSON.stringify(codePrompt, null, 2));
      const response4 = await axios.post(`${BASE_URL}/vertex-ai/structured`, codePrompt);
      
      console.log('\n✅ Análisis con código recibido:');
      console.log('📊 Tokens utilizados:', response4.data.performance.totalTokens);
      console.log('⏱️ Tiempo de procesamiento:', response4.data.performance.processingTime);
      
      // Contar código encontrado
      let totalCodeSnippets = 0;
      response4.data.data.structuredContent.sections.forEach(section => {
        if (section.codeSnippets) {
          totalCodeSnippets += section.codeSnippets.length;
        }
      });
      
      console.log('\n💻 Análisis de código:');
      console.log(`Snippets de código encontrados: ${totalCodeSnippets}`);
      
      if (totalCodeSnippets > 0) {
        console.log('\n📝 Primeros ejemplos de código:');
        response4.data.data.structuredContent.sections.forEach(section => {
          if (section.codeSnippets && section.codeSnippets.length > 0) {
            const snippet = section.codeSnippets[0];
            console.log(`\n🔹 ${snippet.language.toUpperCase()}:`);
            console.log(`${snippet.code.substring(0, 150)}...`);
          }
        });
      }
      
    } catch (error) {
      console.log('❌ Error en análisis de código:', error.response?.data || error.message);
    }

    console.log('\n' + '='.repeat(100) + '\n');

    // 5. Contenido creativo
    console.log('5. 🎨 Solicitud de contenido creativo...');
    try {
      const creativePrompt = {
        prompt: 'Escribe una historia corta sobre un programador que descubre que su código cobra vida',
        responseFormat: 'structured',
        contentType: 'creative',
        temperature: 0.9,
        maxTokens: 1000
      };

      console.log('Enviando:', JSON.stringify(creativePrompt, null, 2));
      const response5 = await axios.post(`${BASE_URL}/vertex-ai/structured`, creativePrompt);
      
      console.log('\n✅ Contenido creativo estructurado:');
      console.log('📖 Tema:', response5.data.data.structuredContent.mainTopic);
      console.log('📄 Resumen:', response5.data.data.structuredContent.summary.substring(0, 200) + '...');
      console.log('📚 Estructura narrativa:');
      
      response5.data.data.structuredContent.sections.forEach((section, index) => {
        console.log(`  ${index + 1}. ${section.title} (${section.content.length} caracteres)`);
      });
      
    } catch (error) {
      console.log('❌ Error en contenido creativo:', error.response?.data || error.message);
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Función para mostrar ejemplos con curl
function showStructuredCurlExamples() {
  console.log('\n' + '='.repeat(100));
  console.log('📋 EJEMPLOS CON CURL PARA EL ENDPOINT ESTRUCTURADO:');
  console.log('='.repeat(100));
  
  console.log('\n1. Explicación estructurada:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/structured \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Explícame el concepto de APIs REST",
    "responseFormat": "structured",
    "contentType": "explanation",
    "includeExamples": true,
    "temperature": 0.6
  }'`);
  
  console.log('\n2. Tutorial paso a paso:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/structured \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Tutorial para crear una API con Node.js",
    "responseFormat": "markdown",
    "contentType": "tutorial",
    "includeExamples": true,
    "maxTokens": 2000
  }'`);
  
  console.log('\n3. Lista estructurada:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/structured \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Lista de herramientas esenciales para desarrolladores",
    "responseFormat": "structured",
    "contentType": "list",
    "includeExamples": true
  }'`);
  
  console.log('\n4. Análisis técnico:');
  console.log(`curl -X POST http://localhost:3000/vertex-ai/structured \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Compara Python vs JavaScript para backend",
    "responseFormat": "structured",
    "contentType": "analysis",
    "includeExamples": true,
    "context": "Para desarrollo de APIs web"
  }'`);
}

// Mostrar ejemplos de curl
showStructuredCurlExamples();

// Ejecutar pruebas automáticas
console.log('\n' + '='.repeat(100));
console.log('🧪 INICIANDO PRUEBAS DEL ENDPOINT ESTRUCTURADO...');
console.log('='.repeat(100));
console.log('Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
console.log('Para iniciarlo: npm run start:dev\n');

// Esperar 2 segundos antes de ejecutar las pruebas
setTimeout(testStructuredPrompt, 2000);