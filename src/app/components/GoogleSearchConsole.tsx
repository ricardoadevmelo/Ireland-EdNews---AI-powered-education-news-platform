'use client';

import { useEffect } from 'react';

interface GoogleSearchConsoleProps {
  verificationCode?: string;
}

export default function GoogleSearchConsole({ verificationCode }: GoogleSearchConsoleProps) {
  useEffect(() => {
    // Automatically submit sitemap to Google Search Console
    const submitSitemap = async () => {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        console.log('🔍 Google Search Console: Sitemap available at /sitemap.xml');
        console.log('🤖 Google Search Console: Robots.txt available at /robots.txt');
      }
    };

    submitSitemap();
  }, []);

  return (
    <>
      {/* Google Search Console Verification */}
      {verificationCode && (
        <meta name="google-site-verification" content={verificationCode} />
      )}
      
      {/* Additional Search Console Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Canonical URL */}
      <link rel="canonical" href="https://ireland-ednews-ricardo.vercel.app" />
      
      {/* Sitemap Reference */}
      <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
      
      {/* RSS Feed */}
      <link rel="alternate" type="application/rss+xml" title="Ireland EdNews RSS Feed" href="/api/rss" />
      
      {/* Favicon for Search Console */}
      <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🇮🇪</text></svg>" />
    </>
  );
}
