import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const status = (process.env.NEXT_PUBLIC_VOTING_STATUS || "closed").toLowerCase();
  if (status !== "open") return NextResponse.json({ error: "Voting is currently closed." }, { status: 403 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const matchupId = String(body.matchupId || "").trim();
  const projectId = String(body.projectId || "").trim();
  const voterEmail = String(body.voterEmail || "").trim().toLowerCase();

  if (!matchupId || !projectId || !voterEmail) {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  // No DB mode: accept vote but do not persist server-side
  return NextResponse.json({ ok: true, mode: "no-db" });
}
