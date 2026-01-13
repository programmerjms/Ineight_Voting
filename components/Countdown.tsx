"use client";

import { useEffect, useMemo, useState } from "react";

type Props = { targetISO: string };

function diffParts(ms: number) {
  const clamp = Math.max(0, ms);
  const totalSeconds = Math.floor(clamp / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return { days, hours, mins, secs };
}

export default function Countdown({ targetISO }: Props) {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const { days, hours, mins, secs } = diffParts(target - now);

  return (
    <div className="countBoxes">
      <div className="box">
        <div className="boxNum">{days}</div>
        <div className="boxLbl">Days</div>
      </div>
      <div className="box">
        <div className="boxNum">{hours}</div>
        <div className="boxLbl">Hours</div>
      </div>
      <div className="box">
        <div className="boxNum">{mins}</div>
        <div className="boxLbl">Min</div>
      </div>
      <div className="box">
        <div className="boxNum">{secs}</div>
        <div className="boxLbl">Secs</div>
      </div>
    </div>
  );
}
