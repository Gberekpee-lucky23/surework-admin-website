import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payoutRequests } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id, 10);
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
      .set({
        status: "approved",
        reviewedAt: now,
      })
      .where(eq(payoutRequests.id, requestId));

    const referer = request.headers.get("referer") || "/admin/payments?tab=payouts";
    return NextResponse.redirect(new URL(referer, request.url), 303);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
