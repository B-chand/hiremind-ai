import { query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const candidates = await ctx.db.query("candidates").collect();
    const interviews = await ctx.db.query("interviews").collect();

    const totalCandidates = candidates.length;
    const activeInterviews = interviews.filter(i => i.status === "in_progress").length;
    const completedInterviews = interviews.filter(i => i.status === "completed").length;
    const avgScore = candidates.length > 0 
      ? candidates.reduce((sum, c) => sum + (c.overallScore || 0), 0) / candidates.length
      : 0;

    const statusDistribution = {
      applied: candidates.filter(c => c.status === "applied").length,
      screening: candidates.filter(c => c.status === "screening").length,
      interview: candidates.filter(c => c.status === "interview").length,
      hired: candidates.filter(c => c.status === "hired").length,
      rejected: candidates.filter(c => c.status === "rejected").length,
    };

    return {
      totalCandidates,
      activeInterviews,
      completedInterviews,
      avgScore: Math.round(avgScore),
      statusDistribution,
    };
  },
});

export const getSkillsAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const candidates = await ctx.db.query("candidates").collect();
    
    const skillsCount: Record<string, number> = {};
    candidates.forEach(candidate => {
      candidate.skills.forEach(skill => {
        skillsCount[skill] = (skillsCount[skill] || 0) + 1;
      });
    });

    const topSkills = Object.entries(skillsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));

    return topSkills;
  },
});

export const getScoreDistribution = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const candidates = await ctx.db.query("candidates").collect();
    
    const scoreRanges = {
      "90-100": 0,
      "80-89": 0,
      "70-79": 0,
      "60-69": 0,
      "Below 60": 0,
    };

    candidates.forEach(candidate => {
      const score = candidate.overallScore || 0;
      if (score >= 90) scoreRanges["90-100"]++;
      else if (score >= 80) scoreRanges["80-89"]++;
      else if (score >= 70) scoreRanges["70-79"]++;
      else if (score >= 60) scoreRanges["60-69"]++;
      else scoreRanges["Below 60"]++;
    });

    return Object.entries(scoreRanges).map(([range, count]) => ({ range, count }));
  },
});

export const getRecentActivity = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const actions = await ctx.db
      .query("recruiterActions")
      .withIndex("by_timestamp")
      .order("desc")
      .take(10);

    const actionsWithDetails = await Promise.all(
      actions.map(async (action) => {
        const candidate = await ctx.db.get(action.candidateId);
        const recruiter = await ctx.db.get(action.recruiterId);
        
        return {
          ...action,
          candidateName: candidate?.name || "Unknown",
          recruiterName: recruiter?.name || "Unknown",
        };
      })
    );

    return actionsWithDetails;
  },
});
