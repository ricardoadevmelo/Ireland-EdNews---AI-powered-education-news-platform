import { NextResponse } from 'next/server';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface NewsApiResponse {
  articles: NewsArticle[];
  totalResults: number;
  status: string;
}

export async function GET(request: Request) {
  const apiKey = process.env.NEWS_API_KEY;
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  
  // Focused Irish education queries
  const queries = [
    'Irish universities education',
    'Trinity College Dublin',
    'University College Dublin UCD',
    'DCU Dublin City University',
    'Cork University education',
    'Ireland higher education',
    'Irish students international',
    'Dublin education technology',
    'Ireland research universities',
    'Irish academic programs'
  ];
  
  // Use category or random educational query
  const selectedQuery = category || queries[Math.floor(Math.random() * queries.length)];
  
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(selectedQuery)}&language=en&sortBy=publishedAt&pageSize=12&apiKey=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data: NewsApiResponse = await res.json();
    
    // Filter and enhance articles for Irish education relevance
    const filteredArticles = data.articles?.filter((article: NewsArticle) => 
      article.title && 
      article.description && 
      !article.title.toLowerCase().includes('[removed]') &&
      !article.description.toLowerCase().includes('[removed]')
    ).map((article: NewsArticle) => ({
      ...article,
      // Add Irish education context if missing
      description: article.description || 'Discover the latest developments in Irish higher education and university news.',
      urlToImage: article.urlToImage || null
    })) || [];
    
    return NextResponse.json({ 
      ...data, 
      articles: filteredArticles,
      source: 'Irish Education Focus',
      query: selectedQuery 
    });
  } catch (error) {
    console.error('News API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch news',
      articles: []
    }, { status: 500 });
  }
}
