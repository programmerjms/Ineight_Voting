import { NextResponse } from "next/server";

// Prevent Next from trying to prerender this route at build time
export const dynamic = "force-dynamic";

export async function GET() {
  // If KV isn't configured, return safe defaults
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return NextResponse.json({
      projectsRemaining: 16,
      votesCast: 0,
      activeMatchups: 8
    });
  }

  // Lazy import ONLY when env vars exist
  const { kv } = await import("@/lib/kv");
  const votesCast = (await kv.get<number>("tally:votesCast")) || 0;

  return NextResponse.json({
    projectsRemaining: 16,
    votesCast,
    activeMatchups: 8
  });
}
