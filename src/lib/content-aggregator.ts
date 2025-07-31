import { ContentScraper, ContentDiscovery, CONTENT_SOURCES, ScrapedContent } from './content-scraper';

interface ContentUpdate {
  id: string;
  content: ScrapedContent;
  timestamp: string;
  processed: boolean;
}

interface ContentStats {
  totalArticles: number;
  sourceBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  lastUpdate: string;
  averageRelevanceScore: number;
}

export class AutomatedContentAggregator {
  private scraper: ContentScraper;
  private discovery: ContentDiscovery;
  private contentCache: Map<string, ScrapedContent[]> = new Map();
  private updateQueue: ContentUpdate[] = [];
  
  constructor() {
    this.scraper = new ContentScraper();
    this.discovery = new ContentDiscovery();
  }

  // Main automation method - runs every hour
  async runAutomatedUpdate(): Promise<ScrapedContent[]> {
    console.log('🚀 Starting automated content aggregation...');
    const allContent: ScrapedContent[] = [];

    for (const source of CONTENT_SOURCES) {
      try {
        console.log(`📰 Processing ${source.name}...`);
        
        // Discover new URLs
        const urls = await this.discovery.discoverUrls(source);
        console.log(`🔍 Found ${urls.length} URLs for ${source.name}`);
        
        // Scrape content
        const content = await this.scraper.scrapeContent(source, urls);
        console.log(`📄 Scraped ${content.length} articles from ${source.name}`);
        
        // Filter high-quality content
        const qualityContent = this.filterQualityContent(content);
        allContent.push(...qualityContent);
        
        // Cache content by source
        this.contentCache.set(source.name, qualityContent);
        
        // Add to update queue
        qualityContent.forEach(item => {
          this.updateQueue.push({
            id: this.generateContentId(item),
            content: item,
            timestamp: new Date().toISOString(),
            processed: false
          });
        });
        
      } catch (error) {
        console.error(`❌ Error processing ${source.name}:`, error);
      }
    }

    // Sort by relevance and recency
    const sortedContent = this.sortContentByQuality(allContent);
    
    console.log(`✅ Aggregation complete: ${sortedContent.length} high-quality articles`);
    return sortedContent.slice(0, 50); // Return top 50 articles
  }

  // Get content for specific categories
  async getContentByCategory(category: string): Promise<ScrapedContent[]> {
    const allContent = await this.getAllCachedContent();
    return allContent.filter(content => 
      content.category === category || 
      content.tags.some(tag => tag.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // Search content by keywords
  async searchContent(query: string): Promise<ScrapedContent[]> {
    const allContent = await this.getAllCachedContent();
    const lowerQuery = query.toLowerCase();
    
    return allContent.filter(content => 
      content.title.toLowerCase().includes(lowerQuery) ||
      content.description.toLowerCase().includes(lowerQuery) ||
      content.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    ).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Get trending topics based on content frequency
  async getTrendingTopics(): Promise<Array<{topic: string, count: number, trend: 'up' | 'down' | 'stable'}>> {
    const allContent = await this.getAllCachedContent();
    const topicCounts: Record<string, number> = {};
    
    allContent.forEach(content => {
      content.tags.forEach(tag => {
        topicCounts[tag] = (topicCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(topicCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([topic, count]) => ({
        topic,
        count,
        trend: 'up' as const // Simplified - could implement trend analysis
      }));
  }

  // Get content statistics
  async getContentStats(): Promise<ContentStats> {
    const allContent = await this.getAllCachedContent();
    
    const sourceBreakdown: Record<string, number> = {};
    const categoryBreakdown: Record<string, number> = {};
    let totalRelevanceScore = 0;
    
    allContent.forEach(content => {
      sourceBreakdown[content.source] = (sourceBreakdown[content.source] || 0) + 1;
      categoryBreakdown[content.category] = (categoryBreakdown[content.category] || 0) + 1;
      totalRelevanceScore += content.relevanceScore;
    });
    
    return {
      totalArticles: allContent.length,
      sourceBreakdown,
      categoryBreakdown,
      lastUpdate: new Date().toISOString(),
      averageRelevanceScore: allContent.length > 0 ? totalRelevanceScore / allContent.length : 0
    };
  }

  // Premium content generation
  async generatePremiumContent(): Promise<ScrapedContent[]> {
    const allContent = await this.getAllCachedContent();
    
    // Filter for premium content (high relevance, recent, from official sources)
    return allContent.filter(content => 
      content.relevanceScore > 0.7 &&
      this.isRecent(content.publishedAt, 7) && // Last 7 days
      this.isOfficialSource(content.source)
    ).slice(0, 20);
  }

  // University-specific content
  async getUniversityContent(university: string): Promise<ScrapedContent[]> {
    const allContent = await this.getAllCachedContent();
    const universityKeywords = this.getUniversityKeywords(university);
    
    return allContent.filter(content => 
      universityKeywords.some(keyword => 
        content.title.toLowerCase().includes(keyword) ||
        content.description.toLowerCase().includes(keyword) ||
        content.tags.some(tag => tag.toLowerCase().includes(keyword))
      )
    ).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  // Visa and immigration content
  async getVisaContent(): Promise<ScrapedContent[]> {
    const visaKeywords = ['visa', 'immigration', 'international student', 'study permit', 'student visa', 'ireland visa'];
    return this.searchContentByKeywords(visaKeywords);
  }

  // Application guides content
  async getApplicationGuides(): Promise<ScrapedContent[]> {
    const guideKeywords = ['application', 'how to apply', 'admission', 'requirements', 'application process'];
    return this.searchContentByKeywords(guideKeywords);
  }

  // Private helper methods
  private async getAllCachedContent(): Promise<ScrapedContent[]> {
    const allContent: ScrapedContent[] = [];
    
    for (const [, content] of this.contentCache) {
      allContent.push(...content);
    }
    
    return allContent;
  }

  private filterQualityContent(content: ScrapedContent[]): ScrapedContent[] {
    return content.filter(item => 
      item.relevanceScore > 0.3 &&
      item.title.length > 20 &&
      item.description.length > 50 &&
      item.content.length > 100
    );
  }

  private sortContentByQuality(content: ScrapedContent[]): ScrapedContent[] {
    return content.sort((a, b) => {
      // Weighted scoring: relevance (40%) + recency (30%) + content length (30%)
      const scoreA = (a.relevanceScore * 0.4) + 
                    (this.getRecencyScore(a.publishedAt) * 0.3) +
                    (this.getContentLengthScore(a.content) * 0.3);
      
      const scoreB = (b.relevanceScore * 0.4) + 
                    (this.getRecencyScore(b.publishedAt) * 0.3) +
                    (this.getContentLengthScore(b.content) * 0.3);
      
      return scoreB - scoreA;
    });
  }

  private getRecencyScore(publishedAt: string): number {
    const now = new Date();
    const published = new Date(publishedAt);
    const hoursAgo = (now.getTime() - published.getTime()) / (1000 * 60 * 60);
    
    // Score decreases over time: 1.0 for 0-24h, 0.5 for 24-48h, etc.
    if (hoursAgo <= 24) return 1.0;
    if (hoursAgo <= 48) return 0.8;
    if (hoursAgo <= 72) return 0.6;
    if (hoursAgo <= 168) return 0.4; // 1 week
    return 0.2;
  }

  private getContentLengthScore(content: string): number {
    const length = content.length;
    if (length > 1500) return 1.0;
    if (length > 1000) return 0.8;
    if (length > 500) return 0.6;
    if (length > 200) return 0.4;
    return 0.2;
  }

  private generateContentId(content: ScrapedContent): string {
    const baseString = content.url + content.title + content.publishedAt;
    return Buffer.from(baseString).toString('base64').slice(0, 16);
  }

  private isRecent(publishedAt: string, days: number): boolean {
    const now = new Date();
    const published = new Date(publishedAt);
    const diffTime = now.getTime() - published.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    return diffDays <= days;
  }

  private isOfficialSource(sourceName: string): boolean {
    const officialSources = [
      'Trinity College Dublin',
      'UCD News',
      'Higher Education Authority Ireland',
      'Department of Education Ireland'
    ];
    
    return officialSources.some(official => 
      sourceName.toLowerCase().includes(official.toLowerCase())
    );
  }

  private getUniversityKeywords(university: string): string[] {
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

  private async searchContentByKeywords(keywords: string[]): Promise<ScrapedContent[]> {
    const allContent = await this.getAllCachedContent();
    
    return allContent.filter(content => 
      keywords.some(keyword => 
        content.title.toLowerCase().includes(keyword.toLowerCase()) ||
        content.description.toLowerCase().includes(keyword.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      )
    ).sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}
