"use client";

import { useMemo, useState } from "react";
import type { Matchup, Project } from "@/lib/bracketData";
import RegistrationModal, { Registration } from "@/components/RegistrationModal";

type Props = {
  projects: Project[];
  matchups: Matchup[];
  votingStatus: "open" | "closed";
};

export default function Bracket({ projects, matchups, votingStatus }: Props) {
  const projectById = useMemo(() => {
    const m = new Map<string, Project>();
    projects.forEach((p) => m.set(p.id, p));
    return m;
  }, [projects]);

  const [reg, setReg] = useState<Registration | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("voter_registration");
    return raw ? JSON.parse(raw) : null;
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingVote, setPendingVote] = useState<{ matchupId: string; projectId: string } | null>(null);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function requireRegistration(matchupId: string, projectId: string) {
    if (reg?.email) return true;
    setPendingVote({ matchupId, projectId });
    setModalOpen(true);
    return false;
  }

  async function castVote(matchupId: string, projectId: string) {
    if (votingStatus !== "open") return;

    if (!requireRegistration(matchupId, projectId)) return;

    const key = `${matchupId}:${projectId}`;
    setBusyKey(key);
    setToast(null);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchupId,
          projectId,
          voterEmail: reg!.email
        })
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.error || "Vote failed.");

      setToast("Vote recorded. Thanks!");
    } catch (e: any) {
      setToast(e.message || "Something went wrong.");
    } finally {
      setBusyKey(null);
      setTimeout(() => setToast(null), 2800);
    }
  }

  async function onRegSuccess(newReg: Registration) {
    setReg(newReg);
    if (pendingVote) {
      const pv = pendingVote;
      setPendingVote(null);
      await castVote(pv.matchupId, pv.projectId);
    }
  }

  return (
    <>
      <div className="bracketWrap">
        <div className="col">
          {matchups.slice(0, matchups.length / 2).map((m, idx) => (
            <MatchCard
              key={m.id}
              title={`Project ${idx * 2 + 1}`}
              left={projectById.get(m.leftId)!}
              right={projectById.get(m.rightId)!}
              votingStatus={votingStatus}
              busyKey={busyKey}
              onVote={castVote}
              matchupId={m.id}
            />
          ))}
        </div>

        <div className="centerCol">
          <div className="trophy">🏆</div>
        </div>

        <div className="col">
          {matchups.slice(matchups.length / 2).map((m, idx) => (
            <MatchCard
              key={m.id}
              title={`Project ${idx * 2 + 9}`}
              left={projectById.get(m.leftId)!}
              right={projectById.get(m.rightId)!}
              votingStatus={votingStatus}
              busyKey={busyKey}
              onVote={castVote}
              matchupId={m.id}
            />
          ))}
        </div>
      </div>

      {toast && (
        <div style={{
          position:"fixed", left:"50%", bottom:18, transform:"translateX(-50%)",
          background:"#111", color:"#fff", padding:"10px 14px",
          borderRadius:12, fontWeight:900, zIndex:60
        }}>
          {toast}
        </div>
      )}

      <RegistrationModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={onRegSuccess}
      />
    </>
  );
}

function MatchCard({
  title,
  left,
  right,
  votingStatus,
  busyKey,
  onVote,
  matchupId
}: {
  title: string;
  left: Project;
  right: Project;
  votingStatus: "open" | "closed";
  busyKey: string | null;
  onVote: (matchupId: string, projectId: string) => void;
  matchupId: string;
}) {
  return (
    <div className="match">
      <div className="matchHeader">{title}</div>

      {[left, right].map((p) => {
        const key = `${matchupId}:${p.id}`;
        const isBusy = busyKey === key;
        const active = votingStatus === "open" && !isBusy;

        return (
          <div className="choice" key={p.id}>
            <div className="choiceLeft">
              <div className="choiceName">{p.name}</div>
              <div className="choiceMeta">0%</div>
            </div>

            <div className="choiceActions">
              <button
                className={`voteBtn ${active ? "active" : ""}`}
                aria-disabled={votingStatus !== "open" || isBusy}
                onClick={() => active && onVote(matchupId, p.id)}
              >
                {isBusy ? "…" : "Vote"}
              </button>
              <button
                className="infoBtn"
                onClick={() => alert(p.description || "Add details here.")}
              >
                Info
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
