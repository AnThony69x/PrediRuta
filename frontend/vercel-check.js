#!/usr/bin/env node

/**
 * Script de verificación pre-despliegue para Vercel
 * Ejecutar antes de hacer push: node vercel-check.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para Vercel...\n');

let hasErrors = false;
let hasWarnings = false;

// 1. Verificar archivos de configuración
console.log('📋 Verificando archivos de configuración:');

const requiredFiles = [
  'package.json',
  'next.config.js',
  'vercel.json',
  '.vercelignore',
  '.env.example',
];

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists && file !== '.vercelignore') {
    hasErrors = true;
  }
});

console.log('');

// 2. Verificar package.json
console.log('📦 Verificando package.json:');

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

const requiredScripts = ['dev', 'build', 'start', 'lint'];
requiredScripts.forEach(script => {
  const exists = packageJson.scripts && packageJson.scripts[script];
  console.log(`  ${exists ? '✅' : '❌'} Script "${script}"`);
  if (!exists) {
    hasErrors = true;
  }
});

const requiredDeps = ['next', 'react', 'react-dom'];
requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies && packageJson.dependencies[dep];
  console.log(`  ${exists ? '✅' : '❌'} Dependencia "${dep}"`);
  if (!exists) {
    hasErrors = true;
  }
});

console.log('');

// 3. Verificar next.config.js
console.log('⚙️  Verificando next.config.js:');

try {
  const nextConfig = require('./next.config.js');
  console.log(`  ✅ Archivo válido`);
  console.log(`  ${nextConfig.reactStrictMode ? '✅' : '⚠️'} reactStrictMode ${nextConfig.reactStrictMode ? 'habilitado' : 'deshabilitado'}`);
  console.log(`  ${nextConfig.swcMinify ? '✅' : '⚠️'} swcMinify ${nextConfig.swcMinify ? 'habilitado' : 'deshabilitado'}`);
  
  if (!nextConfig.reactStrictMode || !nextConfig.swcMinify) {
    hasWarnings = true;
  }
} catch (error) {
  console.log(`  ❌ Error al cargar next.config.js: ${error.message}`);
  hasErrors = true;
}

console.log('');

// 4. Verificar .env.example
console.log('🔐 Verificando variables de entorno:');

const envExample = fs.readFileSync('.env.example', 'utf-8');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_BACKEND_API_URL',
  'NEXT_PUBLIC_APP_URL',
];

requiredEnvVars.forEach(envVar => {
  const exists = envExample.includes(envVar);
  console.log(`  ${exists ? '✅' : '❌'} ${envVar}`);
  if (!exists) {
    hasWarnings = true;
  }
});

// Verificar que no hay .env.local en el repositorio
if (fs.existsSync('.env.local')) {
  console.log('  ⚠️  .env.local existe (asegúrate de que esté en .gitignore)');
  hasWarnings = true;
}

console.log('');

// 5. Verificar .gitignore
console.log('🚫 Verificando .gitignore:');

if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf-8');
  const importantIgnores = [
    '.env.local',
    '.env*.local',
    'node_modules',
    '.next',
  ];
  
  importantIgnores.forEach(pattern => {
    const exists = gitignore.includes(pattern);
    console.log(`  ${exists ? '✅' : '⚠️'} ${pattern} ${exists ? 'ignorado' : 'NO ignorado'}`);
    if (!exists) {
      hasWarnings = true;
    }
  });
} else {
  console.log('  ❌ .gitignore no encontrado');
  hasErrors = true;
}

console.log('');

// 6. Intentar build de prueba
console.log('🏗️  Verificación de build:');
console.log('  ℹ️  Para verificar el build completo, ejecuta: npm run build');
console.log('');

// Resumen final
console.log('═'.repeat(50));
if (hasErrors) {
  console.log('❌ Se encontraron errores críticos');
  console.log('   Corrige los errores antes de desplegar en Vercel');
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Se encontraron advertencias');
  console.log('   Revisa las advertencias antes de desplegar');
  process.exit(0);
} else {
  console.log('✅ Todo listo para desplegar en Vercel!');
  console.log('');
  console.log('📝 Próximos pasos:');
  console.log('   1. Ejecuta: npm run build (para verificar el build)');
  console.log('   2. Haz commit de tus cambios');
  console.log('   3. Sigue la guía en VERCEL_DEPLOYMENT.md');
  process.exit(0);
}
