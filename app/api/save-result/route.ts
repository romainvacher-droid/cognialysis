import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { session_id, mode, source, big_five, top_ia, top_score, all_scores } = await req.json();

    const [row] = await sql`
      INSERT INTO results (session_id, mode, source, big_five, top_ia, top_score, all_scores)
      VALUES (${session_id}, ${mode}, ${source}, ${JSON.stringify(big_five)}, ${top_ia}, ${top_score}, ${JSON.stringify(all_scores)})
      RETURNING id, created_at
    `;

    return NextResponse.json({ id: row.id, created_at: row.created_at });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
