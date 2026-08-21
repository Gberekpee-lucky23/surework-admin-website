import Link from "next/link";
import { getUsers, type UserFilter } from "@/dal/users";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatRelativeTime } from "@/lib/utils";
import { Users as UsersIcon, Search, ChevronRight } from "lucide-react";

export const metadata = { title: "Users — Surework Admin" };

const FILTERS: { label: string; value: string }[] = [
  { label: "All Users", value: "all" },
  { label: "Customers", value: "customer" },
  { label: "Handymen", value: "handyman" },
  { label: "Suspended", value: "suspended" },
];

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const filter = (params.filter as UserFilter) ?? "all";
  const search = params.search ?? "";
  const page = Number(params.page ?? 1);

  const { users, total, totalPages } = await getUsers(filter, page, 25, search);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage all platform users
          </p>
        </div>
        <span className="text-sm text-slate-500">{total.toLocaleString()} users</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {FILTERS.map(({ label, value }) => (
            <Link
              key={value}
              href={`/admin/users?filter=${value}&page=1`}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <form className="flex-1 max-w-xs">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              name="search"
              defaultValue={search}
              placeholder="Search name or email…"
              className="w-full pl-8 pr-4 py-2 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input type="hidden" name="filter" value={filter} />
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <UsersIcon size={40} className="mb-3 opacity-40" />
            <p className="font-medium">No users found</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => {
                const isHandyman = user.handymanStatus === "approved";
                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.profilePictureUrl ? (
                          <img
                            src={user.profilePictureUrl}
                            alt={user.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-500 flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          Customer
                        </span>
                        {isHandyman && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            Handyman
                          </span>
                        )}
                        {user.handymanStatus === "pending" && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Applied
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {[user.city, user.state].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={user.accountStatus} />
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {formatRelativeTime(user.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium ml-auto w-fit"
                      >
                        View <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} ({total.toLocaleString()} results)
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/users?filter=${filter}&search=${search}&page=${page - 1}`}
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Previous
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/users?filter=${filter}&search=${search}&page=${page + 1}`}
                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
