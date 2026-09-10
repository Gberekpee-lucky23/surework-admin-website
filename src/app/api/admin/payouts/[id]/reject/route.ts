import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.surework.ng";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const requestId = parseInt(id, 10);

    let reason = "Rejected by admin.";
    try {
      const formData = await request.formData();
      const reasonVal = formData.get("reason");
      if (reasonVal) reason = String(reasonVal);
    } catch {
      try {
        const body = await request.json();
        if (body.reason) reason = body.reason;
      } catch {
        // use default reason
      }
    }

    const res = await fetch(`${BACKEND_URL}/api/payouts/requests/${requestId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-request": "true",
      },
      body: JSON.stringify({ reason }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Failed to reject payout request" }, { status: res.status });
    }

    const referer = request.headers.get("referer") || "/admin/payments?tab=payouts";
    return NextResponse.redirect(new URL(referer, request.url), 303);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
