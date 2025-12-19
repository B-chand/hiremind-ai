# 🤖 HireMind AI - Intelligent Recruitment Platform

> **Hackathon Project**: AI-powered recruitment platform that revolutionizes hiring with intelligent candidate screening, automated interviews, and smart matching.

## 🚀 Quick Start

```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🎯 Project Overview

HireMind AI is a comprehensive recruitment platform that leverages artificial intelligence to streamline the hiring process for both recruiters and candidates.

### 🌟 Key Features

**For Recruiters:**
- 📊 **AI-Powered Dashboard** - Real-time analytics and candidate insights
- 🤖 **Automated Screening** - AI evaluates resumes and generates candidate scores
- 💬 **Smart Interviews** - AI-generated questions tailored to each candidate
- 📧 **Intelligent Communication** - Automated, personalized email generation
- 💰 **Salary Intelligence** - Market-based compensation recommendations
- 📈 **Advanced Analytics** - Skills trends, score distributions, performance metrics

**For Candidates:**
- 📝 **Smart Application Process** - AI-powered resume parsing
- 🎯 **Personalized Matching** - Intelligent job recommendations
- 🤖 **AI Interview Practice** - Interactive interview preparation
- 📊 **Real-time Feedback** - Instant scoring and improvement suggestions
- 🔔 **Status Updates** - Automated communication throughout the process

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │  Express Backend │    │   AI Services   │
│                 │    │                 │    │                 │
│ • Dashboard     │◄──►│ • REST API      │◄──►│ • Resume Parser │
│ • Candidate UI  │    │ • Authentication│    │ • Scoring Engine│
│ • Interview UI  │    │ • File Upload   │    │ • Question Gen  │
│ • Analytics     │    │ • Email Service │    │ • Feedback Gen  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  MySQL Database │
                       │                 │
                       │ • Users         │
                       │ • Candidates    │
                       │ • Interviews    │
                       │ • Job Postings  │
                       └─────────────────┘
```

## 📁 Project Structure

```
hiremind-ai/
├── 🎨 Frontend (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecruiterDashboard.tsx    # Main recruiter interface
│   │   │   ├── CandidatePortal.tsx       # Candidate application flow
│   │   │   ├── JobPostings.tsx           # Job listings management
│   │   │   └── Navigation.tsx            # App navigation
│   │   ├── App.tsx                       # Main app component
│   │   └── main.tsx                      # App entry point
│   └── convex/                           # Convex backend integration
│
├── 🔧 Backend (Node.js + Express + Sequelize)
│   ├── models/                           # Database models
│   │   ├── User.js                       # User authentication
│   │   ├── Candidate.js                  # Candidate profiles
│   │   ├── Interview.js                  # Interview sessions
│   │   ├── RecruiterAction.js            # Activity tracking
│   │   └── JobPosting.js                 # Job listings
│   ├── routes/                           # API endpoints
│   │   ├── auth.js                       # Authentication routes
│   │   ├── candidates.js                 # Candidate management
│   │   ├── interviews.js                 # Interview system
│   │   ├── ai.js                         # AI service endpoints
│   │   └── upload.js                     # File upload handling
│   ├── services/                         # Core services
│   │   ├── aiService.js                  # AI integration (DEMO MODE)
│   │   └── emailService.js               # Email automation (DEMO MODE)
│   ├── middleware/                       # Express middleware
│   │   ├── auth.js                       # JWT authentication
│   │   └── validation.js                 # Input validation
│   └── server.js                         # Express server setup
│
└── 📊 Database Schema
    ├── Users (recruiters, candidates, admins)
    ├── Candidates (profiles, scores, status)
    ├── Interviews (questions, answers, feedback)
    ├── RecruiterActions (activity tracking)
    └── JobPostings (requirements, descriptions)
```

## 🤖 AI Integration (Demo Mode)

Currently running with **mock AI responses** for hackathon demo. Ready for production AI integration:

### Resume Parsing
```javascript
// services/aiService.js - parseResume()
// TODO: Replace with OpenAI/Anthropic API
const parsedData = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "system", content: "Extract candidate info..." }]
});
```

### Candidate Scoring
```javascript
// services/aiService.js - scoreCandidate()
// Evaluates: skills match, experience, education, projects
// Returns: overall score, technical score, soft skills score
```

### Interview Generation
```javascript
// services/aiService.js - generateInterviewQuestions()
// Creates personalized questions based on:
// - Candidate background, Job requirements, Interview type
```

## 📧 Email Automation (Demo Mode)

Smart email templates for all hiring stages:

- ✅ **Application Acknowledgment** - Personalized thank you emails
- 📅 **Interview Invitations** - Automated scheduling with details
- 🎉 **Job Offers** - Comprehensive offer letters with terms
- 📝 **Status Updates** - Professional rejection/feedback emails
- ⏰ **Reminders** - Interview and deadline notifications

## 🔐 Security & Authentication

- 🔒 **JWT Authentication** - Secure token-based auth
- 🛡️ **Role-Based Access** - Recruiter/candidate/admin permissions
- 🔐 **Password Security** - bcrypt hashing with salt rounds
- 🚦 **Rate Limiting** - API abuse prevention
- ✅ **Input Validation** - Joi schema validation
- 🛡️ **Security Headers** - Helmet.js protection

## 📊 Analytics & Insights

**Recruiter Dashboard:**
- 📈 Candidate pipeline metrics
- 🎯 Skills demand analysis
- 📊 Score distribution charts
- ⏱️ Time-to-hire tracking
- 🏆 Top performer identification

**Performance Metrics:**
- 📋 Applications processed
- 🎤 Interviews conducted
- ✅ Successful hires
- 📧 Communication efficiency

## 🚀 Demo Features

### ✅ Completed for Hackathon
- 🎨 **Full UI/UX** - Complete recruiter and candidate interfaces
- 🔧 **Backend API** - All endpoints functional with mock data
- 🤖 **AI Simulation** - Realistic AI responses for demo
- 📧 **Email System** - Template generation and mock sending
- 📊 **Analytics** - Real-time dashboard with charts
- 🔐 **Authentication** - Complete user management system
- 📁 **File Upload** - Resume upload and processing
- 🗄️ **Database** - Full schema with relationships

### 🎯 Hackathon Judging Points
1. **Innovation** - AI-powered recruitment automation
2. **Technical Excellence** - Full-stack architecture with modern tech
3. **User Experience** - Intuitive interfaces for both user types
4. **Scalability** - Production-ready architecture design
5. **Business Impact** - Addresses real hiring pain points

## 🛠️ Development Setup

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd hiremind-ai

# Install all dependencies
npm run install-all

# Set up backend environment
cd backend
cp .env.example .env
# Edit .env with your database credentials

# Set up database
# Create MySQL database 'hiremind_ai'
# Tables will be auto-created on first run

# Start development servers
npm run dev
```

### Environment Variables
```bash
# Backend (.env)
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_NAME=hiremind_ai
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

## 🚀 Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Configure production database
3. Add real AI API keys (OpenAI, Anthropic)
4. Set up email provider (SendGrid, Gmail SMTP)
5. Configure file storage (AWS S3, Cloudinary)
6. Set up monitoring and logging

### Frontend Deployment
1. Build optimized bundle: `npm run build`
2. Deploy to Vercel, Netlify, or AWS
3. Configure environment variables
4. Set up CDN for static assets

## 🎯 Future Enhancements

### Phase 2 Features
- 🎥 **Video Interviews** - AI-powered video analysis
- 🌐 **Multi-language Support** - Global recruitment
- 📱 **Mobile Apps** - Native iOS/Android applications
- 🔗 **ATS Integration** - Connect with existing systems
- 🤖 **Advanced AI** - GPT-4, Claude integration
- 📊 **Predictive Analytics** - Success probability modeling

### Enterprise Features
- 🏢 **Multi-tenant Architecture** - Company isolation
- 📋 **Custom Workflows** - Configurable hiring processes
- 🔐 **SSO Integration** - Enterprise authentication
- 📊 **Advanced Reporting** - Executive dashboards
- 🔌 **API Marketplace** - Third-party integrations

## 👥 Team & Contributions

**Hackathon Team:**
- 🎨 **Frontend Development** - React, UI/UX, User Experience
- 🔧 **Backend Development** - Node.js, API Design, Database
- 🤖 **AI Integration** - Machine Learning, NLP, Automation
- 📊 **Data & Analytics** - Metrics, Insights, Visualization

## 📄 License

MIT License - Built for hackathon demonstration and educational purposes.

---

**🏆 HireMind AI - Revolutionizing Recruitment with Artificial Intelligence**

*Built with ❤️ for the hackathon - Ready to transform hiring worldwide!*
