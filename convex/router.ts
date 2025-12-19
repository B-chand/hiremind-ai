import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Webhook endpoint for resume parsing
http.route({
  path: "/webhook/resume-parsed",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    // Process parsed resume data
    // This would typically come from an external AI service
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// API endpoint for candidate scoring
http.route({
  path: "/api/score-candidate",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { candidateId } = await request.json();
    
    // Trigger AI scoring
    const result = await ctx.runAction(api.ai.scoreCandidate, {
      candidateData: {
        skills: ["JavaScript", "React"],
        experience: 3,
        projects: []
      },
      jobRequirements: ["JavaScript", "React", "Node.js"]
    });
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
