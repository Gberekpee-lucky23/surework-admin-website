import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";
import nodemailer from "nodemailer";

/**
 * POST /api/contact
 *
 * 1. Validates required fields
 * 2. Persists submission to the `contact_submissions` table (primary guarantee —
 *    the user's message is never lost, even if email delivery fails)
 * 3. Attempts to send a notification email to the support inbox (best-effort)
 * 4. Returns success only after the DB write succeeds
 */
export async function POST(request: Request) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const { name, email, phone, category, subject, message } = body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { success: false, error: "Please fill in all required fields (Name, Email, Message)." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json(
      { success: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  // ── Step 1: Persist to database ─────────────────────────────────────────────
  // This is the primary guarantee — the message is captured before we attempt email.
  let submission: any;
  try {
    const [inserted] = await db
      .insert(contactSubmissions)
      .values({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        category: category?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        emailSent: false,
      })
      .returning();
    submission = inserted;
  } catch (dbError: any) {
    console.error("[Contact] DB insert failed:", dbError.message);
    return NextResponse.json(
      { success: false, error: "We couldn't save your message. Please try again or call us directly." },
      { status: 500 }
    );
  }

  // ── Step 2: Send notification email (best-effort) ───────────────────────────
  // Requires SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL in .env
  // If any env var is missing, we skip email silently (DB write already succeeded).
  let emailSent = false;
  let emailError: string | null = null;

  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const contactToEmail = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

  if (smtpHost && smtpUser && smtpPass && contactToEmail) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: { user: smtpUser, pass: smtpPass },
      });

      const htmlBody = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #34409a; margin-bottom: 4px;">New Contact Form Submission</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 0;">Received via Surework website · #${submission.id}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td style="padding: 8px 0; color: #64748b; width: 120px;"><strong>Name</strong></td><td style="padding: 8px 0; color: #0f172a;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #64748b;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #34409a;">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Phone</strong></td><td style="padding: 8px 0; color: #0f172a;">${phone}</td></tr>` : ""}
            ${category ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Category</strong></td><td style="padding: 8px 0; color: #0f172a;">${category}</td></tr>` : ""}
            ${subject ? `<tr><td style="padding: 8px 0; color: #64748b;"><strong>Subject</strong></td><td style="padding: 8px 0; color: #0f172a;">${subject}</td></tr>` : ""}
          </table>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p style="color: #64748b; font-size: 13px; margin-bottom: 4px;"><strong>Message</strong></p>
          <div style="background: #f8fafc; border-radius: 8px; padding: 16px; color: #0f172a; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px;">Reply directly to ${email} to respond to this inquiry.</p>
        </div>
      `;

      await transporter.sendMail({
        from: `"Surework Website" <${smtpUser}>`,
        to: contactToEmail,
        replyTo: email,
        subject: `[Contact] ${subject || `Message from ${name}`} (#${submission.id})`,
        html: htmlBody,
        text: `New contact submission from ${name} (${email}):\n\n${message}`,
      });

      emailSent = true;
    } catch (err: any) {
      // Email failure is non-fatal — submission is already in DB
      emailError = err.message;
      console.error("[Contact] Email send failed:", emailError);
    }
  } else {
    console.warn(
      "[Contact] SMTP credentials not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL in .env to enable email delivery. Submission saved to DB only."
    );
  }

  // ── Step 3: Update the DB row with email delivery result ────────────────────
  try {
    await db
      .update(contactSubmissions)
      .set({ emailSent, emailError })
      .where((t: any) => t.id === submission.id);
  } catch {
    // Non-fatal — submission is already saved
  }

  return NextResponse.json({
    success: true,
    message:
      "Thank you! Your message has been received by Surework. Our support team will get back to you within 24 hours.",
  });
}
