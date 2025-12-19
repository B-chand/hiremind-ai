import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    status: v.optional(v.union(v.literal("applied"), v.literal("screening"), v.literal("interview"), v.literal("hired"), v.literal("rejected"))),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const candidates = args.status 
      ? await ctx.db
          .query("candidates")
          .withIndex("by_status", (q) => q.eq("status", args.status!))
          .order("desc")
          .collect()
      : await ctx.db.query("candidates").order("desc").collect();


    
    // Get resume URLs for candidates with resumes
    const candidatesWithResumes = await Promise.all(
      candidates.map(async (candidate) => ({
        ...candidate,
        resumeUrl: candidate.resumeStorageId 
          ? await ctx.storage.getUrl(candidate.resumeStorageId)
          : null,
      }))
    );

    return candidatesWithResumes;
  },
});

export const getById = query({
  args: { id: v.id("candidates") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const candidate = await ctx.db.get(args.id);
    if (!candidate) {
      return null;
    }

    return {
      ...candidate,
      resumeUrl: candidate.resumeStorageId 
        ? await ctx.storage.getUrl(candidate.resumeStorageId)
        : null,
    };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    skills: v.array(v.string()),
    experience: v.number(),
    education: v.string(),
    projects: v.array(v.object({
      name: v.string(),
      description: v.string(),
      technologies: v.array(v.string()),
    })),
    salaryExpectation: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const candidateId = await ctx.db.insert("candidates", {
      ...args,
      status: "applied",
      createdAt: Date.now(),
    });

    return candidateId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("candidates"),
    status: v.union(v.literal("applied"), v.literal("screening"), v.literal("interview"), v.literal("hired"), v.literal("rejected")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
    });

    // Log recruiter action
    await ctx.db.insert("recruiterActions", {
      recruiterId: userId,
      actionType: args.status === "hired" ? "sent_offer" : 
                  args.status === "rejected" ? "rejected" : "shortlisted",
      candidateId: args.id,
      timestamp: Date.now(),
    });

    return args.id;
  },
});

export const updateScores = mutation({
  args: {
    id: v.id("candidates"),
    overallScore: v.number(),
    technicalScore: v.number(),
    softSkillScore: v.number(),
    recommendedSalary: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.id, {
      overallScore: args.overallScore,
      technicalScore: args.technicalScore,
      softSkillScore: args.softSkillScore,
      recommendedSalary: args.recommendedSalary,
    });

    return args.id;
  },
});

export const uploadResume = mutation({
  args: {
    candidateId: v.id("candidates"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await ctx.db.patch(args.candidateId, {
      resumeStorageId: args.storageId,
    });

    return args.candidateId;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

export const getTopCandidates = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const candidates = await ctx.db
      .query("candidates")
      .withIndex("by_score")
      .order("desc")
      .take(10);

    return candidates.filter(c => c.overallScore !== undefined);
  },
});
