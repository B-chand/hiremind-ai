import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const jobs = args.isActive !== undefined
      ? await ctx.db
          .query("jobPostings")
          .withIndex("by_active", (q) => q.eq("isActive", args.isActive!))
          .order("desc")
          .collect()
      : await ctx.db.query("jobPostings").order("desc").collect();

    return jobs;
  },
});

export const getById = query({
  args: { id: v.id("jobPostings") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    requiredSkills: v.array(v.string()),
    experienceLevel: v.string(),
    salaryRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const jobId = await ctx.db.insert("jobPostings", {
      ...args,
      isActive: true,
      createdBy: userId,
      createdAt: Date.now(),
    });

    return jobId;
  },
});

export const update = mutation({
  args: {
    id: v.id("jobPostings"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    requiredSkills: v.optional(v.array(v.string())),
    experienceLevel: v.optional(v.string()),
    salaryRange: v.optional(v.object({
      min: v.number(),
      max: v.number(),
    })),
    location: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);

    return id;
  },
});

export const toggleActive = mutation({
  args: {
    id: v.id("jobPostings"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const job = await ctx.db.get(args.id);
    if (!job) {
      throw new Error("Job posting not found");
    }

    await ctx.db.patch(args.id, {
      isActive: !job.isActive,
    });

    return args.id;
  },
});
