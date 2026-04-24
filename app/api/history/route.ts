import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("session_id");
  if (!session_id) return NextResponse.json([], { status: 200 });

  try {
    const rows = await sql`
      SELECT id, mode, source, top_ia, top_score, big_five, created_at
      FROM results
      WHERE session_id = ${session_id}
      ORDER BY created_at DESC
      LIMIT 20
    `;
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}
