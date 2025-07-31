#!/usr/bin/env node

/**
 * Script de Deploy para Ireland EdNews
 * Automatiza o processo de deploy no Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    return false;
  }
}

function installVercelCLI() {
  log('📦 Instalando Vercel CLI...', 'blue');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    log('✅ Vercel CLI instalado com sucesso!', 'green');
    return true;
  } catch (error) {
    log('❌ Erro ao instalar Vercel CLI', 'red');
    console.error(error.message);
    return false;
  }
}

function checkEnvironmentFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    log('⚠️  Arquivo .env.local não encontrado!', 'yellow');
    log('Certifique-se de criar o arquivo com as seguintes variáveis:', 'yellow');
    log('NEWS_API_KEY=sua_chave_aqui', 'yellow');
    log('GEMINI_API_KEY=sua_chave_aqui', 'yellow');
    log('UNSPLASH_ACCESS_KEY=sua_chave_aqui (opcional)', 'yellow');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const requiredVars = ['NEWS_API_KEY', 'GEMINI_API_KEY'];
  const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
  
  if (missingVars.length > 0) {
    log(`⚠️  Variáveis de ambiente faltando: ${missingVars.join(', ')}`, 'yellow');
    return false;
  }
  
  log('✅ Variáveis de ambiente configuradas corretamente', 'green');
  return true;
}

function runBuild() {
  log('🔨 Executando build...', 'blue');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    log('✅ Build concluído com sucesso!', 'green');
    return true;
  } catch (error) {
    log('❌ Erro no build', 'red');
    return false;
  }
}

function deployToVercel() {
  log('🚀 Fazendo deploy no Vercel...', 'blue');
  try {
    // Login no Vercel (se necessário)
    log('Verifique se você está logado no Vercel...', 'blue');
    execSync('vercel login', { stdio: 'inherit' });
    
    // Deploy
    execSync('vercel --prod', { stdio: 'inherit' });
    log('✅ Deploy concluído com sucesso!', 'green');
    return true;
  } catch (error) {
    log('❌ Erro no deploy', 'red');
    console.error(error.message);
    return false;
  }
}

function main() {
  log('🇮🇪 Ireland EdNews - Script de Deploy', 'blue');
  log('=====================================', 'blue');
  
  // Verificar Vercel CLI
  if (!checkVercelCLI()) {
    log('Vercel CLI não encontrado. Instalando...', 'yellow');
    if (!installVercelCLI()) {
      process.exit(1);
    }
  } else {
    log('✅ Vercel CLI encontrado', 'green');
  }
  
  // Verificar variáveis de ambiente
  if (!checkEnvironmentFile()) {
    log('❌ Configure as variáveis de ambiente antes de continuar', 'red');
    process.exit(1);
  }
  
  // Executar build
  if (!runBuild()) {
    log('❌ Falha no build. Corrija os erros antes de fazer deploy', 'red');
    process.exit(1);
  }
  
  // Deploy
  if (!deployToVercel()) {
    log('❌ Falha no deploy', 'red');
    process.exit(1);
  }
  
  log('🎉 Deploy concluído com sucesso!', 'green');
  log('🌐 Sua aplicação está disponível em: https://ireland-ednews.vercel.app', 'green');
  
  log('\n📋 Próximos passos:', 'blue');
  log('1. Configure as variáveis de ambiente no dashboard do Vercel', 'yellow');
  log('2. Configure os segredos do GitHub para o workflow', 'yellow');
  log('3. Configure as notificações do Slack', 'yellow');
}

if (require.main === module) {
  main();
}

module.exports = { main };
