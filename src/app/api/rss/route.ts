import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface Article {
  title: string;
  summary?: string;
  description?: string;
  publishedAt: string;
  tags?: string[];
  imageUrl?: string;
  category: string;
  slug: string;
  url: string;
}

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'src', 'content');
    const categories = fs.readdirSync(contentDir);
    
    let allArticles: Article[] = [];
    
    // Coletar todos os artigos
    for (const category of categories) {
      const categoryPath = path.join(contentDir, category);
      if (fs.statSync(categoryPath).isDirectory()) {
        const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.mdx'));
        
        for (const file of files) {
          const filePath = path.join(categoryPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data: frontMatter } = matter(fileContent);
          
          allArticles.push({
            title: frontMatter.title || 'Sem título',
            summary: frontMatter.summary,
            description: frontMatter.description,
            publishedAt: frontMatter.publishedAt || new Date().toISOString(),
            tags: frontMatter.tags,
            imageUrl: frontMatter.imageUrl,
            category,
            slug: file.replace('.mdx', ''),
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ireland-ednews.vercel.app'}/article/${category}/${file.replace('.mdx', '')}`
          });
        }
      }
    }
    
    // Ordenar por data (mais recentes primeiro)
    allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Limitar a 50 artigos mais recentes
    allArticles = allArticles.slice(0, 50);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ireland-ednews.vercel.app';
    const lastBuildDate = new Date().toUTCString();
    
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Ireland EdNews</title>
    <description>Your premier source for education and online learning news in Ireland</description>
    <link>${baseUrl}</link>
    <language>en-ie</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/api/rss" rel="self" type="application/rss+xml"/>
    <image>
      <url>${baseUrl}/logo.png</url>
      <title>Ireland EdNews</title>
      <link>${baseUrl}</link>
    </image>
    ${allArticles.map(article => `
    <item>
      <title><![CDATA[${article.title}]]></title>
      <description><![CDATA[${article.summary || article.description || ''}]]></description>
      <link>${article.url}</link>
      <guid isPermaLink="true">${article.url}</guid>
      <pubDate>${new Date(article.publishedAt).toUTCString()}</pubDate>
      <dc:creator><![CDATA[Ireland EdNews]]></dc:creator>
      <category><![CDATA[${article.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}]]></category>
      ${article.tags ? article.tags.map((tag: string) => `<category><![CDATA[${tag}]]></category>`).join('\n      ') : ''}
      ${article.imageUrl ? `<enclosure url="${article.imageUrl}" type="image/jpeg"/>` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

    return new NextResponse(rssContent, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    });
    
  } catch (error) {
    console.error('Erro ao gerar RSS feed:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
