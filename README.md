# Enterprise LMS + ERP + CRM Platform

A comprehensive educational platform serving learners in Sudan and worldwide with adaptive AI-powered education.

## 🌟 Features

### Core Functionality
- **Learning Management System (LMS)**
  - Course creation and management
  - Module and lesson organization
  - Video content delivery
  - Assessments and quizzes
  - Progress tracking
  - Adaptive learning paths

- **CRM Systems**
  - Student CRM (including orphans and special needs support)
  - Donor CRM and donation tracking
  - Instructor management
  - Employer portal for job postings

- **AI Orchestration**
  - AI-powered tutoring with OpenAI integration
  - Personalized learning recommendations
  - Adaptive content delivery
  - Bilingual AI support (English & Arabic)

- **Certificate System**
  - Secure certificate generation with PDF
  - QR code verification
  - Blockchain-ready architecture
  - Tamper-proof verification hashes

### Special Features
- **Bilingual Support**: Full RTL support for Arabic
- **Accessibility**: Special needs accommodation
- **Offline-First**: PWA capabilities for low-bandwidth areas
- **Analytics**: Comprehensive admin dashboard
- **Security**: JWT authentication, activity logging

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TailwindCSS 4
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **AI**: OpenAI GPT-4o-mini
- **Auth**: JWT-based authentication
- **Charts**: Recharts
- **PDF**: pdf-lib, QRCode

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Generate Prisma client
npx prisma generate

# Run development server
npm run dev
```

## 🗄️ Database Schema

Comprehensive schema including:
- Users (multi-role: Student, Instructor, Donor, Employer, Admin)
- Courses, Modules, Lessons, Assessments
- Enrollments and Progress tracking
- Certificates with verification
- Donations and CRM data
- Activity logs and AI interactions

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course (Instructor/Admin)
- `POST /api/courses/[id]/enroll` - Enroll in course

### AI
- `POST /api/ai/tutor` - AI tutoring assistance

### Certificates
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/verify/[hash]` - Verify certificate

### CRM
- `GET /api/crm/students` - List students (Admin/Instructor)
- `GET /api/crm/donors` - List donors (Admin)
- `POST /api/donations` - Process donation

### Analytics
- `GET /api/analytics/dashboard` - Admin dashboard data

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy to Vercel:
```bash
vercel deploy --prod
```

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Activity logging
- Role-based access control (RBAC)
- API route protection middleware
- Certificate verification system

## 🌍 Accessibility & Inclusion

- RTL support for Arabic
- Special needs student tracking
- Orphan support programs
- Low-bandwidth optimization
- Offline-first PWA

## 📈 Future Enhancements

- Blockchain certificate anchoring
- Advanced anti-cheat mechanisms
- Real-time collaboration
- Video conferencing integration
- Mobile apps (React Native)
- Advanced ML-based recommendations

## 📄 License

Proprietary - All rights reserved

## 🤝 Support

For support in Sudan and worldwide, contact: support@eduplatform.com

---

Built with ❤️ for learners worldwide
