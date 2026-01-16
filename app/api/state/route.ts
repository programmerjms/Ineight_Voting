import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    projectsRemaining: 16,
    votesCast: 0,
    activeMatchups: 8
  });
}
