export default function UsersTable({
  users,
  loading,
  updatingUserId,
  onBlockChange,
}: {
  users: any[];
  loading: boolean;
  updatingUserId?: number | null;
  onBlockChange?: (userId: number, shouldBlock: boolean) => void;
}) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <div className="w-8 h-8 border-4 border-brandRed/20 border-t-brandRed rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brandGray animate-pulse">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border-collapse">
        <thead>
          <tr className="admin-table-head">
            <th className="admin-th text-left">Name</th>
            <th className="admin-th text-left">Email</th>
            <th className="admin-th text-left">Phone</th>
            <th className="admin-th text-center">Role</th>
            <th className="admin-th text-center">Verified</th>
            <th className="admin-th text-center">Status</th>
            <th className="admin-th text-center">Failed</th>
            <th className="admin-th text-left">Joined</th>
            <th className="admin-th text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="admin-row group">
              <td className="p-4 font-semibold text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-white/10 text-white flex items-center justify-center text-xs font-black uppercase group-hover:bg-brandRed transition-colors">
                    {(u.name || u.email || "U")[0]}
                  </div>
                  {u.name || u.email?.split("@")[0] || u.phone || "User"}
                </div>
              </td>

              <td className="p-4 text-zinc-400">{u.email || "-"}</td>
              <td className="p-4 text-zinc-400">{u.phone || "-"}</td>

              <td className="p-4 text-center">
                <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md ${
                  String(u.role).toUpperCase() === "ADMIN"
                    ? "bg-brandRed text-white"
                    : "bg-white/5 text-zinc-400"
                }`}>
                  {u.role}
                </span>
              </td>

              <td className="p-4 text-center">
                {u.isVerified ? (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-green-950/20 text-green-400 text-[10px] font-black">
                    ✓
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-brandRed/10 text-brandRed text-[10px] font-black">
                    ×
                  </span>
                )}
              </td>

              <td className="p-4 text-center">
                <span className={`inline-flex rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${
                  u.isBlocked
                    ? "bg-brandRed/15 text-brandRed"
                    : "bg-emerald-950/20 text-emerald-400"
                }`}>
                  {u.isBlocked ? "Blocked" : "Active"}
                </span>
              </td>

              <td className="p-4 text-center text-zinc-400 font-black">
                {u.failedLoginAttempts || 0}/5
              </td>

              <td className="p-4 text-zinc-400 font-medium">
                {new Date(u.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>

              <td className="p-4 text-right">
                <button
                  type="button"
                  disabled={!onBlockChange || updatingUserId === u.id || String(u.role).toUpperCase() === "ADMIN"}
                  onClick={() => onBlockChange?.(u.id, !u.isBlocked)}
                  className={`inline-flex items-center rounded-md px-3 py-2 text-[10px] font-black uppercase tracking-widest transition-all disabled:cursor-not-allowed disabled:opacity-40 ${
                    u.isBlocked
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "border border-brandRed/30 text-brandRed hover:bg-brandRed hover:text-white"
                  }`}
                >
                  {String(u.role).toUpperCase() === "ADMIN" ? "Admin" : u.isBlocked ? "Unblock" : "Block"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
