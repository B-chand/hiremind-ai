const OpenAI = require('openai');

/**
 * AI Service for HireMind AI
 * 
 * This service provides AI-powered functionality for:
 * - Resume parsing and candidate data extraction
 * - Candidate scoring and evaluation
 * - Interview question generation
 * - Interview answer evaluation
 * - Salary recommendations
 * 
 * HACKATHON NOTE: Currently using mock data for demo purposes.
 * In production, replace mock functions with actual AI API calls.
 */

// Initialize OpenAI client (for future use)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

/**
 * Parse resume text/file and extract candidate information
 * @param {string} resumeContent - Resume text or file path
 * @returns {Object} Parsed candidate data
 */
async function parseResume(resumeContent) {
  // TODO: Replace with actual AI parsing using OpenAI/Anthropic
  // Example API call structure:
  /*
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "Extract candidate information from this resume in JSON format..."
    }, {
      role: "user", 
      content: resumeContent
    }],
    temperature: 0.1
  });
  */

  // Mock response for demo
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
  
  return {
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1-555-0123",
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL", "AWS"],
    experience: 5,
    education: "Bachelor's in Computer Science - MIT",
    projects: [
      {
        name: "E-commerce Platform",
        description: "Built full-stack e-commerce platform with React and Node.js",
        technologies: ["React", "Node.js", "MongoDB", "Stripe"]
      },
      {
        name: "AI Chatbot",
        description: "Developed customer service chatbot using NLP",
        technologies: ["Python", "TensorFlow", "Flask", "Docker"]
      }
    ],
    summary: "Experienced full-stack developer with 5 years in web development and AI integration."
  };
}

/**
 * Parse resume from uploaded file
 * @param {string} filePath - Path to uploaded resume file
 * @returns {Object} Parsed candidate data
 */
async function parseResumeFile(filePath) {
  // TODO: Add file reading and text extraction (PDF, DOC, etc.)
  // For now, return mock data
  return await parseResume("Mock resume content from file: " + filePath);
}

/**
 * Score candidate based on job requirements
 * @param {Object} candidate - Candidate data
 * @param {Object} jobRequirements - Job requirements and criteria
 * @returns {Object} Scoring results
 */
async function scoreCandidate(candidate, jobRequirements = {}) {
  // TODO: Replace with actual AI scoring algorithm
  // Consider factors: skills match, experience level, education, projects
  
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate AI processing
  
  // Mock scoring logic based on candidate data
  const skillsScore = Math.min(candidate.skills?.length * 15 || 60, 100);
  const experienceScore = Math.min(candidate.experience * 18 || 70, 100);
  const educationScore = candidate.education ? 85 : 60;
  
  const overallScore = Math.round((skillsScore + experienceScore + educationScore) / 3);
  const technicalScore = Math.round((skillsScore + experienceScore) / 2);
  const softSkillScore = Math.max(overallScore - 10, 50);
  
  // Salary recommendation based on experience and skills
  const baseSalary = 60000;
  const experienceMultiplier = candidate.experience * 8000;
  const skillsBonus = candidate.skills?.length * 2000 || 0;
  const recommendedSalary = baseSalary + experienceMultiplier + skillsBonus;

  return {
    overallScore,
    technicalScore,
    softSkillScore,
    recommendedSalary,
    breakdown: {
      skillsMatch: skillsScore,
      experienceLevel: experienceScore,
      educationFit: educationScore,
      projectRelevance: 75
    },
    reasoning: `Candidate shows strong technical skills (${skillsScore}/100) with ${candidate.experience} years of experience. Education background adds value. Recommended for next interview round.`
  };
}

/**
 * Generate interview questions based on candidate profile and interview type
 * @param {Object} candidate - Candidate data
 * @param {string} interviewType - Type of interview (ai_screening, technical, behavioral, final)
 * @returns {Array} Array of interview questions
 */
async function generateInterviewQuestions(candidate, interviewType = 'ai_screening') {
  // TODO: Replace with AI-generated questions based on:
  // - Candidate's skills and experience
  // - Interview type
  // - Job requirements
  
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate AI generation
  
  const questionSets = {
    ai_screening: [
      {
        id: 1,
        question: "Tell me about yourself and your background in software development.",
        type: "open_ended",
        category: "background",
        expectedDuration: 3
      },
      {
        id: 2,
        question: "What interests you most about this position and our company?",
        type: "motivational",
        category: "interest",
        expectedDuration: 2
      },
      {
        id: 3,
        question: "Describe a challenging project you've worked on recently. What made it challenging and how did you overcome the obstacles?",
        type: "behavioral",
        category: "problem_solving",
        expectedDuration: 4
      },
      {
        id: 4,
        question: "How do you stay updated with the latest technologies and industry trends?",
        type: "learning",
        category: "growth_mindset",
        expectedDuration: 2
      },
      {
        id: 5,
        question: "Where do you see yourself in your career in the next 3-5 years?",
        type: "career_goals",
        category: "ambition",
        expectedDuration: 3
      }
    ],
    technical: [
      {
        id: 1,
        question: "Explain the difference between synchronous and asynchronous programming in JavaScript.",
        type: "technical_concept",
        category: "javascript",
        expectedDuration: 4
      },
      {
        id: 2,
        question: "How would you optimize a slow-performing database query?",
        type: "problem_solving",
        category: "database",
        expectedDuration: 5
      },
      {
        id: 3,
        question: "Design a REST API for a simple blog application. What endpoints would you create?",
        type: "system_design",
        category: "api_design",
        expectedDuration: 6
      },
      {
        id: 4,
        question: "Explain the concept of microservices and when you would use them.",
        type: "architecture",
        category: "system_design",
        expectedDuration: 5
      }
    ],
    behavioral: [
      {
        id: 1,
        question: "Tell me about a time when you had to work with a difficult team member. How did you handle the situation?",
        type: "conflict_resolution",
        category: "teamwork",
        expectedDuration: 4
      },
      {
        id: 2,
        question: "Describe a situation where you had to learn a new technology quickly for a project.",
        type: "adaptability",
        category: "learning",
        expectedDuration: 3
      },
      {
        id: 3,
        question: "Give me an example of when you had to make a decision with incomplete information.",
        type: "decision_making",
        category: "judgment",
        expectedDuration: 4
      }
    ],
    final: [
      {
        id: 1,
        question: "What questions do you have about the role, team, or company culture?",
        type: "candidate_questions",
        category: "engagement",
        expectedDuration: 5
      },
      {
        id: 2,
        question: "How do you handle work-life balance, especially during busy periods?",
        type: "work_style",
        category: "sustainability",
        expectedDuration: 3
      },
      {
        id: 3,
        question: "What would success look like for you in this role after your first year?",
        type: "expectations",
        category: "goals",
        expectedDuration: 4
      }
    ]
  };

  return questionSets[interviewType] || questionSets.ai_screening;
}

/**
 * Score individual interview answer
 * @param {Object} question - Interview question object
 * @param {string} answer - Candidate's answer
 * @param {Object} candidate - Candidate data for context
 * @returns {number} Score (0-100)
 */
async function scoreAnswer(question, answer, candidate) {
  // TODO: Replace with AI-powered answer evaluation
  // Consider: relevance, completeness, technical accuracy, communication skills
  
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate AI processing
  
  // Mock scoring based on answer length and keywords
  const answerLength = answer.length;
  const hasKeywords = answer.toLowerCase().includes('experience') || 
                     answer.toLowerCase().includes('project') ||
                     answer.toLowerCase().includes('team');
  
  let score = 60; // Base score
  
  // Length-based scoring
  if (answerLength > 200) score += 20;
  else if (answerLength > 100) score += 10;
  
  // Keyword-based scoring
  if (hasKeywords) score += 15;
  
  // Question type specific scoring
  if (question.type === 'technical_concept' && answer.toLowerCase().includes('async')) {
    score += 10;
  }
  
  return Math.min(score, 100);
}

/**
 * Generate comprehensive interview feedback
 * @param {Array} questions - Interview questions
 * @param {Array} answers - Candidate answers
 * @param {Array} scores - Individual question scores
 * @param {Object} candidate - Candidate data
 * @returns {string} Detailed feedback
 */
async function generateInterviewFeedback(questions, answers, scores, candidate) {
  // TODO: Replace with AI-generated comprehensive feedback
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate AI processing
  
  const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  
  let feedback = `Interview Evaluation for ${candidate.name}\n\n`;
  feedback += `Overall Performance: ${avgScore.toFixed(1)}/100\n\n`;
  
  feedback += "Strengths:\n";
  if (avgScore >= 80) {
    feedback += "- Excellent communication skills and technical knowledge\n";
    feedback += "- Provided detailed and relevant examples\n";
    feedback += "- Demonstrated strong problem-solving abilities\n";
  } else if (avgScore >= 60) {
    feedback += "- Good understanding of core concepts\n";
    feedback += "- Adequate communication skills\n";
    feedback += "- Shows potential for growth\n";
  } else {
    feedback += "- Basic understanding of concepts\n";
    feedback += "- Room for improvement in communication\n";
  }
  
  feedback += "\nAreas for Improvement:\n";
  if (avgScore < 80) {
    feedback += "- Could provide more specific examples\n";
    feedback += "- Consider elaborating on technical details\n";
  }
  
  feedback += "\nRecommendation: ";
  if (avgScore >= 75) {
    feedback += "Strong candidate - Recommend for next round";
  } else if (avgScore >= 60) {
    feedback += "Potential candidate - Consider for further evaluation";
  } else {
    feedback += "Does not meet current requirements";
  }
  
  return feedback;
}

/**
 * Generate salary recommendation based on candidate profile and market data
 * @param {Object} candidate - Candidate data
 * @param {Object} jobContext - Job title, location, company size
 * @returns {Object} Salary recommendation with breakdown
 */
async function generateSalaryRecommendation(candidate, jobContext = {}) {
  // TODO: Replace with AI-powered salary analysis using market data APIs
  
  await new Promise(resolve => setTimeout(resolve, 600)); // Simulate API calls
  
  const { jobTitle = "Software Developer", location = "San Francisco", companySize = "medium" } = jobContext;
  
  // Mock salary calculation
  const baseSalaries = {
    "Software Developer": 85000,
    "Senior Developer": 120000,
    "Tech Lead": 140000,
    "Engineering Manager": 160000
  };
  
  const locationMultipliers = {
    "San Francisco": 1.4,
    "New York": 1.3,
    "Seattle": 1.2,
    "Austin": 1.1,
    "Remote": 1.0
  };
  
  const companySizeMultipliers = {
    "startup": 0.9,
    "small": 0.95,
    "medium": 1.0,
    "large": 1.1,
    "enterprise": 1.15
  };
  
  const baseSalary = baseSalaries[jobTitle] || baseSalaries["Software Developer"];
  const locationMultiplier = locationMultipliers[location] || 1.0;
  const sizeMultiplier = companySizeMultipliers[companySize] || 1.0;
  const experienceBonus = candidate.experience * 5000;
  const skillsBonus = candidate.skills?.length * 2000 || 0;
  
  const recommendedSalary = Math.round(
    (baseSalary * locationMultiplier * sizeMultiplier) + experienceBonus + skillsBonus
  );
  
  const salaryRange = {
    min: Math.round(recommendedSalary * 0.9),
    max: Math.round(recommendedSalary * 1.1)
  };
  
  return {
    recommendedSalary,
    salaryRange,
    breakdown: {
      baseSalary: Math.round(baseSalary * locationMultiplier * sizeMultiplier),
      experienceBonus,
      skillsBonus,
      locationAdjustment: `${((locationMultiplier - 1) * 100).toFixed(0)}%`,
      companySizeAdjustment: `${((sizeMultiplier - 1) * 100).toFixed(0)}%`
    },
    marketData: {
      percentile25: Math.round(recommendedSalary * 0.8),
      percentile50: recommendedSalary,
      percentile75: Math.round(recommendedSalary * 1.2),
      percentile90: Math.round(recommendedSalary * 1.4)
    },
    reasoning: `Based on ${candidate.experience} years of experience, ${candidate.skills?.length || 0} relevant skills, and market data for ${jobTitle} in ${location}.`
  };
}

/**
 * Generate personalized email content for candidate communication
 * @param {Object} candidate - Candidate data
 * @param {string} emailType - Type of email (acknowledgment, interview_invite, rejection, offer)
 * @param {Object} customContext - Additional context for email generation
 * @returns {Object} Email content with subject and body
 */
async function generateEmail(candidate, emailType, customContext = {}) {
  // TODO: Replace with AI-generated personalized emails
  
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate AI processing
  
  const emailTemplates = {
    acknowledgment: {
      subject: `Thank you for your application, ${candidate.name}`,
      body: `
        <h2>Thank you for your interest in joining our team!</h2>
        <p>Dear ${candidate.name},</p>
        <p>We have received your application and are impressed by your background in software development. Your experience with ${candidate.skills?.slice(0, 3).join(', ') || 'various technologies'} caught our attention.</p>
        <p>Our team is currently reviewing your application, and we will get back to you within the next 3-5 business days with next steps.</p>
        <p>In the meantime, feel free to explore our company culture and recent projects on our website.</p>
        <p>Best regards,<br>The Hiring Team</p>
      `
    },
    interview_invite: {
      subject: `Interview Invitation - ${candidate.name}`,
      body: `
        <h2>Congratulations! You've been selected for an interview</h2>
        <p>Dear ${candidate.name},</p>
        <p>We were impressed by your application and would like to invite you for an interview. Your ${candidate.experience} years of experience and expertise in ${candidate.skills?.slice(0, 2).join(' and ') || 'software development'} align well with what we're looking for.</p>
        <p><strong>Interview Details:</strong></p>
        <ul>
          <li>Type: ${customContext.interviewType || 'Technical Interview'}</li>
          <li>Duration: ${customContext.duration || '45 minutes'}</li>
          <li>Format: ${customContext.format || 'Video call'}</li>
        </ul>
        <p>Please reply with your availability for the next week, and we'll send you a calendar invitation.</p>
        <p>Looking forward to speaking with you!</p>
        <p>Best regards,<br>The Hiring Team</p>
      `
    },
    rejection: {
      subject: `Update on your application - ${candidate.name}`,
      body: `
        <h2>Thank you for your interest in our position</h2>
        <p>Dear ${candidate.name},</p>
        <p>Thank you for taking the time to apply and interview with us. We appreciate the effort you put into the process and your interest in joining our team.</p>
        <p>After careful consideration, we have decided to move forward with another candidate whose experience more closely matches our current needs.</p>
        <p>We were impressed by your skills in ${candidate.skills?.slice(0, 2).join(' and ') || 'software development'} and encourage you to apply for future opportunities that may be a better fit.</p>
        <p>We wish you the best of luck in your job search.</p>
        <p>Best regards,<br>The Hiring Team</p>
      `
    },
    offer: {
      subject: `Job Offer - ${candidate.name}`,
      body: `
        <h2>Congratulations! We'd like to extend you an offer</h2>
        <p>Dear ${candidate.name},</p>
        <p>We are excited to offer you the position of ${customContext.jobTitle || 'Software Developer'} at our company!</p>
        <p>Your impressive background and ${candidate.experience} years of experience make you an excellent fit for our team.</p>
        <p><strong>Offer Details:</strong></p>
        <ul>
          <li>Position: ${customContext.jobTitle || 'Software Developer'}</li>
          <li>Salary: $${candidate.recommendedSalary?.toLocaleString() || '95,000'} annually</li>
          <li>Start Date: ${customContext.startDate || 'To be discussed'}</li>
          <li>Benefits: Comprehensive health insurance, 401k matching, flexible PTO</li>
        </ul>
        <p>Please review the attached offer letter and let us know if you have any questions. We're excited about the possibility of you joining our team!</p>
        <p>Best regards,<br>The Hiring Team</p>
      `
    }
  };
  
  return emailTemplates[emailType] || emailTemplates.acknowledgment;
}

module.exports = {
  parseResume,
  parseResumeFile,
  scoreCandidate,
  generateInterviewQuestions,
  scoreAnswer,
  generateInterviewFeedback,
  generateSalaryRecommendation,
  generateEmail
};
