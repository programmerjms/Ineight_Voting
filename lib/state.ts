import { kv } from "@/lib/kv";

export async function getPublicState() {
  const votesCast = (await kv.get<number>("tally:votesCast")) || 0;

  return {
    projectsRemaining: 16,
    votesCast,
    activeMatchups: 8
  };
}
