import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const getByCandidate = query({
  args: { candidateId: v.id("candidates") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate", (q) => q.eq("candidateId", args.candidateId))
      .collect();

    return interviews;
  },
});

export const create = mutation({
  args: {
    candidateId: v.id("candidates"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Generate AI interview questions based on candidate profile
    const candidate = await ctx.db.get(args.candidateId);
    if (!candidate) {
      throw new Error("Candidate not found");
    }

    // Mock AI-generated questions based on skills
    const questions = [
      {
        question: `Tell me about your experience with ${candidate.skills[0] || 'programming'}.`,
      },
      {
        question: "Describe a challenging project you've worked on and how you overcame obstacles.",
      },
      {
        question: `How would you approach learning ${candidate.skills[1] || 'a new technology'} in a short timeframe?`,
      },
      {
        question: "What motivates you in your work, and how do you handle stress?",
      },
      {
        question: "Where do you see yourself in 5 years, and how does this role fit into your career goals?",
      },
    ];

    const interviewId = await ctx.db.insert("interviews", {
      candidateId: args.candidateId,
      questions,
      status: "pending",
      createdAt: Date.now(),
    });

    return interviewId;
  },
});

export const submitAnswer = mutation({
  args: {
    interviewId: v.id("interviews"),
    questionIndex: v.number(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const interview = await ctx.db.get(args.interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    const updatedQuestions = [...interview.questions];
    if (updatedQuestions[args.questionIndex]) {
      updatedQuestions[args.questionIndex] = {
        ...updatedQuestions[args.questionIndex],
        answer: args.answer,
        score: Math.floor(Math.random() * 30) + 70, // Mock AI scoring (70-100)
      };
    }

    await ctx.db.patch(args.interviewId, {
      questions: updatedQuestions,
      status: "in_progress",
    });

    return args.interviewId;
  },
});

export const completeInterview = mutation({
  args: {
    interviewId: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const interview = await ctx.db.get(args.interviewId);
    if (!interview) {
      throw new Error("Interview not found");
    }

    // Calculate overall score
    const answeredQuestions = interview.questions.filter(q => q.score !== undefined);
    const overallScore = answeredQuestions.length > 0 
      ? Math.round(answeredQuestions.reduce((sum, q) => sum + (q.score || 0), 0) / answeredQuestions.length)
      : 0;

    // Generate AI feedback
    const feedback = overallScore >= 85 
      ? "Excellent performance! Strong technical knowledge and communication skills."
      : overallScore >= 70
      ? "Good performance with room for improvement in some areas."
      : "Needs improvement in technical knowledge and communication.";

    await ctx.db.patch(args.interviewId, {
      overallScore,
      feedback,
      status: "completed",
    });

    // Update candidate scores
    await ctx.runMutation(api.candidates.updateScores, {
      id: interview.candidateId,
      overallScore,
      technicalScore: Math.min(overallScore + 5, 100),
      softSkillScore: Math.max(overallScore - 5, 0),
      recommendedSalary: 50000 + (overallScore * 500), // Mock salary calculation
    });

    return args.interviewId;
  },
});

export const getById = query({
  args: { id: v.id("interviews") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.get(args.id);
  },
});
