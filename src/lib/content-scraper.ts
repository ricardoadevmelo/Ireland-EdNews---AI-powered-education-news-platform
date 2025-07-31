import * as cheerio from 'cheerio';
import axios from 'axios';

export interface ScrapedContent {
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

export interface ContentSource {
  name: string;
  baseUrl: string;
  selectors: {
    title: string;
    description: string;
    content: string;
    image?: string;
    publishedAt?: string;
  };
  category: string;
}

// Irish Education Content Sources
export const CONTENT_SOURCES: ContentSource[] = [
  {
    name: 'Trinity College Dublin News',
    baseUrl: 'https://www.tcd.ie/news/',
    selectors: {
      title: 'h1.page-title, h2.entry-title',
      description: '.lead, .excerpt, p:first-of-type',
      content: '.content, .entry-content, .post-content',
      image: '.featured-image img, .post-image img',
      publishedAt: '.date, .published, time'
    },
    category: 'trinity-college'
  },
  {
    name: 'UCD News',
    baseUrl: 'https://www.ucd.ie/newsandopinion/',
    selectors: {
      title: 'h1, .news-title',
      description: '.news-excerpt, .summary',
      content: '.news-content, .article-content',
      image: '.news-image img, .featured-img',
      publishedAt: '.news-date, .date'
    },
    category: 'ucd'
  },
  {
    name: 'Higher Education Authority Ireland',
    baseUrl: 'https://hea.ie/policy/he-reform/',
    selectors: {
      title: 'h1.entry-title, h1',
      description: '.entry-summary, .excerpt',
      content: '.entry-content, .post-content',
      image: '.wp-post-image, .featured-image img',
      publishedAt: '.entry-date, .date'
    },
    category: 'policy'
  },
  {
    name: 'Irish Universities Association',
    baseUrl: 'https://www.iua.ie/news/',
    selectors: {
      title: 'h1, .news-title',
      description: '.news-summary, .excerpt',
      content: '.news-body, .content',
      image: '.news-image img',
      publishedAt: '.news-date'
    },
    category: 'universities'
  },
  {
    name: 'Department of Education Ireland',
    baseUrl: 'https://www.gov.ie/en/organisation/department-of-education/',
    selectors: {
      title: 'h1.page-title',
      description: '.page-summary, .lead',
      content: '.page-content, .main-content',
      image: '.hero-image img, .page-image img',
      publishedAt: '.publication-date, .date'
    },
    category: 'government'
  }
];

export class ContentScraper {
  private readonly timeout = 10000;
  private readonly maxRetries = 3;

  async scrapeContent(source: ContentSource, urls: string[]): Promise<ScrapedContent[]> {
    const results: ScrapedContent[] = [];

    for (const url of urls) {
      try {
        const content = await this.scrapeUrl(url, source);
        if (content) {
          results.push(content);
        }
      } catch (error) {
        console.error(`Error scraping ${url}:`, error);
      }
    }

    return results;
  }

  private async scrapeUrl(url: string, source: ContentSource): Promise<ScrapedContent | null> {
    try {
      const response = await axios.get(url, {
        timeout: this.timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      const $ = cheerio.load(response.data);
      
      const title = this.extractText($, source.selectors.title);
      const description = this.extractText($, source.selectors.description);
      const content = this.extractText($, source.selectors.content);
      const image = this.extractAttribute($, source.selectors.image, 'src');
      const publishedAt = this.extractText($, source.selectors.publishedAt) || new Date().toISOString();

      if (!title || !content) {
        return null;
      }

      // Calculate relevance score based on Irish education keywords
      const relevanceScore = this.calculateRelevanceScore(title + ' ' + description + ' ' + content);

      // Extract tags from content
      const tags = this.extractTags(title + ' ' + description + ' ' + content);

      return {
        title: title.slice(0, 200),
        description: description.slice(0, 500),
        content: content.slice(0, 2000),
        url,
        image: image ? this.resolveImageUrl(image, url) : undefined,
        publishedAt: this.parseDate(publishedAt),
        source: source.name,
        category: source.category,
        tags,
        relevanceScore
      };
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
      return null;
    }
  }

  private extractText($: cheerio.Root, selector?: string): string {
    if (!selector) return '';
    
    const element = $(selector).first();
    return element.text().trim().replace(/\s+/g, ' ');
  }

  private extractAttribute($: cheerio.Root, selector?: string, attribute?: string): string {
    if (!selector || !attribute) return '';
    
    const element = $(selector).first();
    return element.attr(attribute) || '';
  }

  private resolveImageUrl(imageUrl: string, baseUrl: string): string {
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    const base = new URL(baseUrl);
    if (imageUrl.startsWith('/')) {
      return `${base.protocol}//${base.host}${imageUrl}`;
    }
    
    return `${base.protocol}//${base.host}/${imageUrl}`;
  }

  private parseDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  }

  private calculateRelevanceScore(text: string): number {
    const keywords = [
      'trinity college', 'ucd', 'dublin', 'cork university', 'ireland',
      'irish', 'education', 'university', 'college', 'student',
      'academic', 'research', 'higher education', 'dublin city university',
      'national university', 'galway', 'maynooth', 'limerick'
    ];

    const lowerText = text.toLowerCase();
    let score = 0;

    keywords.forEach(keyword => {
      const matches = (lowerText.match(new RegExp(keyword, 'g')) || []).length;
      score += matches * (keyword.includes(' ') ? 2 : 1);
    });

    return Math.min(score / 10, 1); // Normalize to 0-1
  }

  private extractTags(text: string): string[] {
    const keywords = [
      'Trinity College Dublin', 'UCD', 'DCU', 'Cork University',
      'NUI Galway', 'Maynooth University', 'University of Limerick',
      'Higher Education', 'Research', 'Academic Programs',
      'International Students', 'Irish Education', 'University Rankings',
      'Student Life', 'Campus News', 'Education Policy'
    ];

    const lowerText = text.toLowerCase();
    const foundTags: string[] = [];

    keywords.forEach(keyword => {
      if (lowerText.includes(keyword.toLowerCase())) {
        foundTags.push(keyword);
      }
    });

    return foundTags.slice(0, 5); // Limit to 5 tags
  }
}

// Content Discovery - Find URLs to scrape
export class ContentDiscovery {
  async discoverUrls(source: ContentSource): Promise<string[]> {
    try {
      const response = await axios.get(source.baseUrl, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      const urls: string[] = [];

      // Common selectors for article links
      const linkSelectors = [
        'a[href*="/news/"]',
        'a[href*="/article/"]',
        'a[href*="/post/"]',
        '.news-item a',
        '.article-link',
        '.post-title a',
        'h2 a',
        'h3 a'
      ];

      linkSelectors.forEach(selector => {
        $(selector).each((_index: number, element: cheerio.Element) => {
          const href = $(element).attr('href');
          if (href) {
            const fullUrl = this.resolveUrl(href, source.baseUrl);
            if (fullUrl && !urls.includes(fullUrl)) {
              urls.push(fullUrl);
            }
          }
        });
      });

      return urls.slice(0, 20); // Limit to 20 URLs per source
    } catch (error) {
      console.error(`Failed to discover URLs for ${source.name}:`, error);
      return [];
    }
  }

  private resolveUrl(href: string, baseUrl: string): string {
    if (href.startsWith('http')) {
      return href;
    }
    
    const base = new URL(baseUrl);
    if (href.startsWith('/')) {
      return `${base.protocol}//${base.host}${href}`;
    }
    
    return `${base.protocol}//${base.host}/${href}`;
  }
}
