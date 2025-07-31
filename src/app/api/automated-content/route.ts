import { NextResponse } from 'next/server';

// Mock data for development
const mockContent = [
  {
    title: "Trinity College Dublin announces new scholarship program",
    description: "Trinity College Dublin has launched a new scholarship initiative for international students.",
    content: "The Trinity College Dublin scholarship program aims to attract the best international talent...",
    url: "https://tcd.ie/news/scholarship-program",
    image: null,
    publishedAt: new Date().toISOString(),
    source: "Trinity College Dublin",
    category: "trinity-college",
    tags: ["Trinity College Dublin", "Scholarships", "International Students"],
    relevanceScore: 0.9
  },
  {
    title: "UCD Research Breakthrough in Education Technology",
    description: "University College Dublin researchers have developed innovative education technology.",
    content: "The breakthrough in education technology at UCD promises to revolutionize online learning...",
    url: "https://ucd.ie/news/research-breakthrough",
    image: null,
    publishedAt: new Date().toISOString(),
    source: "University College Dublin",
    category: "ucd",
    tags: ["UCD", "Research", "Education Technology"],
    relevanceScore: 0.85
  },
  {
    title: "Premium: Complete Guide to Irish University Applications",
    description: "Comprehensive guide covering all aspects of applying to Irish universities.",
    content: "This premium guide provides step-by-step instructions for university applications...",
    url: "#",
    image: null,
    publishedAt: new Date().toISOString(),
    source: "Ireland EdNews Premium",
    category: "premium",
    tags: ["Premium", "University Applications", "Guide"],
    relevanceScore: 0.95
  },
  {
    title: "Irish Student Visa Requirements 2025",
    description: "Updated requirements for student visas in Ireland.",
    content: "Student visa requirements for studying in Ireland...",
    url: "#",
    image: null,
    publishedAt: new Date().toISOString(),
    source: "Immigration Ireland",
    category: "visa",
    tags: ["Visa", "Immigration", "Student Visa"],
    relevanceScore: 0.9
  },
  {
    title: "How to Apply to Trinity College Dublin",
    description: "Step-by-step application guide for Trinity College.",
    content: "Complete application process for Trinity College Dublin...",
    url: "#",
    image: null,
    publishedAt: new Date().toISOString(),
    source: "Trinity College Dublin",
    category: "guide",
    tags: ["Trinity College Dublin", "Application Guide"],
    relevanceScore: 0.88
  },
  {
    title: "DCU launches new Computer Science program",
    description: "Dublin City University announces expanded computer science curriculum.",
    content: "DCU's new computer science program features AI and machine learning...",
    url: "#",
    image: null,
    publishedAt: new Date().toISOString(),
    source: "Dublin City University",
    category: "dcu",
    tags: ["DCU", "Computer Science", "Programs"],
    relevanceScore: 0.82
  }
];

let lastUpdate: string | null = null;
let updateInProgress = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'get';
  const category = searchParams.get('category');
  const university = searchParams.get('university');
  const query = searchParams.get('q');
  
  try {
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
          lastUpdate = new Date().toISOString();
          return NextResponse.json({ 
            success: true,
            message: `Updated with ${mockContent.length} articles`,
            articles: mockContent.slice(0, 20),
            lastUpdate 
          });
        } finally {
          updateInProgress = false;
        }
      
      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Query parameter required for search' }, { status: 400 });
        }
        const searchResults = mockContent.filter(item => 
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.description.toLowerCase().includes(query.toLowerCase())
        );
        return NextResponse.json({ 
          articles: searchResults.slice(0, 20),
          total: searchResults.length,
          query 
        });
      
      case 'category':
        if (!category) {
          return NextResponse.json({ error: 'Category parameter required' }, { status: 400 });
        }
        const categoryContent = mockContent.filter(item => item.category === category);
        return NextResponse.json({ 
          articles: categoryContent,
          category,
          total: categoryContent.length 
        });
      
      case 'university':
        if (!university) {
          return NextResponse.json({ error: 'University parameter required' }, { status: 400 });
        }
        const universityContent = mockContent.filter(item => 
          item.source.toLowerCase().includes(university.toLowerCase()) ||
          item.category.includes(university.toLowerCase())
        );
        return NextResponse.json({ 
          articles: universityContent,
          university,
          total: universityContent.length 
        });
      
      case 'premium':
        const premiumContent = mockContent.filter(item => 
          item.relevanceScore > 0.8 || item.category === 'premium'
        );
        return NextResponse.json({ 
          articles: premiumContent,
          type: 'premium',
          total: premiumContent.length 
        });
      
      case 'visa':
        const visaContent = mockContent.filter(item => 
          item.tags.some(tag => tag.toLowerCase().includes('visa'))
        );
        return NextResponse.json({ 
          articles: visaContent,
          type: 'visa',
          total: visaContent.length 
        });
      
      case 'guides':
        const guideContent = mockContent.filter(item => 
          item.category === 'guide' || item.title.toLowerCase().includes('guide')
        );
        return NextResponse.json({ 
          articles: guideContent,
          type: 'application-guides',
          total: guideContent.length 
        });
      
      case 'trending':
        const trendingTopics = [
          { topic: "Trinity College Dublin", count: 25, trend: "up" as const },
          { topic: "Student Visa", count: 18, trend: "up" as const },
          { topic: "UCD Admissions", count: 15, trend: "stable" as const }
        ];
        return NextResponse.json({ 
          topics: trendingTopics,
          type: 'trending' 
        });
      
      case 'stats':
        const stats = {
          totalArticles: mockContent.length,
          sourceBreakdown: { "Trinity College Dublin": 2, "UCD": 1, "DCU": 1 },
          categoryBreakdown: { "university": 3, "visa": 1, "guides": 2 },
          lastUpdate: lastUpdate || new Date().toISOString(),
          averageRelevanceScore: 0.85
        };
        return NextResponse.json({ 
          stats,
          lastUpdate,
          updateInProgress 
        });
      
      case 'get':
      default:
        return NextResponse.json({ 
          articles: mockContent,
          total: mockContent.length,
          lastUpdate: lastUpdate || new Date().toISOString()
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'force-update') {
      lastUpdate = new Date().toISOString();
      
      return NextResponse.json({
        success: true,
        message: `Force updated with ${mockContent.length} articles`,
        articles: mockContent.slice(0, 10),
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
