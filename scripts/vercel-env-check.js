#!/usr/bin/env node

/**
 * Script para verificar e listar variáveis de ambiente necessárias para o Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 VARIÁVEIS NECESSÁRIAS PARA O VERCEL');
console.log('=====================================\n');

// Ler arquivo .env.local para mostrar exemplo
const envPath = path.join(process.cwd(), '.env.local');
let localEnvExists = false;

if (fs.existsSync(envPath)) {
  localEnvExists = true;
  console.log('✅ Arquivo .env.local encontrado localmente\n');
} else {
  console.log('⚠️  Arquivo .env.local não encontrado\n');
}

console.log('📋 VARIÁVEIS OBRIGATÓRIAS PARA O VERCEL:');
console.log('----------------------------------------');

const requiredVars = [
  {
    name: 'NEWS_API_KEY',
    description: 'Chave da API do NewsAPI para buscar notícias',
    howToGet: 'Acesse https://newsapi.org e crie uma conta gratuita',
    environment: 'Production, Preview, Development'
  },
  {
    name: 'GEMINI_API_KEY', 
    description: 'Chave da API do Google Gemini para resumos com IA',
    howToGet: 'Acesse https://makersuite.google.com e crie uma API key',
    environment: 'Production, Preview, Development'
  },
  {
    name: 'NEXT_PUBLIC_BASE_URL',
    description: 'URL base da sua aplicação',
    howToGet: 'Será algo como: https://seu-projeto.vercel.app',
    environment: 'Production'
  }
];

const optionalVars = [
  {
    name: 'UNSPLASH_ACCESS_KEY',
    description: 'Chave para imagens do Unsplash (opcional)',
    howToGet: 'Acesse https://unsplash.com/developers',
    environment: 'Production, Preview, Development'
  }
];

requiredVars.forEach((envVar, index) => {
  console.log(`${index + 1}. ${envVar.name}`);
  console.log(`   📝 Descrição: ${envVar.description}`);
  console.log(`   🔗 Como obter: ${envVar.howToGet}`);
  console.log(`   🌍 Ambiente: ${envVar.environment}`);
  console.log('');
});

console.log('📋 VARIÁVEIS OPCIONAIS:');
console.log('----------------------');

optionalVars.forEach((envVar, index) => {
  console.log(`${index + 1}. ${envVar.name}`);
  console.log(`   📝 Descrição: ${envVar.description}`);
  console.log(`   🔗 Como obter: ${envVar.howToGet}`);
  console.log(`   🌍 Ambiente: ${envVar.environment}`);
  console.log('');
});

console.log('🎯 PASSOS PARA CONFIGURAR NO VERCEL:');
console.log('-----------------------------------');
console.log('1. Acesse https://vercel.com/dashboard');
console.log('2. Selecione seu projeto Ireland EdNews');
console.log('3. Vá em Settings > Environment Variables');
console.log('4. Para cada variável acima, clique em "Add New"');
console.log('5. Digite o nome exato da variável');
console.log('6. Cole o valor correspondente');
console.log('7. Selecione os ambientes apropriados');
console.log('8. Clique em "Save"');

console.log('\n🔄 APÓS CONFIGURAR:');
console.log('-------------------');
console.log('1. Vá em Deployments');
console.log('2. Clique em "Redeploy" no último deployment');
console.log('3. Aguarde o rebuild com as novas variáveis');

if (localEnvExists) {
  console.log('\n💡 DICA:');
  console.log('--------');
  console.log('Use os mesmos valores do seu arquivo .env.local');
  console.log('(exceto NEXT_PUBLIC_BASE_URL que deve ser a URL do Vercel)');
}

console.log('\n✅ Pronto! Suas variáveis estarão configuradas no Vercel.');
