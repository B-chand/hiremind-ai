# HireMind AI Backend

AI-powered recruitment platform backend built with Node.js, Express, and Sequelize.

## 🚀 Quick Start (Hackathon Demo)

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start development server
npm run dev
```

The server will start on `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── models/           # Sequelize database models
├── routes/           # API route handlers
├── middleware/       # Authentication & validation middleware
├── services/         # AI and email services
├── uploads/          # File upload directory
├── server.js         # Main application entry point
└── package.json      # Dependencies and scripts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token

### Candidates
- `GET /api/candidates` - List candidates with filtering
- `GET /api/candidates/top` - Get top-scoring candidates
- `GET /api/candidates/:id` - Get candidate details
- `POST /api/candidates` - Create new candidate
- `PUT /api/candidates/:id` - Update candidate
- `DELETE /api/candidates/:id` - Remove candidate

### Interviews
- `GET /api/interviews` - List interviews
- `GET /api/interviews/:id` - Get interview details
- `POST /api/interviews` - Create AI interview
- `POST /api/interviews/:id/start` - Start interview
- `POST /api/interviews/:id/answer` - Submit answer
- `POST /api/interviews/:id/complete` - Complete interview

### AI Services
- `POST /api/ai/score-candidate` - Generate AI candidate score
- `POST /api/ai/parse-resume` - Parse resume with AI
- `POST /api/ai/generate-email` - Generate personalized emails
- `POST /api/ai/send-email` - Send email to candidate
- `POST /api/ai/salary-recommendation` - Get salary recommendations
- `POST /api/ai/batch-score` - Score multiple candidates

### File Upload
- `POST /api/upload/resume` - Upload resume file
- `POST /api/upload/resume-and-parse` - Upload and parse resume
- `DELETE /api/upload/resume/:candidateId` - Delete resume

### Analytics
- `GET /api/recruiters/dashboard` - Dashboard statistics
- `GET /api/recruiters/analytics/skills` - Skills analytics
- `GET /api/recruiters/analytics/scores` - Score distribution
- `GET /api/recruiters/activity` - Recent activity

## 🤖 AI Services (Demo Mode)

The AI services are currently running in **demo mode** with mock responses for the hackathon. To integrate real AI:

### 1. Resume Parsing (`services/aiService.js`)
```javascript
// Replace mock implementation with:
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{
    role: "system", 
    content: "Extract candidate info from resume in JSON format..."
  }]
});
```

### 2. Candidate Scoring
```javascript
// Add real scoring algorithm based on:
// - Skills matching
// - Experience relevance  
// - Education fit
// - Project portfolio
```

### 3. Interview Questions
```javascript
// Generate dynamic questions based on:
// - Candidate background
// - Job requirements
// - Interview type
```

## 📧 Email Service (Demo Mode)

Email service logs to console in demo mode. For production:

1. Configure SMTP settings in `.env`
2. Uncomment email configuration in `services/emailService.js`
3. Set up email provider (Gmail, SendGrid, etc.)

## 🗄️ Database Models

- **User** - Recruiters and admin users
- **Candidate** - Job applicants with skills and scores
- **Interview** - AI-powered interview sessions
- **RecruiterAction** - Activity tracking
- **JobPosting** - Job listings and requirements

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation with Joi
- CORS configuration
- Helmet security headers

## 🚀 Deployment Notes

For production deployment:

1. Set `NODE_ENV=production`
2. Configure real database (MySQL/PostgreSQL)
3. Add actual AI API keys
4. Set up email provider
5. Configure HTTPS
6. Set up file storage (AWS S3, etc.)

## 📊 Demo Features

- ✅ Complete API structure
- ✅ Mock AI responses
- ✅ File upload handling
- ✅ Authentication system
- ✅ Database models
- ✅ Email templates
- ✅ Analytics endpoints
- ✅ Error handling

Perfect for hackathon demos and MVP development!
