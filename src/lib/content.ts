import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'src/content');

export interface ArticleMetadata {
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

export interface Article {
  metadata: ArticleMetadata;
  content: string;
}

/**
 * Get all categories (subdirectories in content folder)
 */
export function getCategories(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }
  
  return fs.readdirSync(contentDirectory).filter(item => {
    const fullPath = path.join(contentDirectory, item);
    return fs.statSync(fullPath).isDirectory();
  });
}

/**
 * Get all articles from a specific category
 */
export function getArticlesByCategory(category: string): Article[] {
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
    // Sort by publishedAt date (newest first)
    return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
  });
}

/**
 * Get all articles across all categories
 */
export function getAllArticles(): Article[] {
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

/**
 * Get a specific article by category and slug
 */
export function getArticle(category: string, slug: string): Article | null {
  const filePath = path.join(contentDirectory, category, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);
  
  return {
    metadata: {
      ...data,
      slug,
      category
    } as ArticleMetadata,
    content
  };
}

/**
 * Get featured articles (latest 6 articles)
 */
export function getFeaturedArticles(limit: number = 6): Article[] {
  return getAllArticles().slice(0, limit);
}
