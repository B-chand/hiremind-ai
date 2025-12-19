import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedDatabase = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingCandidates = await ctx.db.query("candidates").take(1);
    if (existingCandidates.length > 0) {
      return "Database already seeded";
    }

    // Mock candidates data
    const mockCandidates = [
      {
        name: "Alice Johnson",
        email: "alice.johnson@email.com",
        phone: "+1-555-0101",
        skills: ["React", "TypeScript", "Node.js", "GraphQL", "AWS"],
        experience: 4,
        education: "Master's in Computer Science",
        projects: [
          {
            name: "Social Media Dashboard",
            description: "Built a real-time analytics dashboard for social media management",
            technologies: ["React", "D3.js", "Node.js", "MongoDB"],
          },
          {
            name: "E-learning Platform",
            description: "Developed a comprehensive online learning platform",
            technologies: ["Next.js", "PostgreSQL", "Stripe API"],
          },
        ],
        status: "interview" as const,
        overallScore: 92,
        technicalScore: 95,
        softSkillScore: 89,
        salaryExpectation: 85000,
        recommendedSalary: 88000,
        createdAt: Date.now() - 86400000 * 2, // 2 days ago
      },
      {
        name: "Bob Chen",
        email: "bob.chen@email.com",
        phone: "+1-555-0102",
        skills: ["Python", "Django", "PostgreSQL", "Docker", "Kubernetes"],
        experience: 6,
        education: "Bachelor's in Software Engineering",
        projects: [
          {
            name: "Inventory Management System",
            description: "Created a scalable inventory management solution",
            technologies: ["Python", "Django", "PostgreSQL", "Redis"],
          },
          {
            name: "API Gateway Service",
            description: "Built a microservices API gateway",
            technologies: ["Python", "FastAPI", "Docker", "Kubernetes"],
          },
        ],
        status: "screening" as const,
        overallScore: 88,
        technicalScore: 91,
        softSkillScore: 85,
        salaryExpectation: 95000,
        recommendedSalary: 98000,
        createdAt: Date.now() - 86400000 * 1, // 1 day ago
      },
      {
        name: "Carol Davis",
        email: "carol.davis@email.com",
        phone: "+1-555-0103",
        skills: ["Java", "Spring Boot", "MySQL", "Jenkins", "Git"],
        experience: 3,
        education: "Bachelor's in Computer Science",
        projects: [
          {
            name: "Banking Application",
            description: "Developed a secure online banking system",
            technologies: ["Java", "Spring Boot", "MySQL", "Spring Security"],
          },
        ],
        status: "applied" as const,
        overallScore: 76,
        technicalScore: 78,
        softSkillScore: 74,
        salaryExpectation: 70000,
        recommendedSalary: 72000,
        createdAt: Date.now() - 86400000 * 3, // 3 days ago
      },
      {
        name: "David Wilson",
        email: "david.wilson@email.com",
        phone: "+1-555-0104",
        skills: ["JavaScript", "Vue.js", "Express", "MongoDB", "Firebase"],
        experience: 2,
        education: "Bachelor's in Information Technology",
        projects: [
          {
            name: "Task Management App",
            description: "Built a collaborative task management application",
            technologies: ["Vue.js", "Express", "MongoDB"],
          },
          {
            name: "Weather Dashboard",
            description: "Created a weather monitoring dashboard",
            technologies: ["JavaScript", "Chart.js", "OpenWeather API"],
          },
        ],
        status: "hired" as const,
        overallScore: 82,
        technicalScore: 80,
        softSkillScore: 84,
        salaryExpectation: 60000,
        recommendedSalary: 65000,
        createdAt: Date.now() - 86400000 * 5, // 5 days ago
      },
      {
        name: "Eva Martinez",
        email: "eva.martinez@email.com",
        phone: "+1-555-0105",
        skills: ["C#", ".NET Core", "SQL Server", "Azure", "Blazor"],
        experience: 5,
        education: "Master's in Software Engineering",
        projects: [
          {
            name: "CRM System",
            description: "Developed a customer relationship management system",
            technologies: ["C#", ".NET Core", "SQL Server", "Azure"],
          },
          {
            name: "Reporting Dashboard",
            description: "Built an executive reporting dashboard",
            technologies: ["Blazor", "SignalR", "SQL Server"],
          },
        ],
        status: "rejected" as const,
        overallScore: 71,
        technicalScore: 75,
        softSkillScore: 67,
        salaryExpectation: 90000,
        recommendedSalary: 85000,
        createdAt: Date.now() - 86400000 * 4, // 4 days ago
      },
    ];

    // Insert mock candidates
    const candidateIds = [];
    for (const candidate of mockCandidates) {
      const id = await ctx.db.insert("candidates", candidate);
      candidateIds.push(id);
    }

    // Create mock interviews for some candidates
    const mockInterviews = [
      {
        candidateId: candidateIds[0], // Alice Johnson
        questions: [
          {
            question: "Tell me about your experience with React and TypeScript.",
            answer: "I've been working with React for 4 years and TypeScript for 3 years. I love the type safety and developer experience TypeScript provides.",
            score: 95,
          },
          {
            question: "Describe a challenging project you've worked on.",
            answer: "I built a real-time social media dashboard that required optimizing for performance with large datasets and real-time updates.",
            score: 90,
          },
          {
            question: "How do you approach learning new technologies?",
            answer: "I start with official documentation, build small projects, and then apply the technology to real-world problems.",
            score: 88,
          },
        ],
        overallScore: 91,
        feedback: "Excellent technical knowledge and communication skills. Strong problem-solving approach.",
        status: "completed" as const,
        createdAt: Date.now() - 86400000,
      },
      {
        candidateId: candidateIds[1], // Bob Chen
        questions: [
          {
            question: "Tell me about your experience with Python and Django.",
            answer: "I've been using Python for 6 years and Django for 4 years. I've built several production applications with Django.",
            score: 92,
          },
          {
            question: "How do you handle database optimization?",
            answer: "I use database indexing, query optimization, and caching strategies like Redis for frequently accessed data.",
            score: 89,
          },
        ],
        overallScore: 90,
        feedback: "Strong backend development skills with good understanding of scalability.",
        status: "in_progress" as const,
        createdAt: Date.now() - 43200000, // 12 hours ago
      },
    ];

    // Insert mock interviews
    for (const interview of mockInterviews) {
      await ctx.db.insert("interviews", interview);
    }

    // Create mock job posting
    const mockUserId = candidateIds[0]; // This will be replaced with actual user ID in production
    await ctx.db.insert("jobPostings", {
      title: "Senior Full Stack Developer",
      description: "We're looking for an experienced full stack developer to join our team and build scalable web applications.",
      requiredSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"],
      experienceLevel: "Senior (3-5 years)",
      salaryRange: {
        min: 80000,
        max: 120000,
      },
      location: "San Francisco, CA (Remote OK)",
      isActive: true,
      createdBy: mockUserId as any, // Type assertion for mock data
      createdAt: Date.now() - 86400000 * 7, // 1 week ago
    });

    return `Seeded database with ${mockCandidates.length} candidates and ${mockInterviews.length} interviews`;
  },
});
