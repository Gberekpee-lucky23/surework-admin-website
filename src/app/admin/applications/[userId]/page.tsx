import { notFound } from "next/navigation";
import Link from "next/link";
import { getApplicationByUserId } from "@/dal/applications";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatNGN, formatRelativeTime } from "@/lib/utils";
import { ApplicationActions } from "../ApplicationActions";
import ResendGuarantorButton from "./ResendGuarantorButton";
import BankVerificationToggle from "./BankVerificationToggle";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  FileText,
  Image as ImageIcon,
  User,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Building2,
  AlertTriangle,
} from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const app = await getApplicationByUserId(Number(userId));
  return { title: `${app?.userName ?? "Application"} — Surework Admin` };
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          {label}
        </p>
        <div className="text-sm text-slate-900 mt-0.5">{value ?? "—"}</div>
      </div>
    </div>
  );
}

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const app = await getApplicationByUserId(Number(userId));

  if (!app) notFound();

  const guarantorConfirmed = app.guarantor?.confirmationStatus === "confirmed";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/admin/applications"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Applications
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-700 font-medium">{app.userName}</span>
      </div>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start gap-5">
          {app.userProfilePicture ? (
            <img
              src={app.userProfilePicture}
              alt={app.userName}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {app.userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{app.userName}</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Applied for{" "}
                  <strong className="text-slate-700">{app.profession ?? "Handyman"}</strong>
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={app.applicationStatus} />
                {/* Guarantor Status Badge */}
                {app.guarantor ? (
                  app.guarantor.confirmationStatus === "confirmed" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      <ShieldCheck size={13} />
                      Guarantor: Confirmed
                    </span>
                  ) : app.guarantor.confirmationStatus === "declined" ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                      <ShieldAlert size={13} />
                      Guarantor: Declined
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                      <ShieldAlert size={13} />
                      Guarantor: Awaiting Response
                    </span>
                  )
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                    Guarantor: Missing
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                {app.userEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                {app.userPhone}
              </span>
              {(app.userState || app.stateOfOrigin) && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  {[app.lga, app.stateOfOrigin || app.userState].filter(Boolean).join(", ")}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Member since {formatDate(app.userCreatedAt)} &middot;{" "}
              {app.submittedAt
                ? `Applied ${formatRelativeTime(app.submittedAt)}`
                : "Submission date unknown"}
            </p>
          </div>
        </div>
      </div>

      {/* New Trade Requested Flag */}
      {app.otherTradeDescription && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-purple-600 flex-shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-purple-700">
                New Trade Requested
              </p>
              <p className="text-sm font-semibold text-purple-900 mt-0.5">
                "{app.otherTradeDescription}"
              </p>
            </div>
          </div>
          <Link
            href="/admin/categories"
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition-colors flex-shrink-0"
          >
            Manage Categories
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Application Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Personal Information */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User size={16} className="text-slate-400" />
              1. Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={User} label="Surname" value={app.surname} />
              <InfoRow icon={User} label="First Name" value={app.firstName} />
              <InfoRow icon={User} label="Other Name" value={app.otherName} />
              <InfoRow icon={User} label="Gender" value={app.gender ? app.gender.toUpperCase() : null} />
              <InfoRow icon={Calendar} label="Date of Birth" value={app.dateOfBirth} />
              <InfoRow icon={MapPin} label="State of Origin / LGA" value={[app.lga, app.stateOfOrigin].filter(Boolean).join(", ")} />
              <InfoRow icon={Phone} label="Alternative Phone" value={app.alternativePhone} />
              <InfoRow icon={Phone} label="WhatsApp Number" value={app.whatsapp} />
            </div>
          </div>

          {/* 2. Next of Kin */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCheck size={16} className="text-slate-400" />
              2. Next of Kin
            </h2>
            {app.nextOfKin ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow icon={User} label="Full Name" value={app.nextOfKin.name} />
                <InfoRow icon={UserCheck} label="Relationship" value={app.nextOfKin.relationship} />
                <InfoRow icon={Phone} label="Phone Number" value={app.nextOfKin.phone} />
                <InfoRow icon={MapPin} label="Residential Address" value={app.nextOfKin.address} />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No next of kin recorded</p>
            )}
          </div>

          {/* 3. Trade & Experience */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Briefcase size={16} className="text-slate-400" />
              3 & 4. Trade, Experience & Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Briefcase} label="Trades Offered" value={app.profession} />
              <InfoRow icon={Calendar} label="Experience Bracket" value={app.experienceYearsBracket ? `${app.experienceYearsBracket} years` : null} />
              <InfoRow icon={Briefcase} label="Owns Tools" value={app.ownsTools ? "Yes, owns tools" : "No"} />
              <InfoRow icon={Briefcase} label="Major Tools" value={app.majorTools} />
            </div>
            {app.experienceDescription && (
              <div className="pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">
                  Experience & Background
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{app.experienceDescription}</p>
              </div>
            )}
          </div>

          {/* 5. Availability & Coverage */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <MapPin size={16} className="text-slate-400" />
              5 & 6. Availability & Coverage
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={MapPin} label="Preferred Service Areas" value={app.preferredAreas} />
              <InfoRow icon={Briefcase} label="Emergency Call-outs" value={app.acceptsEmergencyJobs ? "Yes, accepts emergency jobs" : "No"} />
              <InfoRow icon={MapPin} label="Can Travel Outside State" value={app.canTravelOutsideState ? "Yes, willing to travel" : "No"} />
            </div>
          </div>

          {/* 8. Bank Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <Building2 size={16} className="text-slate-400" />
                8. Bank Account Details
              </h2>
              {app.bankDetails && (
                <BankVerificationToggle
                  userId={app.userId}
                  initialVerified={app.bankDetails.isVerified}
                />
              )}
            </div>

            {app.bankDetails ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoRow icon={Building2} label="Bank Name" value={app.bankDetails.bankName} />
                <InfoRow icon={User} label="Account Name" value={app.bankDetails.accountName} />
                <InfoRow icon={DollarSign} label="Account Number" value={app.bankDetails.accountNumber} />
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No bank details recorded</p>
            )}
          </div>

          {/* 9. Character References */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <UserCheck size={16} className="text-slate-400" />
              9. Character References (2 Referees)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {app.references.map((ref: any, idx: number) => (
                <div key={ref.id || idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Referee #{ref.refereeNumber || idx + 1}
                  </span>
                  <p className="text-sm font-bold text-slate-900">{ref.name}</p>
                  <p className="text-xs text-slate-600">Occupation: {ref.occupation}</p>
                  <p className="text-xs text-slate-600">Relationship: {ref.relationship}</p>
                  <p className="text-xs text-blue-600 font-medium">Phone: {ref.phone}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 10. Guarantor Details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                <ShieldCheck size={16} className="text-slate-400" />
                10. Guarantor Details & Digital Confirmation
              </h2>
              <ResendGuarantorButton userId={app.userId} />
            </div>

            {app.guarantor ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoRow icon={User} label="Guarantor Full Name" value={app.guarantor.fullName} />
                  <InfoRow icon={Briefcase} label="Occupation" value={app.guarantor.occupation} />
                  <InfoRow icon={Mail} label="Guarantor Email" value={app.guarantor.email} />
                  <InfoRow icon={Phone} label="Phone / WhatsApp" value={`${app.guarantor.phone} ${app.guarantor.whatsapp ? `/ ${app.guarantor.whatsapp}` : ""}`} />
                  <InfoRow icon={UserCheck} label="Relationship & Years" value={`${app.guarantor.relationshipToApplicant} (${app.guarantor.yearsKnown} yrs known)`} />
                  <InfoRow icon={MapPin} label="Residential Address" value={app.guarantor.residentialAddress} />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                      Guarantor Confirmation Status
                    </p>
                    <p className="text-sm font-semibold text-slate-900 mt-0.5">
                      {app.guarantor.confirmationStatus === "confirmed" ? (
                        <span className="text-emerald-600">
                          Confirmed by <strong>{app.guarantor.confirmedSignatureName}</strong> on{" "}
                          {app.guarantor.confirmedAt ? formatDate(app.guarantor.confirmedAt) : "record"}
                        </span>
                      ) : app.guarantor.confirmationStatus === "declined" ? (
                        <span className="text-red-600">Guarantor Declined Endorsement</span>
                      ) : (
                        <span className="text-amber-600">Awaiting Guarantor Digital Signature</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No guarantor details recorded</p>
            )}
          </div>

          {/* Rejection / Approval Banners */}
          {app.applicationStatus === "rejected" && app.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
              <h2 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <FileText size={15} />
                Rejection Reason
              </h2>
              <p className="text-sm text-red-700">{app.rejectionReason}</p>
              {app.reviewedAt && (
                <p className="text-xs text-red-400 mt-2">
                  Reviewed {formatDate(app.reviewedAt)}
                </p>
              )}
            </div>
          )}

          {app.applicationStatus === "approved" && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
              <h2 className="font-semibold text-green-800 mb-1 flex items-center gap-2">
                Application Approved
              </h2>
              {app.reviewedAt && (
                <p className="text-xs text-green-600">
                  Approved {formatDate(app.reviewedAt)}
                </p>
              )}
            </div>
          )}

          {/* Review Actions Component */}
          {app.applicationStatus === "pending" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">
                Review Decision
              </h2>
              <ApplicationActions
                userId={app.userId}
                applicantName={app.userName}
                currentStatus={app.applicationStatus}
                guarantorConfirmed={guarantorConfirmed}
              />
            </div>
          )}
        </div>

        {/* Sidebar Documents & Uploads */}
        <div className="space-y-4">
          {/* ID Document Photo */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <ImageIcon size={15} className="text-slate-400" />
              ID Document Photo ({app.idType?.toUpperCase() || "ID"})
            </h3>
            {app.idDocumentUrl ? (
              <div className="space-y-2">
                <a
                  href={app.idDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={app.idDocumentUrl}
                    alt="ID Document"
                    className="w-full rounded-xl border border-slate-200 object-cover max-h-56 hover:opacity-90 transition-opacity"
                  />
                </a>
                <a
                  href={app.idDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink size={12} />
                  Open full size
                </a>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <ImageIcon size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No ID document uploaded</p>
              </div>
            )}
          </div>

          {/* Certificate */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <FileText size={15} className="text-slate-400" />
              Trade Certificate
            </h3>
            {app.certificateUrl ? (
              <div className="space-y-2">
                <a
                  href={app.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={app.certificateUrl}
                    alt="Certificate"
                    className="w-full rounded-xl border border-slate-200 object-cover max-h-56 hover:opacity-90 transition-opacity"
                  />
                </a>
                <a
                  href={app.certificateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700"
                >
                  <ExternalLink size={12} />
                  Open full size
                </a>
              </div>
            ) : (
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                <FileText size={24} className="text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No certificate uploaded</p>
              </div>
            )}
          </div>

          {/* Portfolio Pictures */}
          {(() => {
            const portfolioUrls = (Array.isArray(app.portfolioPictureUrls)
              ? app.portfolioPictureUrls
              : []) as string[];

            if (portfolioUrls.length === 0) return null;

            return (
              <div className="bg-white rounded-2xl border border-slate-200 p-5">
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <ImageIcon size={15} className="text-slate-400" />
                  Portfolio Work Photos ({portfolioUrls.length})
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {portfolioUrls.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={url}
                        alt={`Portfolio ${idx + 1}`}
                        className="w-full h-24 rounded-lg object-cover border border-slate-200 hover:opacity-90 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
