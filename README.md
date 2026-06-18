# GGA Curator - Amazon Affiliate Marketing Platform

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-FF6B6B)

A production-ready Amazon Affiliate Marketing website built with **Next.js 14+**, **Appwrite Cloud** backend, and **Tailwind CSS** styling. Features a public-facing product curator and full-featured admin dashboard.

## Features

✨ **Public Site**
- Homepage with hero section and featured products
- Product catalog with search and pagination
- Category browsing with product filtering
- Individual product detail pages
- Responsive mobile design

🔐 **Admin Dashboard**
- Secure login with Appwrite authentication
- Product management (CRUD operations)
- Category management
- Site settings configuration
- Role-based access control

⚙️ **Technical Stack**
- **Frontend**: Next.js 16+, React 18, TypeScript (strict mode)
- **Backend**: Appwrite Cloud (database, auth, storage)
- **Styling**: Tailwind CSS 4 with custom design system
- **UI Components**: Reusable component library (10+ components)
- **API**: RESTful API routes with server actions
- **Deployment**: Optimized for Vercel

📈 **SEO & Performance**
- Dynamic XML sitemap generation
- Open Graph and Twitter Card meta tags
- Proper robots.txt with crawler directives
- Image optimization ready
- Server-side rendering (SSR) and static generation (SSG)
- Middleware-based route protection

---

## Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Appwrite Cloud account ([https://cloud.appwrite.io](https://cloud.appwrite.io))
- Optional: Amazon Associate account for affiliate tag

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd affiliate-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Appwrite backend**
   ```bash
   npm run setup:appwrite
   ```
   This script will:
   - Create database and collections
   - Set up storage bucket
   - Seed default categories and settings
   - Populate `.env.local` with IDs

4. **Configure environment variables**
   
   Update `.env.local` with your settings:
   ```env
   # Appwrite (auto-populated by setup script)
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
   APPWRITE_API_KEY=your_api_key
   APPWRITE_DATABASE_ID=affiliate_db
   APPWRITE_PRODUCTS_COLLECTION_ID=your_id
   APPWRITE_CATEGORIES_COLLECTION_ID=your_id
   APPWRITE_SETTINGS_COLLECTION_ID=your_id
   APPWRITE_BUCKET_ID=product_images

   # Admin credentials
   ADMIN_EMAIL=admin@gga.com
   ADMIN_PASSWORD=Password@123

   # Optional: Amazon integration
   RAINFOREST_API_KEY=your_rainforest_key
   NEXT_PUBLIC_SITE_URL=https://ggacurator.com

   # Optional: Amazon affiliate tag
   AMAZON_AFFILIATE_TAG=ggacurator-20
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000)

6. **Access admin dashboard**
   - Navigate to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - Use provided demo credentials
   - Create admin user via Appwrite dashboard if needed

---

## Project Structure

```
affiliate-site/
├── app/                    # Next.js App Router
│   ├── (public pages)
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Reusable UI components (10+ components)
│   ├── Navbar.tsx         # Navigation
│   ├── Footer.tsx         # Footer
│   ├── ProductCard.tsx    # Product display
│   ├── ProductForm.tsx    # Product editor
│   └── CategoryForm.tsx   # Category editor
├── lib/
│   ├── types.ts           # TypeScript interfaces
│   ├── utils.ts           # Utility functions
│   ├── appwrite.ts        # Browser Appwrite client
│   ├── appwrite-server.ts # Server Appwrite client
│   ├── auth.ts            # Authentication functions
│   ├── products.ts        # Product CRUD operations
│   ├── categories.ts      # Category management
│   ├── settings.ts        # Settings management
│   └── amazon.ts          # Amazon URL parsing
├── mcp/
│   └── appwrite-setup.mjs # Database setup script
├── public/
│   └── robots.txt         # SEO crawler directives
├── middleware.ts          # Route protection middleware
├── tailwind.config.ts     # Design tokens & styling
├── tsconfig.json          # TypeScript strict mode
└── package.json           # Dependencies & scripts
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000

# Production
npm run build            # Build for production
npm start                # Start production server

# Database
npm run setup:appwrite   # Initialize Appwrite backend
```

---

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Documentation

- Full architecture guide: See project implementation
- Database schema: Collections for products, categories, settings
- API documentation: `/api/amazon/fetch`, `/api/health`
- Component API: 10+ reusable UI components in `components/ui/`

---

## Support

For issues, questions, or suggestions:
- Check existing issues
- Review documentation
- Contact: support@ggacurator.com

---

## License

Proprietary - Goods Galaxy Affiliated

---

**v1.0.0** - Complete Amazon Affiliate Marketing Platform
