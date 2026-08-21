import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payoutRequests, handymanBankDetails } from "@/db/schema";
import { eq } from "drizzle-orm";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id, 10);

    // Call backend endpoint to trigger Paystack transfer
    const res = await fetch(`${BACKEND_URL}/api/payouts/requests/${requestId}/initiate-transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Admin token or system header
        "x-admin-request": "true",
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to initiate transfer" }, { status: res.status });
    }

    const referer = request.headers.get("referer") || "/admin/payments?tab=payouts";
    return NextResponse.redirect(new URL(referer, request.url), 303);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
