import { Metadata } from 'next'

export function generateSEOMetadata(): Metadata {
  return {
    title: "Ireland EdNews - Educação e Aprendizagem Online na Irlanda",
    description: "Portal de notícias educacionais da Irlanda com IA. Universidades, cursos, bolsas de estudo e oportunidades educacionais irlandesas.",
    keywords: [
      "educação irlanda",
      "universidades irlandesas", 
      "estudar na irlanda",
      "cursos online irlanda",
      "bolsas estudo irlanda",
      "educação superior irlanda",
      "trinity college dublin",
      "ucd dublin",
      "cork university",
      "galway university",
      "dublin city university"
    ].join(", "),
    authors: [{ name: "Ireland EdNews Team", url: "https://ireland-ednews-ricardo.vercel.app" }],
    creator: "Ireland EdNews",
    publisher: "Ireland EdNews",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: "https://ireland-ednews-ricardo.vercel.app",
      siteName: "Ireland EdNews",
      title: "Ireland EdNews - Educação na Irlanda",
      description: "Sua fonte confiável para notícias educacionais da Irlanda com tecnologia de IA",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Ireland EdNews - Educação na Irlanda",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Ireland EdNews - Educação na Irlanda",
      description: "Notícias educacionais da Irlanda com IA",
      creator: "@ireland_ednews",
      images: ["/og-image.jpg"],
    },
    alternates: {
      canonical: "https://ireland-ednews-ricardo.vercel.app",
      types: {
        'application/rss+xml': [
          { url: '/api/rss', title: 'Ireland EdNews RSS Feed' }
        ]
      }
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "google-site-verification-code",
      yandex: "yandex-verification-code",
      yahoo: "yahoo-verification-code",
    },
    category: "education",
    classification: "Educational News Platform",
  }
}
