import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid payload." }, { status: 400 });

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const consentSalesforce = Boolean(body.consentSalesforce);

  if (!name) return NextResponse.json({ error: "Name is required." }, { status: 400 });
  if (!email.includes("@")) return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  if (!consentSalesforce) return NextResponse.json({ error: "Consent is required." }, { status: 400 });

  // Optional Salesforce Web-to-Lead
  const sfUrl = process.env.SALESFORCE_WEB_TO_LEAD_URL;
  const sfOid = process.env.SALESFORCE_OID;

  if (sfUrl && sfOid) {
    const params = new URLSearchParams();
    params.set("oid", sfOid);
    params.set("last_name", name);
    params.set("email", email);
    params.set("lead_source", process.env.SALESFORCE_LEAD_SOURCE || "InEight Championship");
    params.set("00N_CONSENT__", "true"); // replace with your SF consent field

    await fetch(sfUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
