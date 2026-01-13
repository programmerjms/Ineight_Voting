import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { isValidEmail, normalizeEmail, safeKey, nowISO } from "@/lib/utils";

export async function POST(req: Request) {
  const status = (process.env.NEXT_PUBLIC_VOTING_STATUS || "closed").toLowerCase();
  if (status !== "open") {
    return NextResponse.json({ error: "Voting is currently closed." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const matchupId = String(body.matchupId || "").trim();
  const projectId = String(body.projectId || "").trim();
  const voterEmail = normalizeEmail(String(body.voterEmail || ""));

  if (!matchupId || !projectId) return NextResponse.json({ error: "Missing matchup/project." }, { status: 400 });
  if (!isValidEmail(voterEmail)) return NextResponse.json({ error: "Invalid voter." }, { status: 400 });

  // Ensure voter exists + consent captured
  const voterKey = `voter:${safeKey(voterEmail)}`;
  const voter = await kv.hgetall<Record<string, string>>(voterKey);
  if (!voter?.email) return NextResponse.json({ error: "Please register before voting." }, { status: 401 });
  if (voter?.consentSalesforce !== "true") return NextResponse.json({ error: "Consent required." }, { status: 401 });

  // Prevent duplicate voting per matchup
  const voteLockKey = `vote:${safeKey(voterEmail)}:${safeKey(matchupId)}`;
  const existing = await kv.get(voteLockKey);
  if (existing) return NextResponse.json({ error: "You already voted in this match-up." }, { status: 409 });

  // Record vote
  await kv.set(voteLockKey, { matchupId, projectId, voterEmail, at: nowISO() });

  // Tally counts
  await kv.incr(`tally:matchup:${safeKey(matchupId)}:project:${safeKey(projectId)}`);
  await kv.incr(`tally:votesCast`);

  return NextResponse.json({ ok: true });
}
