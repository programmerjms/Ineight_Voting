import { NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { isValidEmail, normalizeEmail, nowISO, safeKey } from "@/lib/utils";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = normalizeEmail(String(body.email || ""));
  const consentSalesforce = Boolean(body.consentSalesforce);

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!isValidEmail(email)) return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  if (!consentSalesforce) return NextResponse.json({ error: "Consent is required." }, { status: 400 });

  const voterKey = `voter:${safeKey(email)}`;

  await kv.hset(voterKey, {
    name,
    email,
    consentSalesforce: "true",
    registeredAt: nowISO()
  });

  // Optional Salesforce Web-to-Lead
  const sfUrl = process.env.SALESFORCE_WEB_TO_LEAD_URL;
  const sfOid = process.env.SALESFORCE_OID;

  if (sfUrl && sfOid) {
    const params = new URLSearchParams();
    params.set("oid", sfOid);
    params.set("last_name", name); // simplest mapping; adjust if you capture first/last separately
    params.set("email", email);
    params.set("lead_source", process.env.SALESFORCE_LEAD_SOURCE || "InEight Championship");

    // TODO: Replace with your actual Salesforce consent field id/api name
    params.set("00N_CONSENT__", "true");

    // Fire-and-forget (don’t block registration if SF is down)
    fetch(sfUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
