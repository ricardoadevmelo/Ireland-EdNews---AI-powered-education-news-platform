#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  siteUrl: process.env.SITE_URL || 'https://ireland-ednews-ricardo.vercel.app',
  cronSecret: process.env.CRON_SECRET || '',
  logFile: path.join(process.cwd(), 'logs', 'content-pipeline.log'),
  schedules: {
    fullUpdate: '0 */1 * * *', // Every hour
    premiumUpdate: '0 */6 * * *', // Every 6 hours
    universityUpdate: '0 8,20 * * *', // 8am and 8pm daily
  }
};

// Logging utility
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  console.log(logMessage.trim());
  
  // Ensure logs directory exists
  const logsDir = path.dirname(config.logFile);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  // Append to log file
  fs.appendFileSync(config.logFile, logMessage);
}

// HTTP request utility
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data });
        }
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Content aggregation functions
async function triggerFullUpdate() {
  log('🚀 Starting full content update...');
  
  try {
    const response = await makeRequest(`${config.siteUrl}/api/cron/content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${config.cronSecret}`,
        'User-Agent': 'Ireland-EdNews-Pipeline/1.0'
      }
    });
    
    if (response.statusCode === 200) {
      log(`✅ Full update completed: ${JSON.stringify(response.data.results)}`);
      return response.data;
    } else {
      throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    log(`❌ Full update failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

async function triggerPremiumUpdate() {
  log('💎 Starting premium content update...');
  
  try {
    const response = await makeRequest(`${config.siteUrl}/api/cron/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Ireland-EdNews-Pipeline/1.0'
      },
      body: JSON.stringify({ action: 'premium-update' })
    });
    
    if (response.statusCode === 200) {
      log(`✅ Premium update completed: ${JSON.stringify(response.data.results)}`);
      return response.data;
    } else {
      throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    log(`❌ Premium update failed: ${error.message}`, 'ERROR');
    throw error;
  }
}

async function triggerUniversityUpdate(university) {
  log(`🏛️ Starting university update for ${university}...`);
  
  try {
    const response = await makeRequest(`${config.siteUrl}/api/cron/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Ireland-EdNews-Pipeline/1.0'
      },
      body: JSON.stringify({ action: 'university-focus', university })
    });
    
    if (response.statusCode === 200) {
      log(`✅ University update completed for ${university}: ${JSON.stringify(response.data.results)}`);
      return response.data;
    } else {
      throw new Error(`HTTP ${response.statusCode}: ${JSON.stringify(response.data)}`);
    }
  } catch (error) {
    log(`❌ University update failed for ${university}: ${error.message}`, 'ERROR');
    throw error;
  }
}

// Health check
async function healthCheck() {
  try {
    const response = await makeRequest(`${config.siteUrl}/api/automated-content?action=stats`);
    
    if (response.statusCode === 200) {
      const stats = response.data.stats;
      log(`📊 Health check passed: ${stats.totalArticles} articles, ${Math.round(stats.averageRelevanceScore * 100)}% avg relevance`);
      return true;
    } else {
      log(`⚠️ Health check warning: HTTP ${response.statusCode}`, 'WARN');
      return false;
    }
  } catch (error) {
    log(`❌ Health check failed: ${error.message}`, 'ERROR');
    return false;
  }
}

// Main pipeline execution
async function runPipeline(action = 'full') {
  log(`🏗️ Starting content pipeline: ${action}`);
  
  try {
    // Health check first
    const isHealthy = await healthCheck();
    if (!isHealthy && action !== 'health') {
      log('⚠️ System health check failed, continuing anyway...', 'WARN');
    }
    
    switch (action) {
      case 'full':
        await triggerFullUpdate();
        break;
        
      case 'premium':
        await triggerPremiumUpdate();
        break;
        
      case 'university':
        const universities = ['trinity', 'ucd', 'dcu', 'cork', 'galway'];
        for (const uni of universities) {
          await triggerUniversityUpdate(uni);
          // Wait 30 seconds between university updates
          await new Promise(resolve => setTimeout(resolve, 30000));
        }
        break;
        
      case 'health':
        // Health check already performed
        break;
        
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    log(`✅ Pipeline completed successfully: ${action}`);
    
  } catch (error) {
    log(`❌ Pipeline failed: ${error.message}`, 'ERROR');
    process.exit(1);
  }
}

// Performance monitoring
function startMonitoring() {
  log('📈 Starting performance monitoring...');
  
  setInterval(async () => {
    try {
      const startTime = Date.now();
      await healthCheck();
      const responseTime = Date.now() - startTime;
      
      if (responseTime > 10000) { // 10 seconds
        log(`⚠️ Slow response detected: ${responseTime}ms`, 'WARN');
      }
    } catch (error) {
      log(`❌ Monitoring error: ${error.message}`, 'ERROR');
    }
  }, 5 * 60 * 1000); // Every 5 minutes
}

// CLI interface
if (require.main === module) {
  const action = process.argv[2] || 'full';
  
  console.log('🇮🇪 Ireland EdNews - Automated Content Pipeline');
  console.log('================================================');
  console.log(`Action: ${action}`);
  console.log(`Site: ${config.siteUrl}`);
  console.log(`Log file: ${config.logFile}`);
  console.log('');
  
  if (process.argv.includes('--monitor')) {
    startMonitoring();
  }
  
  runPipeline(action).then(() => {
    if (!process.argv.includes('--monitor')) {
      process.exit(0);
    }
  }).catch(() => {
    process.exit(1);
  });
}

module.exports = {
  runPipeline,
  triggerFullUpdate,
  triggerPremiumUpdate,
  triggerUniversityUpdate,
  healthCheck,
  startMonitoring
};
