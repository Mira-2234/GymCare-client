"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

function ApplicationStatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/15 text-amber-400",
    Approved: "bg-emerald-500/15 text-emerald-400",
    Rejected: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] || "bg-white/10 text-[#9A9CA6]"}`}>
      {status}
    </span>
  );
}

export default function AppliedTrainersPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchApplications = () => {
    if (!user?.email) return;
    setLoading(true);

    const statusQuery = filter !== "All" ? `&status=${filter}` : "";

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainer-applications?email=${user.email}${statusQuery}`
    )
      .then((r) => r.json())
      .then((data) => setApplications(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load applications."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, [user, filter]);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainer-applications/${id}?email=${user.email}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) throw new Error();
      toast.success(`Application ${status.toLowerCase()}.`);
      fetchApplications();
    } catch {
      toast.error("Failed to update application.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">Applied Trainers</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">Review and approve trainer applications.</p>

      <div className="mt-4 flex gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === f
                ? "bg-[#FF5B3C] text-white"
                : "border border-white/10 text-[#9A9CA6] hover:text-[#F5F3EF]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-[#6B6D78]">Loading...</p>
        ) : applications.length === 0 ? (
          <p className="text-[#6B6D78]">No applications found.</p>
        ) : (
          applications.map((app) => (
            <div
              key={app._id}
              className="rounded-2xl border border-white/10 bg-[#1C1E24] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.userName}`}
                    alt={app.userName}
                    className="h-11 w-11 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-[#F5F3EF]">{app.userName}</h3>
                    <p className="text-sm text-[#9A9CA6]">{app.userEmail}</p>
                    <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-[#9A9CA6]">
                      <p>Specialty: <span className="text-[#F5F3EF]">{app.specialty}</span></p>
                      <p>Experience: <span className="text-[#F5F3EF]">{app.experience} years</span></p>
                    </div>
                    {app.bio && (
                      <p className="mt-3 max-w-md text-xs leading-relaxed text-[#9A9CA6]">
                        {app.bio}
                      </p>
                    )}
                  </div>
                </div>
                <ApplicationStatusBadge status={app.status} />
              </div>

              {app.status === "Pending" && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => updateStatus(app._id, "Approved")}
                    className="rounded-lg bg-green-500/10 px-4 py-2 text-xs font-medium text-green-400 hover:bg-green-500/20"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updateStatus(app._id, "Rejected")}
                    className="rounded-lg bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400 hover:bg-red-500/20"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}