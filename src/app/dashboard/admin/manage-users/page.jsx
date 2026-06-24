"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

const ROLE_STYLES = {
  admin: "bg-[#FF5B3C]/15 text-[#FF5B3C]",
  trainer: "bg-blue-500/15 text-blue-400",
  user: "bg-white/5 text-[#9A9CA6]",
};

function confirmAction(message, onConfirm) {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-[#F5F3EF]">{message}</p>
        <div className="flex gap-2">
          <button
            onClick={() => { toast.dismiss(t.id); onConfirm(); }}
            className="flex-1 rounded-lg bg-[#FF5B3C]/20 py-1.5 text-xs font-semibold text-[#FF5B3C] hover:bg-[#FF5B3C]/30"
          >
            Confirm
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 rounded-lg bg-white/10 py-1.5 text-xs font-semibold text-[#9A9CA6] hover:bg-white/15"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        background: "#1C1E24",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        padding: "16px",
        minWidth: "220px",
      },
    }
  );
}

export default function ManageUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleRoleChange = async (id, role, name) => {
    confirmAction(`Make "${name}" an Admin?`, async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${id}/role?email=${user.email}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
          }
        );
        if (!res.ok) throw new Error();
        toast.success(`Role updated to ${role}.`);
        fetchUsers();
      } catch {
        toast.error("Failed to update role.");
      }
    });
  };

  const handleStatusToggle = async (id, currentStatus, name) => {
    const newStatus = currentStatus === "Blocked" ? "Active" : "Blocked";
    const message = newStatus === "Blocked"
      ? `Block "${name}"? They won't be able to book, comment, or apply.`
      : `Unblock "${name}"?`;

    confirmAction(message, async () => {
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
        toast.success(`User ${newStatus === "Blocked" ? "blocked" : "unblocked"}.`);
        fetchUsers();
      } catch {
        toast.error("Failed to update status.");
      }
    });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">Manage Users</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">
        View and manage all registered users — {users.length} total.
      </p>

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
                const isCurrentAdmin = u._id === user?.id;

                return (
                  <tr key={u._id} className="border-t border-white/10 bg-[#14151A]">
                    {/* User */}
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

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${ROLE_STYLES[u.role] || ROLE_STYLES.user}`}>
                        {u.role || "user"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                        status === "Blocked"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-emerald-500/15 text-emerald-400"
                      }`}>
                        {status}
                      </span>
                    </td>

                    
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        
                        {!isCurrentAdmin && (
                          <button
                            onClick={() => handleStatusToggle(u._id, status, u.name)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                              status === "Blocked"
                                ? "bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                                : "bg-red-500/15 text-red-400 hover:bg-red-500/25"
                            }`}
                          >
                            {status === "Blocked" ? "Unblock" : "Block"}
                          </button>
                        )}

                       
                        {u.role === "user" && !isCurrentAdmin && (
                          <button
                            onClick={() => handleRoleChange(u._id, "admin", u.name)}
                            className="rounded-lg bg-[#FF5B3C]/15 px-3 py-1.5 text-xs font-semibold text-[#FF5B3C] hover:bg-[#FF5B3C]/25"
                          >
                            Make Admin
                          </button>
                        )}
                      </div>
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