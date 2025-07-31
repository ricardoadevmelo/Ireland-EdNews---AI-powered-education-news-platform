# Ireland EdNews 🇮🇪

**Your premier source for education and online learning news in Ireland**

Ireland EdNews is an automated content platform that leverages AI to curate, summarize, and publish education-focused news articles. The system automatically fetches news from multiple sources, processes them through AI summarization, and publishes them as structured content on the web.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-13.5.6-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.4-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3.1-blue)

## 🚀 Features

### 📰 **Automated Content Pipeline**
- **Daily content generation** via GitHub Actions
- **AI-powered summarization** using Google Gemini 1.5 Flash
- **10+ education categories** covering online learning, EdTech, and more
- **Smart filtering** for educational content relevance

### 🎨 **Modern Web Interface**
- **Responsive design** with Tailwind CSS
- **Dynamic routing** for categories and articles
- **SEO-optimized** pages with proper metadata
- **Image optimization** with Next.js Image component

### 🤖 **AI Integration**
- **Gemini AI** for content summarization
- **British English** tone and style
- **Automatic tag generation** for articles
- **150-word summaries** with optional subtitles

### 📊 **Content Management**
- **MDX format** for rich content storage
- **Structured front-matter** with complete metadata
- **Git-based versioning** for all content
- **API endpoints** for content access

## 📁 Project Structure

```
ireland-ednews/
├── 📂 src/
│   ├── 📂 app/                    # Next.js App Router
│   │   ├── 📂 api/               # API endpoints
│   │   │   ├── content/          # Content API
│   │   │   └── news/             # NewsAPI integration
│   │   ├── 📂 article/           # Article pages
│   │   ├── 📂 category/          # Category pages
│   │   └── 📂 components/        # React components
│   └── 📂 content/               # Generated MDX content
│       ├── 📂 teaching-technologies/
│       ├── 📂 k12-education/
│       ├── 📂 platforms-tools/
│       └── 📂 trends-innovations/
├── 📂 scripts/                   # Automation scripts
│   ├── content-pipeline.js       # Main content generation
│   └── health-check.js          # System monitoring
├── 📂 .github/workflows/         # GitHub Actions
└── 📄 vercel.json               # Deployment config
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 1. Clone Repository
```bash
git clone https://github.com/your-username/ireland-ednews.git
cd ireland-ednews
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env.local` file:
```env
# NewsAPI Key (get from https://newsapi.org)
NEWS_API_KEY=your_newsapi_key_here

# Google Gemini API Key (get from https://makersuite.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Unsplash for images
UNSPLASH_ACCESS_KEY=your_unsplash_key_here

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 4. Generate Initial Content
```bash
npm run content:generate
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see your site!

## 📚 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run content:generate` | Generate new content |
| `npm run health:check` | Run system health check |
| `npm run deploy` | Build and health check |

## 🎯 Content Categories

The system focuses on **10 education categories**:

1. **Platforms & Learning Tools** - LMS, educational software
2. **Courses & Certifications** - Online courses, certification programs
3. **Trends & Innovations** - EdTech trends, educational innovations
4. **International Students Support** - Support for international learners
5. **Professional Development** - Lifelong learning, skill development
6. **K-12 Online Education** - Primary and secondary education
7. **Teaching Technologies** - Tools for educators
8. **Sector News & Updates** - Education industry news
9. **Online Learning Psychology** - Learning science, educational psychology
10. **Ireland Education** - Ireland-specific educational news

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
npm run build
npm run start
```

## 🔄 Automation Pipeline

### Daily Content Generation
The GitHub Action (`daily-content.yml`) runs at **7:00 AM UTC** daily:

1. **Fetch** latest news from NewsAPI
2. **Filter** for education-related content
3. **Process** through Gemini AI for summarization
4. **Generate** MDX files with structured metadata
5. **Commit** new content to repository
6. **Deploy** automatically via Vercel

### Monitoring
- **Health checks** ensure system reliability
- **Slack notifications** for success/failure alerts
- **Content validation** verifies daily generation

## 🛠️ API Reference

### Content API
```bash
# Get all articles (with optional limit)
GET /api/content?limit=10

# Get articles by category
GET /api/content?category=teaching-technologies

# Get specific article
GET /api/content?category=teaching-technologies&slug=article-slug
```

### Legacy News API
```bash
# Get news with category filter
GET /api/news?category=education
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Site**: [ireland-ednews.vercel.app](https://ireland-ednews.vercel.app)
- **GitHub**: [github.com/your-username/ireland-ednews](https://github.com/your-username/ireland-ednews)
- **Issues**: [Report bugs or request features](https://github.com/your-username/ireland-ednews/issues)

## 📧 Contact

For questions or support, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).

---

**Built with ❤️ for the Irish education community**
