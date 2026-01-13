import { kv } from "@/lib/kv";

export async function getPublicState() {
  // If KV isn't configured (common in first deploy), return safe defaults
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return {
      projectsRemaining: 16,
      votesCast: 0,
      activeMatchups: 8
    };
  }

  const { kv } = await import("@/lib/kv");
  const votesCast = (await kv.get<number>("tally:votesCast")) || 0;

  return {
    projectsRemaining: 16,
    votesCast,
    activeMatchups: 8
  };
}

