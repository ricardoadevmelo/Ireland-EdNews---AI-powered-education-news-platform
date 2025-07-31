#!/usr/bin/env node

/**
 * Ireland EdNews - Monitoring Script
 * Verifica a saúde do sistema e envia alertas
 */

require('dotenv').config({ path: '.env.local' });

const fs = require('fs-extra');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');

/**
 * Verificar se há conteúdo gerado nas últimas 24 horas
 */
function checkRecentContent() {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  let recentFiles = 0;
  
  try {
    const categories = fs.readdirSync(CONTENT_DIR);
    
    categories.forEach(category => {
      const categoryPath = path.join(CONTENT_DIR, category);
      const files = fs.readdirSync(categoryPath);
      
      files.forEach(file => {
        const filePath = path.join(categoryPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime > yesterday) {
          recentFiles++;
        }
      });
    });
    
    return {
      success: true,
      recentFiles,
      message: `Found ${recentFiles} files created in the last 24 hours`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Verificar APIs estão funcionando
 */
async function checkAPIs() {
  const results = [];
  
  // Test NewsAPI
  try {
    const newsResponse = await fetch(`https://newsapi.org/v2/top-headlines?country=us&pageSize=1&apiKey=${process.env.NEWS_API_KEY}`);
    results.push({
      api: 'NewsAPI',
      status: newsResponse.ok ? 'OK' : 'ERROR',
      statusCode: newsResponse.status
    });
  } catch (error) {
    results.push({
      api: 'NewsAPI',
      status: 'ERROR',
      error: error.message
    });
  }
  
  // Test local API
  try {
    const localResponse = await fetch('http://localhost:3000/api/content?limit=1');
    results.push({
      api: 'Local Content API',
      status: localResponse.ok ? 'OK' : 'ERROR',
      statusCode: localResponse.status
    });
  } catch (error) {
    results.push({
      api: 'Local Content API',
      status: 'ERROR',
      error: error.message
    });
  }
  
  return results;
}

/**
 * Gerar relatório de sistema
 */
async function generateHealthReport() {
  console.log('🏥 Ireland EdNews - System Health Check');
  console.log('=====================================');
  
  // Check content
  const contentCheck = checkRecentContent();
  console.log('\n📁 Content Status:');
  if (contentCheck.success) {
    console.log(`✅ ${contentCheck.message}`);
    if (contentCheck.recentFiles === 0) {
      console.log('⚠️  WARNING: No new content generated in the last 24 hours');
    }
  } else {
    console.log(`❌ ERROR: ${contentCheck.error}`);
  }
  
  // Check APIs
  console.log('\n🔌 API Status:');
  const apiResults = await checkAPIs();
  apiResults.forEach(result => {
    const icon = result.status === 'OK' ? '✅' : '❌';
    console.log(`${icon} ${result.api}: ${result.status}`);
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
  });
  
  // Check disk space (if content folder exists)
  if (fs.existsSync(CONTENT_DIR)) {
    const stats = fs.statSync(CONTENT_DIR);
    console.log('\n💾 Storage:');
    console.log(`✅ Content directory exists and is accessible`);
  }
  
  // Environment check
  console.log('\n🔑 Environment:');
  const requiredEnvs = ['NEWS_API_KEY', 'GEMINI_API_KEY'];
  requiredEnvs.forEach(env => {
    const icon = process.env[env] ? '✅' : '❌';
    console.log(`${icon} ${env}: ${process.env[env] ? 'Set' : 'Missing'}`);
  });
  
  console.log('\n🕒 Report generated at:', new Date().toISOString());
}

/**
 * Função principal
 */
async function main() {
  try {
    await generateHealthReport();
  } catch (error) {
    console.error('❌ Health check failed:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { checkRecentContent, checkAPIs, generateHealthReport };
