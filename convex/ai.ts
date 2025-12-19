import { action } from "./_generated/server";
import { v } from "convex/values";

// Mock AI functions - Replace with actual AI API calls
export const parseResume = action({
  args: {
    resumeText: v.string(),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual AI resume parsing
    // Example: OpenAI API call to extract structured data from resume text
    
    // Mock parsed data
    const mockParsedData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1-555-0123",
      skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
      experience: 3,
      education: "Bachelor's in Computer Science",
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce application",
          technologies: ["React", "Node.js", "MongoDB"],
        },
        {
          name: "Task Management App",
          description: "Developed a collaborative task management tool",
          technologies: ["Vue.js", "Express", "PostgreSQL"],
        },
      ],
    };

    return mockParsedData;
  },
});

export const generateInterviewQuestions = action({
  args: {
    candidateSkills: v.array(v.string()),
    jobRequirements: v.array(v.string()),
    experienceLevel: v.number(),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual AI question generation
    // Example: Use OpenAI to generate personalized interview questions
    
    const mockQuestions = [
      `Explain your experience with ${args.candidateSkills[0] || 'programming'} and how you've used it in projects.`,
      "Describe a challenging technical problem you've solved and your approach.",
      `How would you implement ${args.jobRequirements[0] || 'a feature'} in a scalable way?`,
      "Tell me about a time you had to learn a new technology quickly.",
      "How do you handle code reviews and feedback from team members?",
    ];

    return mockQuestions;
  },
});

export const scoreCandidate = action({
  args: {
    candidateData: v.object({
      skills: v.array(v.string()),
      experience: v.number(),
      projects: v.array(v.object({
        name: v.string(),
        description: v.string(),
        technologies: v.array(v.string()),
      })),
    }),
    jobRequirements: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual AI scoring algorithm
    // Example: Use machine learning model to score candidate fit
    
    // Mock scoring logic
    const skillMatch = args.candidateData.skills.filter(skill => 
      args.jobRequirements.some(req => req.toLowerCase().includes(skill.toLowerCase()))
    ).length;
    
    const experienceScore = Math.min(args.candidateData.experience * 20, 100);
    const skillScore = (skillMatch / args.jobRequirements.length) * 100;
    const projectScore = Math.min(args.candidateData.projects.length * 25, 100);
    
    const overallScore = Math.round((experienceScore + skillScore + projectScore) / 3);
    
    return {
      overallScore,
      technicalScore: Math.min(overallScore + 5, 100),
      softSkillScore: Math.max(overallScore - 5, 0),
      breakdown: {
        experienceScore,
        skillScore,
        projectScore,
      },
    };
  },
});

export const recommendSalary = action({
  args: {
    skills: v.array(v.string()),
    experience: v.number(),
    location: v.string(),
    overallScore: v.number(),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual salary recommendation AI
    // Example: Use market data and ML model for salary prediction
    
    // Mock salary calculation
    const basesalary = 50000;
    const experienceMultiplier = args.experience * 5000;
    const skillBonus = args.skills.length * 2000;
    const scoreBonus = (args.overallScore - 50) * 500;
    
    const recommendedSalary = basesalary + experienceMultiplier + skillBonus + scoreBonus;
    const salaryRange = {
      min: Math.round(recommendedSalary * 0.9),
      max: Math.round(recommendedSalary * 1.1),
    };
    
    return {
      recommendedSalary: Math.round(recommendedSalary),
      salaryRange,
      factors: {
        baseAmount: basesalary,
        experienceBonus: experienceMultiplier,
        skillsBonus: skillBonus,
        performanceBonus: scoreBonus,
      },
    };
  },
});

export const generateEmail = action({
  args: {
    type: v.union(
      v.literal("application_received"),
      v.literal("interview_invite"),
      v.literal("rejection"),
      v.literal("offer")
    ),
    candidateName: v.string(),
    additionalInfo: v.optional(v.object({
      interviewDate: v.optional(v.string()),
      salary: v.optional(v.number()),
      position: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // TODO: Replace with actual AI email generation
    // Example: Use OpenAI to generate personalized emails
    
    const emailTemplates = {
      application_received: {
        subject: "Application Received - Thank You!",
        body: `Dear ${args.candidateName},\n\nThank you for your application. We have received your resume and will review it shortly. We'll be in touch within the next few days.\n\nBest regards,\nHireMind AI Team`,
      },
      interview_invite: {
        subject: "Interview Invitation",
        body: `Dear ${args.candidateName},\n\nWe're impressed with your application and would like to invite you for an interview${args.additionalInfo?.interviewDate ? ` on ${args.additionalInfo.interviewDate}` : ''}.\n\nPlease confirm your availability.\n\nBest regards,\nHireMind AI Team`,
      },
      rejection: {
        subject: "Application Update",
        body: `Dear ${args.candidateName},\n\nThank you for your interest in our position. After careful consideration, we've decided to move forward with other candidates. We encourage you to apply for future opportunities.\n\nBest regards,\nHireMind AI Team`,
      },
      offer: {
        subject: "Job Offer - Congratulations!",
        body: `Dear ${args.candidateName},\n\nCongratulations! We're pleased to offer you the position${args.additionalInfo?.position ? ` of ${args.additionalInfo.position}` : ''}${args.additionalInfo?.salary ? ` with a salary of $${args.additionalInfo.salary.toLocaleString()}` : ''}.\n\nPlease review the attached offer letter.\n\nBest regards,\nHireMind AI Team`,
      },
    };

    return emailTemplates[args.type];
  },
});
