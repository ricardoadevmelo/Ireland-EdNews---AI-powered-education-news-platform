import { NextResponse } from 'next/server';

interface SearchFilters {
  category?: string;
  university?: string;
  dateRange?: 'today' | 'week' | 'month' | 'year';
  source?: string;
  relevanceMin?: number;
  contentType?: 'article' | 'guide' | 'news' | 'premium';
}

interface ScrapedContent {
  title: string;
  description: string;
  content: string;
  url: string;
  image?: string;
  publishedAt: string;
  source: string;
  category: string;
  tags: string[];
  relevanceScore: number;
}

interface SearchResult {
  query: string;
  filters: SearchFilters;
  results: ScrapedContent[];
  total: number;
  suggestions: string[];
  facets: {
    categories: Array<{name: string, count: number}>;
    universities: Array<{name: string, count: number}>;
    sources: Array<{name: string, count: number}>;
    dateRanges: Array<{range: string, count: number}>;
  };
}

// Mock search data
const mockSearchData: ScrapedContent[] = [
  {
    title: "Trinity College Dublin Scholarship Program 2025",
    description: "New scholarship opportunities for international students at Trinity College Dublin.",
    content: "Trinity College Dublin is pleased to announce new scholarship opportunities...",
    url: "https://tcd.ie/scholarships",
    image: undefined,
    publishedAt: "2025-01-15T10:00:00Z",
    source: "Trinity College Dublin",
    category: "scholarships",
    tags: ["Trinity College Dublin", "Scholarships", "International Students"],
    relevanceScore: 0.95
  },
  {
    title: "UCD Admissions Process Guide",
    description: "Complete guide to applying to University College Dublin.",
    content: "University College Dublin admissions process includes...",
    url: "https://ucd.ie/admissions",
    image: undefined,
    publishedAt: "2025-01-10T14:30:00Z",
    source: "University College Dublin",
    category: "admissions",
    tags: ["UCD", "Admissions", "Application Guide"],
    relevanceScore: 0.88
  },
  {
    title: "Irish Student Visa Requirements Update",
    description: "Latest updates on student visa requirements for Ireland.",
    content: "The Irish immigration authority has updated student visa requirements...",
    url: "https://inis.gov.ie/student-visas",
    image: undefined,
    publishedAt: "2025-01-08T09:15:00Z",
    source: "Irish Immigration Service",
    category: "visa",
    tags: ["Student Visa", "Immigration", "Requirements"],
    relevanceScore: 0.92
  },
  {
    title: "Dublin City University New Programs 2025",
    description: "DCU announces new undergraduate and postgraduate programs.",
    content: "Dublin City University has introduced several new programs...",
    url: "https://dcu.ie/new-programs",
    image: undefined,
    publishedAt: "2025-01-05T11:45:00Z",
    source: "Dublin City University",
    category: "programs",
    tags: ["DCU", "New Programs", "Undergraduate", "Postgraduate"],
    relevanceScore: 0.85
  },
  {
    title: "Cork University Research Excellence",
    description: "University College Cork leads in research innovation.",
    content: "University College Cork continues to excel in research...",
    url: "https://ucc.ie/research",
    image: undefined,
    publishedAt: "2025-01-03T16:20:00Z",
    source: "University College Cork",
    category: "research",
    tags: ["UCC", "Research", "Innovation"],
    relevanceScore: 0.80
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category');
  const university = searchParams.get('university');
  const dateRange = searchParams.get('dateRange') as SearchFilters['dateRange'];
  const source = searchParams.get('source');
  const relevanceMin = searchParams.get('relevanceMin') ? parseFloat(searchParams.get('relevanceMin')!) : undefined;
  const contentType = searchParams.get('contentType') as SearchFilters['contentType'];
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  const filters: SearchFilters = {
    category: category || undefined,
    university: university || undefined,
    dateRange,
    source: source || undefined,
    relevanceMin,
    contentType
  };

  try {
    // Get base search results
    let results = query ? 
      mockSearchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ) :
      mockSearchData;

    // Apply filters
    results = applyFilters(results, filters);
    
    // Generate facets for filtering UI
    const facets = generateFacets(results);
    
    // Generate search suggestions
    const suggestions = generateSuggestions(query, results);
    
    // Paginate results
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);
    
    const searchResult: SearchResult = {
      query,
      filters,
      results: paginatedResults,
      total: results.length,
      suggestions,
      facets
    };

    return NextResponse.json(searchResult);
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({ 
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      query,
      filters,
      results: [],
      total: 0,
      suggestions: [],
      facets: {
        categories: [],
        universities: [],
        sources: [],
        dateRanges: []
      }
    }, { status: 500 });
  }
}

function applyFilters(results: ScrapedContent[], filters: SearchFilters): ScrapedContent[] {
  let filtered = [...results];

  if (filters.category) {
    filtered = filtered.filter(item => 
      item.category === filters.category ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(filters.category!.toLowerCase()))
    );
  }

  if (filters.university) {
    const universityKeywords = getUniversityKeywords(filters.university);
    filtered = filtered.filter(item => 
      universityKeywords.some(keyword => 
        item.title.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(keyword))
      )
    );
  }

  if (filters.dateRange) {
    const now = new Date();
    let cutoffDate: Date;
    
    switch (filters.dateRange) {
      case 'today':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'year':
        cutoffDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        cutoffDate = new Date(0);
    }
    
    filtered = filtered.filter(item => new Date(item.publishedAt) >= cutoffDate);
  }

  if (filters.source) {
    filtered = filtered.filter(item => 
      item.source.toLowerCase().includes(filters.source!.toLowerCase())
    );
  }

  if (filters.relevanceMin !== undefined) {
    filtered = filtered.filter(item => item.relevanceScore >= filters.relevanceMin!);
  }

  if (filters.contentType) {
    switch (filters.contentType) {
      case 'premium':
        filtered = filtered.filter(item => item.relevanceScore > 0.7);
        break;
      case 'guide':
        filtered = filtered.filter(item => 
          item.title.toLowerCase().includes('guide') ||
          item.title.toLowerCase().includes('how to') ||
          item.tags.some((tag: string) => tag.toLowerCase().includes('guide'))
        );
        break;
      case 'news':
        filtered = filtered.filter(item => 
          item.category === 'news' ||
          item.tags.some((tag: string) => tag.toLowerCase().includes('news'))
        );
        break;
    }
  }

  return filtered;
}

function generateFacets(results: ScrapedContent[]) {
  const categories: Record<string, number> = {};
  const universities: Record<string, number> = {};
  const sources: Record<string, number> = {};
  const dateRanges: Record<string, number> = { today: 0, week: 0, month: 0, year: 0 };

  const now = new Date();
  
  results.forEach(item => {
    // Categories
    categories[item.category] = (categories[item.category] || 0) + 1;
    
    // Universities (extract from content)
    const universityMatches = extractUniversities(item.title + ' ' + item.description);
    universityMatches.forEach(uni => {
      universities[uni] = (universities[uni] || 0) + 1;
    });
    
    // Sources
    sources[item.source] = (sources[item.source] || 0) + 1;
    
    // Date ranges
    const publishedDate = new Date(item.publishedAt);
    const diffTime = now.getTime() - publishedDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays < 1) dateRanges.today++;
    if (diffDays < 7) dateRanges.week++;
    if (diffDays < 30) dateRanges.month++;
    if (diffDays < 365) dateRanges.year++;
  });

  return {
    categories: Object.entries(categories)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    universities: Object.entries(universities)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    sources: Object.entries(sources)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    dateRanges: Object.entries(dateRanges)
      .map(([range, count]) => ({ range, count }))
      .filter(({ count }) => count > 0)
  };
}

function generateSuggestions(query: string, results: ScrapedContent[]): string[] {
  if (!query || query.length < 2) {
    return [
      'Trinity College Dublin',
      'UCD admission',
      'Irish visa requirements',
      'Dublin universities',
      'Cork university courses',
      'Ireland education news'
    ];
  }

  // Extract common terms from search results
  const terms: Record<string, number> = {};
  
  results.slice(0, 50).forEach(item => {
    const text = (item.title + ' ' + item.description).toLowerCase();
    const words = text.match(/\b\w{3,}\b/g) || [];
    
    words.forEach(word => {
      if (word !== query.toLowerCase() && word.length > 3) {
        terms[word] = (terms[word] || 0) + 1;
      }
    });
  });

  return Object.entries(terms)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([term]) => term)
    .filter(term => term.toLowerCase().includes(query.toLowerCase()));
}

function getUniversityKeywords(university: string): string[] {
  const universityMap: Record<string, string[]> = {
    'trinity': ['trinity college dublin', 'tcd', 'trinity college', 'trinity dublin'],
    'ucd': ['university college dublin', 'ucd', 'belfield'],
    'dcu': ['dublin city university', 'dcu', 'glasnevin'],
    'cork': ['university college cork', 'ucc', 'cork university'],
    'galway': ['nui galway', 'university of galway', 'galway university'],
    'maynooth': ['maynooth university', 'nui maynooth'],
    'limerick': ['university of limerick', 'ul limerick']
  };
  
  return universityMap[university.toLowerCase()] || [university];
}

function extractUniversities(text: string): string[] {
  const universities = [
    'Trinity College Dublin',
    'University College Dublin',
    'Dublin City University',
    'University College Cork',
    'NUI Galway',
    'Maynooth University',
    'University of Limerick'
  ];
  
  const lowerText = text.toLowerCase();
  return universities.filter(uni => 
    lowerText.includes(uni.toLowerCase()) ||
    lowerText.includes(uni.split(' ')[0].toLowerCase())
  );
}
