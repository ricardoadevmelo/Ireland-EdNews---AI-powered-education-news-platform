#!/usr/bin/env node

/**
 * Ireland EdNews - Content Pipeline
 * Script para buscar notícias, processar com AI e gerar arquivos MDX
 */

// Carregar variáveis de ambiente
require('dotenv').config({ path: '.env.local' });

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const slugify = require('slugify');

// Configurações
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CONTENT_DIR = path.join(__dirname, '..', 'src', 'content');

// Inicializar Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Categorias focadas em educação
const EDUCATION_CATEGORIES = [
  'education technology',
  'online learning',
  'e-learning',
  'digital education',
  'educational technology',
  'distance learning',
  'virtual classroom',
  'learning management system',
  'educational innovation',
  'skill development'
];

/**
 * Buscar notícias da NewsAPI
 */
async function fetchNews(query, pageSize = 20) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'error') {
      throw new Error(data.message);
    }
    
    return data.articles || [];
  } catch (error) {
    console.error(`Erro ao buscar notícias para "${query}":`, error.message);
    return [];
  }
}

/**
 * Resumir artigo usando Gemini AI
 */
async function summarizeArticle(article) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
    Please summarize this news article in approximately 150 words. Use a human and direct tone, writing in British English. 
    Focus on the key educational aspects and implications for online learning.
    
    Title: ${article.title}
    Content: ${article.description || ''} ${article.content || ''}
    
    Provide:
    1. A summary in ~150 words
    2. A suggested subtitle (optional, 1 line)
    3. Key tags related to education/e-learning (3-5 tags)
    
    Format your response as:
    SUMMARY: [your summary here]
    SUBTITLE: [subtitle here]
    TAGS: [tag1, tag2, tag3]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse da resposta
    const summaryMatch = text.match(/SUMMARY:\s*(.*?)(?=SUBTITLE:|TAGS:|$)/s);
    const subtitleMatch = text.match(/SUBTITLE:\s*(.*?)(?=TAGS:|$)/s);
    const tagsMatch = text.match(/TAGS:\s*(.*?)$/s);
    
    return {
      summary: summaryMatch ? summaryMatch[1].trim() : text.substring(0, 300),
      subtitle: subtitleMatch ? subtitleMatch[1].trim() : '',
      tags: tagsMatch ? tagsMatch[1].split(',').map(tag => tag.trim()) : []
    };
  } catch (error) {
    console.error('Erro ao resumir artigo:', error.message);
    return {
      summary: article.description?.substring(0, 300) || 'Summary not available',
      subtitle: '',
      tags: ['education', 'news']
    };
  }
}

/**
 * Gerar arquivo MDX
 */
async function generateMDX(article, aiData, category) {
  const publishedAt = new Date(article.publishedAt);
  const dateStr = publishedAt.toISOString().split('T')[0]; // YYYY-MM-DD
  
  const slug = slugify(article.title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  }).substring(0, 50);
  
  const filename = `${dateStr}-${slug}.mdx`;
  const categoryDir = path.join(CONTENT_DIR, category);
  
  // Criar diretório se não existir
  await fs.ensureDir(categoryDir);
  
  const frontMatter = {
    title: article.title,
    subtitle: aiData.subtitle,
    description: aiData.summary,
    publishedAt: article.publishedAt,
    source: article.source?.name || 'Unknown',
    sourceUrl: article.url,
    urlToImage: article.urlToImage,
    category: category,
    tags: aiData.tags,
    author: article.author || 'Unknown',
    generated: new Date().toISOString()
  };
  
  const content = `---
${Object.entries(frontMatter)
  .map(([key, value]) => {
    if (Array.isArray(value)) {
      return `${key}: [${value.map(v => `"${v}"`).join(', ')}]`;
    }
    return `${key}: "${value}"`;
  })
  .join('\n')}
---

# ${article.title}

${aiData.subtitle ? `*${aiData.subtitle}*\n` : ''}

${aiData.summary}

## Original Article

Read the full article at: [${article.source?.name || 'Source'}](${article.url})

*Published: ${publishedAt.toLocaleDateString('en-GB')}*
`;

  const filePath = path.join(categoryDir, filename);
  await fs.writeFile(filePath, content, 'utf8');
  
  console.log(`✅ Generated: ${filePath}`);
  return filePath;
}

/**
 * Mapear query para categoria de arquivo
 */
function getCategory(query) {
  const categoryMap = {
    'education technology': 'teaching-technologies',
    'online learning': 'k12-education',
    'e-learning': 'platforms-tools',
    'digital education': 'trends-innovations',
    'educational technology': 'teaching-technologies',
    'distance learning': 'professional-development',
    'virtual classroom': 'platforms-tools',
    'learning management system': 'platforms-tools',
    'educational innovation': 'trends-innovations',
    'skill development': 'professional-development'
  };
  
  return categoryMap[query] || 'sector-news';
}

/**
 * Função principal
 */
async function main() {
  console.log('🚀 Starting Ireland EdNews Content Pipeline...');
  
  if (!NEWS_API_KEY || !GEMINI_API_KEY) {
    console.error('❌ Missing API keys. Please check NEWS_API_KEY and GEMINI_API_KEY');
    process.exit(1);
  }
  
  // Limpar diretório de conteúdo existente
  await fs.remove(CONTENT_DIR);
  await fs.ensureDir(CONTENT_DIR);
  
  let totalGenerated = 0;
  
  for (const query of EDUCATION_CATEGORIES.slice(0, 2)) { // Teste com apenas 2 categorias
    console.log(`\n📰 Fetching news for: ${query}`);
    
    const articles = await fetchNews(query, 2); // 2 artigos por categoria para teste
    console.log(`Found ${articles.length} articles`);
    
    for (const article of articles) {
      if (!article.title || !article.url) continue;
      
      console.log(`\n🤖 Processing: ${article.title.substring(0, 50)}...`);
      
      try {
        const aiData = await summarizeArticle(article);
        const category = getCategory(query);
        await generateMDX(article, aiData, category);
        totalGenerated++;
        
        // Rate limiting - pausa entre chamadas da API
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error processing article: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ Pipeline completed! Generated ${totalGenerated} articles.`);
  console.log(`📁 Content saved in: ${CONTENT_DIR}`);
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main, fetchNews, summarizeArticle, generateMDX };
