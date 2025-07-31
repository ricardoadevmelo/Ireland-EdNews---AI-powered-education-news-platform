import { NextResponse } from 'next/server';
import { AutomatedContentAggregator } from '@/lib/content-aggregator';

let aggregator: AutomatedContentAggregator | null = null;
let lastUpdate: string | null = null;
let updateInProgress = false;

function getAggregator() {
  if (!aggregator) {
    aggregator = new AutomatedContentAggregator();
  }
  return aggregator;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'get';
  const category = searchParams.get('category');
  const university = searchParams.get('university');
  const query = searchParams.get('q');
  
  try {
    const contentAggregator = getAggregator();
    
    switch (action) {
      case 'update':
        if (updateInProgress) {
          return NextResponse.json({ 
            message: 'Update already in progress',
            lastUpdate 
          });
        }
        
        updateInProgress = true;
        try {
          const content = await contentAggregator.runAutomatedUpdate();
          lastUpdate = new Date().toISOString();
          return NextResponse.json({ 
            success: true,
            message: `Updated with ${content.length} articles`,
            articles: content.slice(0, 20), // Return preview
            lastUpdate 
          });
        } finally {
          updateInProgress = false;
        }
      
      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter required for search' }, { status: 400 });
        }
        const searchResults = await contentAggregator.searchContent(query);
        return NextResponse.json({ 
          articles: searchResults.slice(0, 20),
          total: searchResults.length,
          query 
        });
      
      case 'category':
        if (!category) {
          return NextResponse.json({ error: 'Category parameter required' }, { status: 400 });
        }
        const categoryContent = await contentAggregator.getContentByCategory(category);
        return NextResponse.json({ 
          articles: categoryContent,
          category,
          total: categoryContent.length 
        });
      
      case 'university':
        if (!university) {
          return NextResponse.json({ error: 'University parameter required' }, { status: 400 });
        }
        const universityContent = await contentAggregator.getUniversityContent(university);
        return NextResponse.json({ 
          articles: universityContent,
          university,
          total: universityContent.length 
        });
      
      case 'premium':
        const premiumContent = await contentAggregator.generatePremiumContent();
        return NextResponse.json({ 
          articles: premiumContent,
          type: 'premium',
          total: premiumContent.length 
        });
      
      case 'visa':
        const visaContent = await contentAggregator.getVisaContent();
        return NextResponse.json({ 
          articles: visaContent,
          type: 'visa',
          total: visaContent.length 
        });
      
      case 'guides':
        const guideContent = await contentAggregator.getApplicationGuides();
        return NextResponse.json({ 
          articles: guideContent,
          type: 'application-guides',
          total: guideContent.length 
        });
      
      case 'trending':
        const trendingTopics = await contentAggregator.getTrendingTopics();
        return NextResponse.json({ 
          topics: trendingTopics,
          type: 'trending' 
        });
      
      case 'stats':
        const stats = await contentAggregator.getContentStats();
        return NextResponse.json({ 
          stats,
          lastUpdate,
          updateInProgress 
        });
      
      case 'get':
      default:
        // Check if we need to run initial update
        if (!lastUpdate) {
          const content = await contentAggregator.runAutomatedUpdate();
          lastUpdate = new Date().toISOString();
          return NextResponse.json({ 
            articles: content.slice(0, 20),
            total: content.length,
            message: 'Initial content loaded',
            lastUpdate 
          });
        }
        
        // Return cached premium content
        const defaultContent = await contentAggregator.generatePremiumContent();
        return NextResponse.json({ 
          articles: defaultContent,
          total: defaultContent.length,
          lastUpdate 
        });
    }
  } catch (error) {
    console.error('Automated Content API Error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch content',
      message: error instanceof Error ? error.message : 'Unknown error',
      articles: [] 
    }, { status: 500 });
  }
}

// POST method for manual content updates
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    const contentAggregator = getAggregator();
    
    if (action === 'force-update') {
      const content = await contentAggregator.runAutomatedUpdate();
      lastUpdate = new Date().toISOString();
      
      return NextResponse.json({
        success: true,
        message: `Force updated with ${content.length} articles`,
        articles: content.slice(0, 10),
        lastUpdate
      });
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Automated Content POST Error:', error);
    return NextResponse.json({ 
      error: 'Failed to process request',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
