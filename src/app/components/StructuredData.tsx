import Script from 'next/script'

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Ireland EdNews",
    "url": "https://ireland-ednews-ricardo.vercel.app",
    "logo": "https://ireland-ednews-ricardo.vercel.app/logo.png",
    "description": "Portal de notícias educacionais da Irlanda com tecnologia de inteligência artificial",
    "sameAs": [
      "https://ireland-ednews-ricardo.vercel.app/api/rss"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+353-1-XXX-XXXX",
      "contactType": "customer service",
      "email": "contato@ireland-ednews.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IE",
      "addressLocality": "Dublin"
    }
  }

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Ireland EdNews",
    "url": "https://ireland-ednews-ricardo.vercel.app",
    "description": "Portal de notícias educacionais da Irlanda",
    "publisher": {
      "@type": "Organization",
      "name": "Ireland EdNews"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://ireland-ednews-ricardo.vercel.app/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  const newsMediaSchema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "name": "Ireland EdNews",
    "url": "https://ireland-ednews-ricardo.vercel.app",
    "logo": "https://ireland-ednews-ricardo.vercel.app/logo.png",
    "description": "Organização de mídia focada em notícias educacionais da Irlanda",
    "foundingDate": "2025",
    "founders": [
      {
        "@type": "Person",
        "name": "Ireland EdNews Team"
      }
    ],
    "diversityPolicy": "https://ireland-ednews-ricardo.vercel.app/diversity",
    "ethicsPolicy": "https://ireland-ednews-ricardo.vercel.app/ethics",
    "masthead": "https://ireland-ednews-ricardo.vercel.app/about",
    "missionCoveragePrioritiesPolicy": "https://ireland-ednews-ricardo.vercel.app/mission",
    "verificationFactCheckingPolicy": "https://ireland-ednews-ricardo.vercel.app/fact-checking"
  }

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="news-media-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsMediaSchema),
        }}
      />
    </>
  )
}
