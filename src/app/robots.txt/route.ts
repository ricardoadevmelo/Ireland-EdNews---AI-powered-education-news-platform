import { NextResponse } from 'next/server';

export async function GET() {
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://ireland-ednews-ricardo.vercel.app/sitemap.xml

# Crawl-delay for respectful crawling
Crawl-delay: 1

# Specific rules for search engines
User-agent: Googlebot
Allow: /
Crawl-delay: 0

User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Block unnecessary paths
Disallow: /api/
Disallow: /_next/
Disallow: /admin/
Disallow: /private/

# Allow important paths
Allow: /news
Allow: /education
Allow: /universities
Allow: /technology
Allow: /about
Allow: /contact

# News-specific directives
Allow: /news/*
Allow: /education/*
Allow: /universities/*
Allow: /technology/*`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
