"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

const ROLE_STYLES = {
  admin: "bg-[#FF5B3C]/15 text-[#FF5B3C]",
  trainer: "bg-blue-500/15 text-blue-400",
  user: "bg-emerald-500/15 text-emerald-400",
};

const ROLE_OPTIONS = ["user", "trainer", "admin"];

export default function ManageUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = () => {
    if (!user?.email) return;
    setLoading(true);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?email=${user.email}`)
      .then((r) => r.json())
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load users."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const changeRole = async (id, newRole, currentRole) => {
    if (newRole === currentRole) return;

    setUpdatingId(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/role?email=${user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) throw new Error();

      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      toast.success(`Role updated to ${newRole}.`);
    } catch {
      toast.error("Failed to update role.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleBlock = async (id, currentStatus) => {
    const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/status?email=${user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!res.ok) throw new Error();
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u))
      );
      toast.success(`User ${newStatus.toLowerCase()}.`);
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">Manage Users</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">View and manage all registered users.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1C1E24] text-xs uppercase tracking-wide text-[#6B6D78]">
            <tr>
              <th className="px-5 py-3.5 font-medium">User</th>
              <th className="px-5 py-3.5 font-medium">Role</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[#6B6D78]">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[#6B6D78]">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const status = u.status || "Active";
                const currentRole = u.role || "user";

                return (
                  <tr key={u._id} className="border-t border-white/10 bg-[#14151A]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.image || `https://api.dicebear.com/7.x/initials/svg?seed=${u.name}`}
                          alt={u.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-[#F5F3EF]">{u.name}</p>
                          <p className="text-xs text-[#9A9CA6]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={currentRole}
                          disabled={updatingId === u._id}
                          onChange={(e) => changeRole(u._id, e.target.value, currentRole)}
                          className={`cursor-pointer appearance-none rounded-full border-0 px-3 py-1 pr-7 text-xs font-medium capitalize outline-none disabled:opacity-50 ${
                            ROLE_STYLES[currentRole] || ROLE_STYLES.user
                          }`}
                        >
                          {ROLE_OPTIONS.map((role) => (
                            <option key={role} value={role} className="bg-[#1C1E24] text-[#F5F3EF]">
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </option>
                          ))}
                        </select>
                        <svg
                          className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          status === "Blocked"
                            ? "bg-red-500/15 text-red-400"
                            : "bg-emerald-500/15 text-emerald-400"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button
                        onClick={() => toggleBlock(u._id, status)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          status === "Blocked"
                            ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                            : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                        }`}
                      >
                        {status === "Blocked" ? "Unblock" : "Block"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}