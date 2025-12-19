import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  candidates: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    skills: v.array(v.string()),
    experience: v.number(), // years of experience
    education: v.string(),
    projects: v.array(v.object({
      name: v.string(),
      description: v.string(),
      technologies: v.array(v.string()),
    })),
    resumeStorageId: v.optional(v.id("_storage")),
    status: v.union(v.literal("applied"), v.literal("screening"), v.literal("interview"), v.literal("hired"), v.literal("rejected")),
    overallScore: v.optional(v.number()),
    technicalScore: v.optional(v.number()),
    softSkillScore: v.optional(v.number()),
    salaryExpectation: v.optional(v.number()),
    recommendedSalary: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_score", ["overallScore"]),

  interviews: defineTable({
    candidateId: v.id("candidates"),
    questions: v.array(v.object({
      question: v.string(),
      answer: v.optional(v.string()),
      score: v.optional(v.number()),
    })),
    overallScore: v.optional(v.number()),
    feedback: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed")),
    createdAt: v.number(),
  })
    .index("by_candidate", ["candidateId"])
    .index("by_status", ["status"]),

  recruiterActions: defineTable({
    recruiterId: v.id("users"),
    actionType: v.union(
      v.literal("viewed_candidate"),
      v.literal("shortlisted"),
      v.literal("rejected"),
      v.literal("scheduled_interview"),
      v.literal("sent_offer")
    ),
    candidateId: v.id("candidates"),
    notes: v.optional(v.string()),
    timestamp: v.number(),
  })
    .index("by_recruiter", ["recruiterId"])
    .index("by_candidate", ["candidateId"])
    .index("by_timestamp", ["timestamp"]),

  jobPostings: defineTable({
    title: v.string(),
    description: v.string(),
    requiredSkills: v.array(v.string()),
    experienceLevel: v.string(),
    salaryRange: v.object({
      min: v.number(),
      max: v.number(),
    }),
    location: v.string(),
    isActive: v.boolean(),
    createdBy: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_active", ["isActive"])
    .index("by_creator", ["createdBy"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
