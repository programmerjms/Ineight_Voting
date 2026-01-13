"use client";

import { useState } from "react";
import { isValidEmail, normalizeEmail } from "@/lib/utils";

export type Registration = {
  name: string;
  email: string;
  consentSalesforce: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: (reg: Registration) => void;
};

export default function RegistrationModal({ open, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  async function submit() {
    setErr(null);

    const trimmedName = name.trim();
    const trimmedEmail = normalizeEmail(email);

    if (!trimmedName) return setErr("Please enter your name.");
    if (!isValidEmail(trimmedEmail)) return setErr("Please enter a valid email.");
    if (!consent) return setErr("Consent is required to proceed.");

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          consentSalesforce: true
        })
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Registration failed.");
      }

      const reg = { name: trimmedName, email: trimmedEmail, consentSalesforce: true };
      localStorage.setItem("voter_registration", JSON.stringify(reg));
      onSuccess(reg);
      onClose();
    } catch (e: any) {
      setErr(e.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHeader">
          <div>Register to Vote</div>
          <button className="btn" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modalBody">
          <div className="field">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
          </div>

          <div className="field">
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>

          <div className="checkboxRow">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              style={{ marginTop: 3 }}
            />
            <div>
              I consent to share my Name and Email with Salesforce for tournament updates and follow-up.
            </div>
          </div>

          {err && <div style={{ marginTop: 12, color: "#b00020", fontWeight: 800 }}>{err}</div>}
        </div>

        <div className="modalActions">
          <button className="btn" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btnPrimary" onClick={submit} disabled={loading}>
            {loading ? "Submitting…" : "Register & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
