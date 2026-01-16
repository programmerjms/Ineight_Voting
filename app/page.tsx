import Countdown from "@/components/Countdown";
import Bracket from "@/components/Bracket";
import { projects, round1 } from "@/lib/bracketData";

export default async function Page() {
  const votingStatus = (process.env.NEXT_PUBLIC_VOTING_STATUS || "closed") as "open" | "closed";
  const nextStart =
    process.env.NEXT_PUBLIC_NEXT_VOTING_START_ISO || new Date(Date.now() + 4 * 864e5).toISOString();

  const state = await getPublicState();

  return (
    <>
      <div className="topbar">
        <div className="container topbarInner">
          <div className="brand">
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 7,
                border: "1px solid #ddd",
                background: "#fff"
              }}
            />
            <div>
              <div style={{ fontSize: 12, lineHeight: 1.1, fontWeight: 900 }}>INEIGHT</div>
              <div style={{ fontSize: 12, lineHeight: 1.1, opacity: 0.8 }}>Championship</div>
            </div>
          </div>

          <div className="navlinks">
            <a href="#">Championship Overview</a>
            <a href="#" style={{ fontWeight: 900 }}>
              View Bracket
            </a>
            <a href="#">InEight Website</a>
          </div>
        </div>
      </div>

      <div className="hero">
        <div className="container heroGrid">
          <div>
            <h1>{votingStatus === "closed" ? "Voting Closed:\nRound Complete" : "Voting Open:\nCast Your Vote"}</h1>
            <p>
              Voting has wrapped for this round. Winning projects will move to the next round of the tournament. Check
              back next week to see which projects advance!
            </p>
          </div>

          <div className="countPanel">
            <div className="countTitle">Voting starts in:</div>
            <Countdown targetISO={nextStart} />

            <div className="notifyRow">
              <input placeholder="Enter your email" />
              <button
                type="button"
                onClick={() => alert("Hook this to your email platform (e.g., HubSpot/Mailchimp).")}
              >
                Notify Me!
              </button>
            </div>

            <div className="privacy">Privacy first. Your email will only be used for tournament updates.</div>
          </div>
        </div>
      </div>

      <div className="stats">
        <div className="container statsInner">
          <div className="stat">
            <div className="statIcon" />
            <div className="statNum">{state.projectsRemaining}</div>
            <div className="statLbl">Projects remaining</div>
          </div>
          <div className="stat">
            <div className="statIcon" />
            <div className="statNum">{state.votesCast}</div>
            <div className="statLbl">Votes Cast</div>
          </div>
          <div className="stat">
            <div className="statIcon" />
            <div className="statNum">{state.activeMatchups}</div>
            <div className="statLbl">Active Match-ups</div>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="container">
          <div className="roundTitle">Round 1</div>
          <Bracket projects={projects} matchups={round1} votingStatus={votingStatus} />
        </div>
      </div>
    </>
  );
}
