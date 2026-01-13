import { NextResponse } from "next/server";
import { getPublicState } from "@/lib/state";

export async function GET() {
  const state = await getPublicState();
  return NextResponse.json(state);
}
