import { NextRequest, NextResponse } from "next/server";
import { buildProfile } from "@/services/ai/profile_builder_service";
import { RawInput } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: RawInput = await req.json();
    const profile = await buildProfile(body);
    return NextResponse.json(profile);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
