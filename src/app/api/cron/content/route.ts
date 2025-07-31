import { NextResponse } from 'next/server';
import { AutomatedContentAggregator } from '@/lib/content-aggregator';

// This endpoint will be called by external cron services (like Vercel Cron)
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  // Verify authorization for security
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('🕐 Starting scheduled content aggregation...');
    
    const aggregator = new AutomatedContentAggregator();
    const content = await aggregator.runAutomatedUpdate();
    
    // Log aggregation results
    const stats = await aggregator.getContentStats();
    
    console.log(`✅ Scheduled aggregation complete:`, {
      newArticles: content.length,
      totalArticles: stats.totalArticles,
      averageRelevance: stats.averageRelevanceScore,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: true,
      message: 'Content aggregation completed successfully',
      results: {
        newArticles: content.length,
        totalArticles: stats.totalArticles,
        averageRelevance: Math.round(stats.averageRelevanceScore * 100),
        sources: Object.keys(stats.sourceBreakdown).length,
        categories: Object.keys(stats.categoryBreakdown).length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Scheduled aggregation failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Content aggregation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Manual trigger endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;
    
    const aggregator = new AutomatedContentAggregator();
    
    switch (action) {
      case 'full-update':
        console.log('🔄 Manual full content update triggered...');
        const content = await aggregator.runAutomatedUpdate();
        const stats = await aggregator.getContentStats();
        
        return NextResponse.json({
          success: true,
          message: 'Full content update completed',
          results: {
            newArticles: content.length,
            totalArticles: stats.totalArticles,
            averageRelevance: Math.round(stats.averageRelevanceScore * 100),
            timestamp: new Date().toISOString()
          }
        });
      
      case 'premium-update':
        console.log('💎 Premium content update triggered...');
        const premiumContent = await aggregator.generatePremiumContent();
        
        return NextResponse.json({
          success: true,
          message: 'Premium content updated',
          results: {
            premiumArticles: premiumContent.length,
            timestamp: new Date().toISOString()
          }
        });
      
      case 'university-focus':
        const { university } = body;
        if (!university) {
          return NextResponse.json({ error: 'University parameter required' }, { status: 400 });
        }
        
        console.log(`🏛️ University-focused update for ${university}...`);
        const universityContent = await aggregator.getUniversityContent(university);
        
        return NextResponse.json({
          success: true,
          message: `University content updated for ${university}`,
          results: {
            universityArticles: universityContent.length,
            university,
            timestamp: new Date().toISOString()
          }
        });
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('❌ Manual aggregation failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Manual aggregation failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
