import React, { useState } from 'react';
import Link from 'next/link';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  category: 'education' | 'technology' | 'research' | 'administration';
  salary: {
    min: number;
    max: number;
    currency: 'EUR';
    period: 'year' | 'month' | 'hour';
  };
  description: string;
  requirements: string[];
  benefits: string[];
  posted: string; // ISO date string
  expires: string; // ISO date string
  remote: boolean;
  sponsored: boolean;
  logoUrl?: string;
  applyUrl: string;
}

const sampleJobs: JobListing[] = [
  {
    id: 'trinity-lecturer-cs',
    title: 'Senior Lecturer in Computer Science',
    company: 'Trinity College Dublin',
    location: 'Dublin, Ireland',
    type: 'full-time',
    category: 'education',
    salary: { min: 65000, max: 85000, currency: 'EUR', period: 'year' },
    description: 'Join our world-renowned Computer Science department as a Senior Lecturer. Lead cutting-edge research and teach the next generation of tech leaders.',
    requirements: [
      'PhD in Computer Science or related field',
      '5+ years teaching experience',
      'Strong research background',
      'Publications in top-tier journals'
    ],
    benefits: [
      'Competitive salary package',
      'Research sabbatical opportunities',
      'Comprehensive health insurance',
      'Pension scheme'
    ],
    posted: '2025-07-25',
    expires: '2025-08-25',
    remote: false,
    sponsored: true,
    logoUrl: '/images/trinity-logo.png',
    applyUrl: 'https://tcd.ie/careers/lecturer-cs-2025'
  },
  {
    id: 'ucd-research-ai',
    title: 'AI Research Scientist',
    company: 'University College Dublin',
    location: 'Dublin, Ireland',
    type: 'full-time',
    category: 'research',
    salary: { min: 55000, max: 70000, currency: 'EUR', period: 'year' },
    description: 'Exciting opportunity to join our AI research team working on machine learning applications in education.',
    requirements: [
      'PhD in AI/ML or related field',
      'Experience with deep learning frameworks',
      'Published research in AI conferences',
      'Python/R programming skills'
    ],
    benefits: [
      'Research funding available',
      'Conference travel budget',
      'Flexible working hours',
      'Career development support'
    ],
    posted: '2025-07-28',
    expires: '2025-09-01',
    remote: true,
    sponsored: false,
    logoUrl: '/images/ucd-logo.png',
    applyUrl: 'https://ucd.ie/careers/ai-researcher-2025'
  },
  {
    id: 'cork-admin-international',
    title: 'International Student Advisor',
    company: 'University College Cork',
    location: 'Cork, Ireland',
    type: 'full-time',
    category: 'administration',
    salary: { min: 35000, max: 45000, currency: 'EUR', period: 'year' },
    description: 'Support international students throughout their academic journey at UCC. Help with visa, accommodation, and academic guidance.',
    requirements: [
      'Degree in Education or related field',
      'Experience working with international students',
      'Excellent communication skills',
      'Multilingual capabilities preferred'
    ],
    benefits: [
      'Professional development opportunities',
      'Staff discounts on courses',
      'Health and wellness programs',
      '25 days annual leave'
    ],
    posted: '2025-07-30',
    expires: '2025-08-30',
    remote: false,
    sponsored: true,
    logoUrl: '/images/ucc-logo.png',
    applyUrl: 'https://ucc.ie/careers/international-advisor-2025'
  }
];

interface JobCardProps {
  job: JobListing;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const formatSalary = (salary: JobListing['salary']) => {
    const { min, max, period } = salary;
    const periodText = period === 'year' ? '/ano' : period === 'month' ? '/mês' : '/hora';
    return `€${min.toLocaleString()} - €${max.toLocaleString()} ${periodText}`;
  };

  const getTypeColor = (type: JobListing['type']) => {
    const colors = {
      'full-time': 'bg-emerald-100 text-emerald-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-orange-100 text-orange-800',
      'internship': 'bg-purple-100 text-purple-800',
    };
    return colors[type];
  };

  const getCategoryIcon = (category: JobListing['category']) => {
    const icons = {
      education: '🎓',
      technology: '💻',
      research: '🔬',
      administration: '📋',
    };
    return icons[category];
  };

  const daysAgo = Math.floor((Date.now() - new Date(job.posted).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200">
      {job.sponsored && (
        <div className="mb-3">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
            ⭐ Patrocinado
          </span>
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{job.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <span className="font-medium">{job.company}</span>
            <span className="mx-2">•</span>
            <span>{job.location}</span>
            {job.remote && (
              <>
                <span className="mx-2">•</span>
                <span className="text-emerald-600">🏠 Remoto</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2 mb-3">
            <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(job.type)}`}>
              {job.type}
            </span>
            <span className="text-lg">{getCategoryIcon(job.category)}</span>
            <span className="text-sm text-gray-500">{daysAgo} dias atrás</span>
          </div>
          <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-lg font-semibold text-emerald-600 mb-2">
          {formatSalary(job.salary)}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Requisitos principais:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {job.requirements.slice(0, 3).map((req, index) => (
            <li key={index} className="flex items-start">
              <span className="text-emerald-500 mr-2 mt-0.5">•</span>
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Expira em: {new Date(job.expires).toLocaleDateString('pt-BR')}
        </div>
        <a
          href={job.applyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'job_application_click', {
                event_category: 'job_board',
                event_label: job.company,
                value: job.id,
              });
            }
          }}
        >
          Candidatar-se →
        </a>
      </div>
    </div>
  );
};

interface JobBoardProps {
  featured?: boolean;
  limit?: number;
}

const JobBoard: React.FC<JobBoardProps> = ({ featured = false, limit = 6 }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'Todas as Categorias', icon: '📋' },
    { id: 'education', name: 'Educação', icon: '🎓' },
    { id: 'technology', name: 'Tecnologia', icon: '💻' },
    { id: 'research', name: 'Pesquisa', icon: '🔬' },
    { id: 'administration', name: 'Administração', icon: '📋' },
  ];

  const types = [
    { id: 'all', name: 'Todos os Tipos' },
    { id: 'full-time', name: 'Tempo Integral' },
    { id: 'part-time', name: 'Meio Período' },
    { id: 'contract', name: 'Contrato' },
    { id: 'internship', name: 'Estágio' },
  ];

  const filteredJobs = sampleJobs
    .filter(job => selectedCategory === 'all' || job.category === selectedCategory)
    .filter(job => selectedType === 'all' || job.type === selectedType)
    .slice(0, limit);

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            💼 Vagas em Educação na Irlanda
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra oportunidades de carreira nas melhores instituições educacionais irlandesas. 
            De professores a pesquisadores, encontre sua próxima oportunidade.
          </p>
        </div>

        {!featured && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
              </div>
              
              <div className="flex space-x-2">
                {types.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedType === type.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {type.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        <div className="text-center">
          <Link 
            href="/vagas" 
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Ver Todas as Vagas →
          </Link>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
            📢 Publique sua Vaga
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-3">📝</div>
              <h4 className="font-semibold mb-2">Básico</h4>
              <p className="text-2xl font-bold text-emerald-600 mb-2">€99</p>
              <p className="text-gray-600 text-sm">30 dias • 1 vaga</p>
            </div>
            <div className="border-2 border-emerald-500 rounded-lg p-4">
              <div className="text-3xl mb-3">⭐</div>
              <h4 className="font-semibold mb-2">Destaque</h4>
              <p className="text-2xl font-bold text-emerald-600 mb-2">€199</p>
              <p className="text-gray-600 text-sm">60 dias • Posição premium</p>
            </div>
            <div>
              <div className="text-3xl mb-3">🚀</div>
              <h4 className="font-semibold mb-2">Premium</h4>
              <p className="text-2xl font-bold text-emerald-600 mb-2">€299</p>
              <p className="text-gray-600 text-sm">90 dias • Newsletter + Social</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <Link
              href="/publicar-vaga"
              className="bg-emerald-600 text-white px-8 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Publicar Vaga Agora
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JobBoard;
