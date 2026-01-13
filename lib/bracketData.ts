export type Project = { id: string; name: string; description?: string };
export type Matchup = { id: string; leftId: string; rightId: string };

export const projects: Project[] = Array.from({ length: 16 }).map((_, i) => ({
  id: `p${i + 1}`,
  name: `Project ${i + 1}`,
  description: "Short description here."
}));

// Round 1 matchups: 16 projects → 8 matchups
export const round1: Matchup[] = [
  { id: "m1", leftId: "p1", rightId: "p2" },
  { id: "m2", leftId: "p3", rightId: "p4" },
  { id: "m3", leftId: "p5", rightId: "p6" },
  { id: "m4", leftId: "p7", rightId: "p8" },
  { id: "m5", leftId: "p9", rightId: "p10" },
  { id: "m6", leftId: "p11", rightId: "p12" },
  { id: "m7", leftId: "p13", rightId: "p14" },
  { id: "m8", leftId: "p15", rightId: "p16" }
];
