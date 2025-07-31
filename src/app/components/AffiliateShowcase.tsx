import React from 'react';
import Link from 'next/link';
import PlaceholderImage from './PlaceholderImage';

// Extend window interface for gtag
declare global {
  interface Window {
    gtag?: (command: string, action: string, parameters?: Record<string, unknown>) => void;
  }
}

interface AffiliateLink {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  affiliateUrl: string;
  provider: 'amazon' | 'coursera' | 'udemy' | 'university';
  category: 'books' | 'courses' | 'programs';
}

interface AffiliateCardProps {
  affiliate: AffiliateLink;
}

const AffiliateCard: React.FC<AffiliateCardProps> = ({ affiliate }) => {
  const handleClick = () => {
    // Track affiliate click for analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'affiliate_click', {
        event_category: 'affiliate_marketing',
        event_label: affiliate.provider,
        value: affiliate.id,
      });
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  const getProviderBadge = (provider: AffiliateLink['provider']) => {
    const badges: Record<AffiliateLink['provider'], { color: string; text: string }> = {
      amazon: { color: 'bg-orange-500', text: 'Amazon' },
      coursera: { color: 'bg-blue-500', text: 'Coursera' },
      udemy: { color: 'bg-purple-500', text: 'Udemy' },
      university: { color: 'bg-emerald-600', text: 'University' },
    };
    const badge = badges[provider];
    
    return (
      <span className={`inline-block px-2 py-1 rounded text-xs text-white font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative">
        <PlaceholderImage 
          width={300}
          height={200}
          text={affiliate.title}
          className="w-full h-48 rounded-t-lg"
        />
        <div className="absolute top-2 left-2">
          {getProviderBadge(affiliate.provider)}
        </div>
        {affiliate.discount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
            -{affiliate.discount}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {affiliate.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {affiliate.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {renderStars(affiliate.rating)}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            ({affiliate.reviewCount} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-emerald-600">
              €{affiliate.price}
            </span>
            {affiliate.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                €{affiliate.originalPrice}
              </span>
            )}
          </div>
        </div>
        
        <a
          href={affiliate.affiliateUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={handleClick}
          className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-center block"
        >
          Ver Oferta →
        </a>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          * Link afiliado - Apoie o Ireland EdNews
        </p>
      </div>
    </div>
  );
};

// Sample affiliate data - IRISH EDUCATION FOCUSED
const sampleAffiliates: AffiliateLink[] = [
  {
    id: 'irish-education-guide',
    title: 'Complete Guide to Studying in Ireland 2025',
    description: 'Ultimate guide covering Trinity College Dublin, UCD, DCU, and all major Irish universities. Visa process, accommodation, and scholarship opportunities.',
    price: '24.99',
    originalPrice: '34.99',
    discount: '29%',
    rating: 5,
    reviewCount: 89,
    imageUrl: '/images/irish-education-book.jpg',
    affiliateUrl: 'https://amazon.com/dp/studying-ireland-2025?tag=ireland-ednews-20',
    provider: 'amazon',
    category: 'books',
  },
  {
    id: 'trinity-prep-course',
    title: 'Trinity College Dublin Application Masterclass',
    description: 'Expert-led course covering TCD application process, interview preparation, and scholarship strategies. 90% acceptance rate for students.',
    price: '149.99',
    originalPrice: '249.99',
    discount: '40%',
    rating: 5,
    reviewCount: 156,
    imageUrl: '/images/trinity-course.jpg',
    affiliateUrl: 'https://coursera.org/learn/trinity-college-prep?partnerId=ireland-ednews',
    provider: 'coursera',
    category: 'courses',
  },
  {
    id: 'irish-tech-bootcamp',
    title: 'Irish Tech Industry Career Path',
    description: 'Learn from Dublin tech leaders. Covers major employers like Google Dublin, Facebook, Microsoft, and Irish startups. Job placement assistance.',
    price: '89.99',
    originalPrice: '129.99',
    discount: '31%',
    rating: 4,
    reviewCount: 203,
    imageUrl: '/images/irish-tech-course.jpg',
    affiliateUrl: 'https://udemy.com/irish-tech-career?ref=ireland-ednews',
    provider: 'udemy',
    category: 'courses',
  },
  {
    id: 'ucd-masters-program',
    title: 'UCD Masters in Data Science & Analytics',
    description: 'One of Europe\'s top data science programs. Located in Dublin with strong industry connections. Graduate visa opportunities available.',
    price: '15000',
    rating: 5,
    reviewCount: 67,
    imageUrl: '/images/ucd-masters.jpg',
    affiliateUrl: 'https://ucd.ie/courses/masters-data-science?ref=ireland-ednews',
    provider: 'university',
    category: 'programs',
  },
];

interface AffiliateShowcaseProps {
  category?: 'books' | 'courses' | 'programs' | 'all';
  limit?: number;
}

const AffiliateShowcase: React.FC<AffiliateShowcaseProps> = ({ 
  category = 'all', 
  limit = 6 
}) => {
  const filteredAffiliates = category === 'all' 
    ? sampleAffiliates 
    : sampleAffiliates.filter(item => item.category === category);
  
  const displayAffiliates = filteredAffiliates.slice(0, limit);

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            🎓 Recursos Recomendados para Estudar na Irlanda
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Cursos, livros e programas cuidadosamente selecionados para ajudá-lo a ter sucesso 
            nas melhores universidades irlandesas. Trinity College Dublin, UCD, DCU e mais.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {displayAffiliates.map((affiliate) => (
            <AffiliateCard key={affiliate.id} affiliate={affiliate} />
          ))}
        </div>
        
        <div className="text-center">
          <Link 
            href="/recursos" 
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Ver Todos os Recursos →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AffiliateShowcase;
export { AffiliateCard, type AffiliateLink };
