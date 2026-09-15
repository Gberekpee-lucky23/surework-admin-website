import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_APP_URL ||
  "https://backend-surework-production.up.railway.app";


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

    const adminSecret = process.env.ADMIN_INTERNAL_SECRET;
    if (!adminSecret) {
      return NextResponse.json({ error: "Admin internal secret not configured" }, { status: 500 });
    }

    // Call backend to trigger the Paystack transfer
    const res = await fetch(`${BACKEND_URL}/api/payouts/requests/${requestId}/initiate-transfer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": adminSecret,
      },
      body: JSON.stringify({ adminId: session.id }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || "Failed to initiate transfer" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

