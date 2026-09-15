import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { payments, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-surework-production.up.railway.app";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const reference = String(body.reference || "").trim();

    if (!reference) {
      return NextResponse.json({ error: "Payment reference is required" }, { status: 400 });
    }

    // Call backend authoritative reconcilePayment endpoint
    const res = await fetch(`${BACKEND_URL}/api/payments/admin/reconcile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-request": "true",
      },
      body: JSON.stringify({
        reference,
        adminId: session.id,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to reconcile payment on backend server" },
        { status: res.status }
      );
    }

    // Record admin audit log in database
    try {
      const [pmt] = await db
        .select({ id: payments.id, jobId: payments.jobId, amount: payments.amount })
        .from(payments)
        .where(eq(payments.gatewayReference, reference));

      await db.insert(auditLogs).values({
        adminId: session.id,
        action: "manual_payment_reconciliation",
        targetType: "payment",
        targetId: pmt?.id || null,
        metadata: {
          reference,
          jobId: pmt?.jobId || null,
          adminName: session.name,
          adminEmail: session.email,
          result: data,
        },
      });
    } catch (auditErr: any) {
      console.warn("[AdminReconcile] Could not record audit log:", auditErr.message);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
