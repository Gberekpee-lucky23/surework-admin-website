import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserById, getUserJobsAsCustomer, getUserJobsAsHandyman } from "@/dal/users";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, formatRelativeTime, formatNGN } from "@/lib/utils";
import { UserActions } from "../UserActions";
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Wrench,
} from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getUserById(Number(id));
  return { title: `${user?.name ?? "User"} — Surework Admin` };
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(Number(id));
  if (!user) notFound();

  const [customerJobs, handymanJobs] = await Promise.all([
    getUserJobsAsCustomer(user.id),
    getUserJobsAsHandyman(user.id),
  ]);

  const isHandyman = user.handymanProfile?.applicationStatus === "approved";

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-2">
        <Link
          href="/admin/users"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft size={14} />
          Users
        </Link>
        <span className="text-slate-300">/</span>
        <span className="text-sm text-slate-700 font-medium">{user.name}</span>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-start gap-5">
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover flex-shrink-0 border border-slate-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                <div className="flex flex-wrap gap-1 mt-1">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                    Customer
                  </span>
                  {isHandyman && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      Handyman
                    </span>
                  )}
                </div>
              </div>
              <StatusBadge status={user.accountStatus} />
            </div>

            <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-slate-400" />
                {user.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone size={13} className="text-slate-400" />
                {user.phone}
              </span>
              {user.state && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400" />
                  {[user.city, user.state].filter(Boolean).join(", ")}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-2">
              Member since {formatDate(user.createdAt)}
            </p>
          </div>
        </div>

        {user.accountStatus === "suspended" && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ This account is suspended. The user cannot log in or use the platform.
              The mobile app backend enforces this server-side.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Jobs as Customer */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase size={16} className="text-slate-400" />
              Jobs as Customer ({customerJobs.length})
            </h2>
            {customerJobs.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                No jobs booked yet
              </p>
            ) : (
              <div className="space-y-2">
                {customerJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/admin/jobs/${job.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                        {job.description?.substring(0, 70)}…
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatRelativeTime(job.createdAt)} ·{" "}
                        {job.address?.substring(0, 40)}
                      </p>
                    </div>
                    <StatusBadge status={job.status} className="flex-shrink-0 ml-3" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Jobs as Handyman */}
          {isHandyman && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Wrench size={16} className="text-slate-400" />
                Jobs as Handyman ({handymanJobs.length})
              </h2>
              {handymanJobs.length === 0 ? (
                <p className="text-sm text-slate-400 py-4 text-center">
                  No jobs completed as handyman yet
                </p>
              ) : (
                <div className="space-y-2">
                  {handymanJobs.map((job) => (
                    <Link
                      key={job.id}
                      href={`/admin/jobs/${job.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                          {job.description?.substring(0, 70)}…
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {formatRelativeTime(job.createdAt)}
                        </p>
                      </div>
                      <StatusBadge status={job.status} className="flex-shrink-0 ml-3" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar: Handyman Profile + Actions */}
        <div className="space-y-4">
          {user.handymanProfile && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-3">
                Handyman Profile
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <StatusBadge status={user.handymanProfile.applicationStatus} />
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Profession</span>
                  <span className="text-slate-900 font-medium">
                    {user.handymanProfile.profession ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Experience</span>
                  <span className="text-slate-900">
                    {user.handymanProfile.yearsOfExperience != null
                      ? `${user.handymanProfile.yearsOfExperience} yrs`
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Starting Price</span>
                  <span className="text-slate-900">
                    {formatNGN(user.handymanProfile.startingPrice)}
                  </span>
                </div>
                {user.handymanProfile.applicationStatus === "pending" && (
                  <div className="pt-2">
                    <Link
                      href={`/admin/applications/${user.id}`}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      → Review Application
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Account Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-3">Account Actions</h3>
            <UserActions
              userId={user.id}
              userName={user.name}
              currentStatus={user.accountStatus}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
