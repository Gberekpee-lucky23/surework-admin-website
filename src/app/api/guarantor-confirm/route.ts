import { NextResponse } from "next/server";
import { db } from "@/db";
import { handymanGuarantors } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { token, signatureName, action } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Confirmation token is required" }, { status: 400 });
    }

    const [guarantor] = await db
      .select()
      .from(handymanGuarantors)
      .where(eq(handymanGuarantors.confirmationToken, token));

    if (!guarantor) {
      return NextResponse.json({ error: "Invalid or expired confirmation link" }, { status: 404 });
    }

    if (guarantor.confirmationStatus === "confirmed") {
      return NextResponse.json(
        { error: "This guarantor confirmation has already been recorded." },
        { status: 400 }
      );
    }

    if (action === "decline") {
      await db
        .update(handymanGuarantors)
        .set({
          confirmationStatus: "declined",
          confirmedAt: new Date(),
        })
        .where(eq(handymanGuarantors.id, guarantor.id));

      return NextResponse.json({
        message: "Guarantor declaration declined.",
        status: "declined",
      });
    }

    if (!signatureName || typeof signatureName !== "string" || !signatureName.trim()) {
      return NextResponse.json(
        { error: "Please enter your full name as your digital e-signature." },
        { status: 400 }
      );
    }

    await db
      .update(handymanGuarantors)
      .set({
        confirmationStatus: "confirmed",
        confirmedAt: new Date(),
        confirmedSignatureName: signatureName.trim(),
      })
      .where(eq(handymanGuarantors.id, guarantor.id));

    return NextResponse.json({
      message: "Thank you! Your guarantor confirmation has been successfully recorded.",
      status: "confirmed",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
