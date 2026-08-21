import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { updateSetting, getSetting } from "@/dal/settings";

const EDITABLE_KEYS = [
  "labor_commission_rate",
  "materials_fee_recovery_rate",
  "max_quote_revisions",
  "confirmation_window_hours",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key } = await params;
  const body = await request.json();
  const { value } = body;

  if (!EDITABLE_KEYS.includes(key)) {
    return NextResponse.json({ error: `Setting '${key}' is not editable.` }, { status: 400 });
  }

  if (value === undefined || value === null || value === "") {
    return NextResponse.json({ error: "value is required." }, { status: 400 });
  }

  // Validate numeric values
  const parsed = parseFloat(String(value));
  if (isNaN(parsed) || parsed < 0) {
    return NextResponse.json({ error: "Value must be a non-negative number." }, { status: 400 });
  }

  if (["labor_commission_rate", "materials_fee_recovery_rate"].includes(key) && parsed > 1) {
    return NextResponse.json({ error: "Rate must be between 0 and 1." }, { status: 400 });
  }

  const existing = await getSetting(key);
  if (!existing) {
    return NextResponse.json({ error: `Setting '${key}' not found.` }, { status: 404 });
  }

  const updated = await updateSetting(key, String(value));
  return NextResponse.json(updated);
}
