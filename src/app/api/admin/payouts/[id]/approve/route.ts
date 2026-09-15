import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payoutRequests } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/session";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const requestId = parseInt(id, 10);
    if (isNaN(requestId)) {
      return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
    }

    const now = new Date();

    const [req] = await db.select().from(payoutRequests).where(eq(payoutRequests.id, requestId));
    if (!req) {
      return NextResponse.json({ error: "Payout request not found" }, { status: 404 });
    }

    if (req.status !== "pending") {
      return NextResponse.json({ error: `Request cannot be approved from status '${req.status}'` }, { status: 400 });
    }

    await db
      .update(payoutRequests)
      .set({ status: "approved", reviewedAt: now })
      .where(eq(payoutRequests.id, requestId));

    return NextResponse.json({ success: true, message: "Payout request approved." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

