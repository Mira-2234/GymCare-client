"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ManageClassesPage() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchClasses = () => {
    if (!session?.user?.email) return;
    setLoading(true);

    const statusQuery = filter !== "All" ? `&status=${filter}` : "";

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/classes?email=${session.user.email}${statusQuery}`
    )
      .then((r) => r.json())
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load classes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClasses();
  }, [session, filter]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/classes/${id}/status?email=${session.user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error();
      toast.success(`Class ${status.toLowerCase()}.`);
      fetchClasses();
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const deleteClass = async (id) => {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/classes/${id}?email=${session.user.email}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();
      toast.success("Class deleted.");
      fetchClasses();
    } catch {
      toast.error("Failed to delete class.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#F5F3EF]">Manage Classes</h1>

      <div className="mt-4 flex gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === f
                ? "bg-[#FF5B3C] text-black"
                : "border border-white/10 text-[#9A9CA6] hover:text-[#F5F3EF]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1C1D24] text-[#6B6D78]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Trainer</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[#6B6D78]">
                  Loading...
                </td>
              </tr>
            ) : classes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-[#6B6D78]">
                  No classes found.
                </td>
              </tr>
            ) : (
              classes.map((c) => (
                <tr key={c._id} className="border-t border-white/10 text-[#F5F3EF]">
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3">{c.trainerName}</td>
                  <td className="px-4 py-3">{c.category}</td>
                  <td className="px-4 py-3">${c.price}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        c.status === "Approved"
                          ? "bg-green-500/10 text-green-400"
                          : c.status === "Rejected"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {c.status !== "Approved" && (
                        <button
                          onClick={() => updateStatus(c._id, "Approved")}
                          className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20"
                        >
                          Approve
                        </button>
                      )}
                      {c.status !== "Rejected" && (
                        <button
                          onClick={() => updateStatus(c._id, "Rejected")}
                          className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => deleteClass(c._id)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-[#9A9CA6] hover:text-[#F5F3EF]"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}