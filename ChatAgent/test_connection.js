/**
 * Test de conexión para ChatAgent API
 * Ejecutar con: node test_connection.js
 * O con: npm test (si se configura en package.json)
 */

const CHATAGENT_URL = process.env.CHATAGENT_URL || 'http://localhost:8001';

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

/**
 * Imprime un mensaje con color
 */
function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

/**
 * Imprime un encabezado
 */
function header(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'cyan');
  console.log('='.repeat(60) + '\n');
}

/**
 * Test del endpoint de health
 */
async function testHealth() {
  log('🔍 Test 1: Health Check', 'blue');
  try {
    const response = await fetch(`${CHATAGENT_URL}/api/v1/health`);
    
    if (response.ok) {
      const data = await response.json();
      log('✅ Health check exitoso', 'green');
      console.log('   Respuesta:', JSON.stringify(data, null, 2));
      return true;
    } else {
      log(`❌ Error ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Error de conexión: ' + error.message, 'red');
    return false;
  }
}

/**
 * Test del endpoint raíz
 */
async function testRoot() {
  log('\n🏠 Test 2: Endpoint Raíz', 'blue');
  try {
    const response = await fetch(`${CHATAGENT_URL}/`);
    
    if (response.ok) {
      const data = await response.json();
      log('✅ Endpoint raíz exitoso', 'green');
      console.log('   Nombre:', data.name);
      console.log('   Versión:', data.version);
      console.log('   Descripción:', data.description);
      return true;
    } else {
      log(`❌ Error ${response.status}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    return false;
  }
}

/**
 * Test del endpoint de chat
 */
async function testChat(question) {
  log(`\n💬 Test 3: Chat Endpoint`, 'blue');
  log(`   Pregunta: "${question}"`, 'yellow');
  
  try {
    const response = await fetch(`${CHATAGENT_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (response.ok) {
      const data = await response.json();
      log('✅ Respuesta recibida exitosamente', 'green');
      console.log('\n   📝 Respuesta del agente:');
      console.log('   ' + '-'.repeat(58));
      console.log('   ' + data.answer.replace(/\n/g, '\n   '));
      console.log('   ' + '-'.repeat(58));
      return true;
    } else {
      const errorData = await response.json().catch(() => ({}));
      log(`❌ Error ${response.status}: ${errorData.detail || 'Error desconocido'}`, 'red');
      return false;
    }
  } catch (error) {
    log('❌ Error: ' + error.message, 'red');
    return false;
  }
}

/**
 * Test de múltiples preguntas
 */
async function testMultipleQuestions() {
  log('\n🔄 Test 4: Múltiples Preguntas', 'blue');
  
  const questions = [
    '¿Qué vía es más recomendable para ir de Tarqui al Centro?',
    '¿A qué hora hay menos tráfico en la Av. Malecón?',
    '¿Cuáles son las vías principales de Manta?',
  ];

  let successCount = 0;
  
  for (let i = 0; i < questions.length; i++) {
    log(`\n   Pregunta ${i + 1}/${questions.length}: "${questions[i]}"`, 'yellow');
    
    try {
      const response = await fetch(`${CHATAGENT_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: questions[i] }),
      });

      if (response.ok) {
        await response.json();
        log('   ✅ Respuesta recibida', 'green');
        successCount++;
      } else {
        log(`   ❌ Error ${response.status}`, 'red');
      }
    } catch (error) {
      log('   ❌ Error: ' + error.message, 'red');
    }
    
    // Pequeña pausa entre requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  log(`\n   Resultado: ${successCount}/${questions.length} exitosas`, 
      successCount === questions.length ? 'green' : 'yellow');
  
  return successCount === questions.length;
}

/**
 * Test de manejo de errores
 */
async function testErrorHandling() {
  log('\n⚠️  Test 5: Manejo de Errores', 'blue');
  
  try {
    const response = await fetch(`${CHATAGENT_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: '' }), // Pregunta vacía
    });

    if (!response.ok) {
      log('✅ El servidor rechaza preguntas vacías correctamente', 'green');
      return true;
    } else {
      log('⚠️  El servidor aceptó una pregunta vacía', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Error inesperado: ' + error.message, 'red');
    return false;
  }
}

/**
 * Ejecuta todos los tests
 */
async function runAllTests() {
  header('🤖 PRUEBAS DE CONEXIÓN - CHATAGENT API');
  log(`🌐 URL del servicio: ${CHATAGENT_URL}`, 'cyan');
  
  const results = {
    health: false,
    root: false,
    chat: false,
    multiple: false,
    errors: false,
  };

  // Test 1: Health Check
  results.health = await testHealth();

  // Test 2: Endpoint Raíz
  results.root = await testRoot();

  // Test 3: Chat básico
  if (results.health) {
    results.chat = await testChat('¿Qué vía es mejor para ir del Mall del Pacífico al centro?');
  } else {
    log('\n⏭️  Saltando test de chat (servicio no disponible)', 'yellow');
  }

  // Test 4: Múltiples preguntas
  if (results.chat) {
    results.multiple = await testMultipleQuestions();
  } else {
    log('\n⏭️  Saltando test de múltiples preguntas', 'yellow');
  }

  // Test 5: Manejo de errores
  results.errors = await testErrorHandling();

  // Resumen final
  header('📊 RESUMEN DE RESULTADOS');
  
  const total = Object.keys(results).length;
  const passed = Object.values(results).filter(r => r).length;
  
  console.log('Resultados individuales:');
  console.log(`  Health Check:        ${results.health ? '✅' : '❌'}`);
  console.log(`  Endpoint Raíz:       ${results.root ? '✅' : '❌'}`);
  console.log(`  Chat Básico:         ${results.chat ? '✅' : '❌'}`);
  console.log(`  Múltiples Preguntas: ${results.multiple ? '✅' : '❌'}`);
  console.log(`  Manejo de Errores:   ${results.errors ? '✅' : '❌'}`);
  
  console.log('\n' + '='.repeat(60));
  log(`TOTAL: ${passed}/${total} tests pasaron`, passed === total ? 'green' : 'yellow');
  console.log('='.repeat(60) + '\n');

  if (passed === total) {
    log('🎉 ¡Todos los tests pasaron! El ChatAgent está funcionando correctamente.', 'green');
  } else if (passed > 0) {
    log('⚠️  Algunos tests fallaron. Revisa la configuración del servicio.', 'yellow');
  } else {
    log('❌ Todos los tests fallaron. Asegúrate de que el servicio esté corriendo.', 'red');
    log('\n💡 Tip: Ejecuta el servidor con: cd ChatAgent && start.bat', 'cyan');
  }

  return passed === total;
}

// Ejecutar tests
runAllTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log('\n❌ Error fatal: ' + error.message, 'red');
    process.exit(1);
  });
