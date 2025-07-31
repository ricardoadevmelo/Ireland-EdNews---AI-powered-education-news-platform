import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

interface ArticleMetadata {
  title: string;
  subtitle?: string;
  description: string;
  publishedAt: string;
  source: string;
  sourceUrl: string;
  urlToImage?: string;
  category: string;
  tags: string[];
  author: string;
  generated: string;
  slug: string;
}

interface Article {
  metadata: ArticleMetadata;
  content: string;
}

function getCategories(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  
  return fs.readdirSync(contentDirectory).filter(item => {
    const fullPath = path.join(contentDirectory, item);
    return fs.statSync(fullPath).isDirectory();
  });
}

function getArticlesByCategory(category: string): Article[] {
  const categoryPath = path.join(contentDirectory, category);
  
  if (!fs.existsSync(categoryPath)) {
    return [];
  }
  
  const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.mdx'));
  
  return files.map(file => {
    const filePath = path.join(categoryPath, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    const slug = file.replace('.mdx', '');
    
    return {
      metadata: {
        ...data,
        slug,
        category
      } as ArticleMetadata,
      content
    };
  }).sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });
}

function getAllArticles(): Article[] {
  const categories = getCategories();
  const allArticles: Article[] = [];
  
  categories.forEach(category => {
    const articles = getArticlesByCategory(category);
    allArticles.push(...articles);
  });
  
  return allArticles.sort((a, b) => {
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const slug = searchParams.get('slug');
  const limit = searchParams.get('limit');

  try {
    if (category && slug) {
      // Get specific article
      const filePath = path.join(contentDirectory, category, `${slug}.mdx`);
      
      if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
      
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContent);
      
      const article = {
        metadata: {
          ...data,
          slug,
          category
        } as ArticleMetadata,
        content
      };
      
      return NextResponse.json(article);
    }
    
    if (category) {
      // Get articles by category
      const articles = getArticlesByCategory(category);
      return NextResponse.json(articles);
    }

    // Get all articles or featured articles
    const allArticles = getAllArticles();
    const limitNum = limit ? parseInt(limit) : allArticles.length;
    const articles = allArticles.slice(0, limitNum);
    
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
