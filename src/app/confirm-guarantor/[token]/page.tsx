import { db } from "@/db";
import { handymanGuarantors, handymanProfiles, users, categories } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import GuarantorForm from "./GuarantorForm";
import { CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Guarantor Confirmation — Port Harcourt Handyman Services",
  description: "Official digital guarantor confirmation form for Port Harcourt Handyman Services artisan registration.",
};

export default async function GuarantorConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const [guarantor] = await db
    .select()
    .from(handymanGuarantors)
    .where(eq(handymanGuarantors.confirmationToken, token));

  if (!guarantor) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid Link</h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            This guarantor confirmation link is invalid or has expired. Please contact the applicant to send a new link.
          </p>
        </div>
      </div>
    );
  }

  const isExpired = guarantor.tokenExpiresAt && new Date() > guarantor.tokenExpiresAt;

  // Fetch applicant details
  const [applicant] = await db.select().from(users).where(eq(users.id, guarantor.handymanId));
  const [profile] = await db
    .select()
    .from(handymanProfiles)
    .where(eq(handymanProfiles.userId, guarantor.handymanId));

  let tradesList = profile?.profession || "Artisan Services";
  if (profile?.selectedCategoryIds && Array.isArray(profile.selectedCategoryIds)) {
    const catIds = (profile.selectedCategoryIds as number[]).map(Number);
    if (catIds.length > 0) {
      const catRows = await db
        .select({ name: categories.name })
        .from(categories)
        .where(inArray(categories.id, catIds));
      if (catRows.length > 0) {
        tradesList = catRows.map((c) => c.name).join(", ");
      }
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck size={16} />
            Port Harcourt Handyman Services
          </div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Artisan Guarantor Confirmation
          </h1>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            Official digital verification portal for artisan registration endorsement.
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-6 border-b border-slate-100">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Applicant Name
              </p>
              <p className="text-base font-bold text-slate-900 mt-1">
                {applicant?.name || "Applicant"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Trade / Specialization
              </p>
              <p className="text-base font-semibold text-blue-600 mt-1">{tradesList}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Nominated Guarantor
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">{guarantor.fullName}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Relationship
              </p>
              <p className="text-sm font-medium text-slate-800 mt-1">
                {guarantor.relationshipToApplicant} ({guarantor.yearsKnown} years known)
              </p>
            </div>
          </div>

          {/* Declaration Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Official Guarantor Declaration
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
              "I hereby stand as Guarantor for the above-named applicant who is applying to Port Harcourt Handyman Services as a registered Artisan. I confirm that I know the applicant personally and that the information provided is true to the best of my knowledge. I understand I may be contacted for verification, and I endorse their application."
            </p>
          </div>

          {guarantor.confirmationStatus === "confirmed" ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">Guarantor Endorsement Confirmed</h3>
              <p className="text-xs text-emerald-700">
                Confirmed by <strong>{guarantor.confirmedSignatureName}</strong> on{" "}
                {guarantor.confirmedAt ? new Date(guarantor.confirmedAt).toLocaleDateString("en-NG", { dateStyle: "medium" }) : "record"}.
              </p>
            </div>
          ) : guarantor.confirmationStatus === "declined" ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-red-900">Declaration Declined</h3>
              <p className="text-xs text-red-700">
                You have declined to stand as guarantor for this applicant.
              </p>
            </div>
          ) : isExpired ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center space-y-2">
              <div className="w-12 h-12 bg-amber-500 text-white rounded-full flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-lg font-bold text-amber-900">Confirmation Link Expired</h3>
              <p className="text-xs text-amber-700">
                This 14-day confirmation link has expired. Please ask the applicant to trigger a resend.
              </p>
            </div>
          ) : (
            <GuarantorForm token={token} defaultName={guarantor.fullName} />
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Port Harcourt Handyman Services &middot; SureWork Platform
        </p>
      </div>
    </div>
  );
}
