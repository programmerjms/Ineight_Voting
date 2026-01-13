# InEight Championship Voting (Vercel-ready)

This is a Next.js (App Router) project that matches the provided bracket/voting layout and enforces:
- Registration with Name + Email
- Required consent to share info with Salesforce
- One vote per matchup per email

## Local dev (npm)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` from `.env.example` and fill in values
3. Run:
   ```bash
   npm run dev
   ```

## Deploy on Vercel
1. Push this repo to GitHub
2. Import to Vercel
3. Add Environment Variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`
   - `NEXT_PUBLIC_VOTING_STATUS` ("open" or "closed")
   - `NEXT_PUBLIC_NEXT_VOTING_START_ISO`
   - Optional Salesforce Web-to-Lead:
     - `SALESFORCE_WEB_TO_LEAD_URL`
     - `SALESFORCE_OID`
     - `SALESFORCE_LEAD_SOURCE`

## Salesforce note
In `app/api/register/route.ts` replace `00N_CONSENT__` with your actual Salesforce consent field id/api name.
