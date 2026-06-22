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
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] || "bg-white/10 text-[#9A9CA6]"
      }`}
    >
      {status}
    </span>
  );
}

export default function AppliedTrainersPage() {
  const { user } = useAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState("All");

  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  const fetchApplications = () => {
    if (!user?.email) return;

    setLoading(true);

    const statusQuery =
      filter !== "All"
        ? `&status=${filter}`
        : "";

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainer-applications?email=${user.email}${statusQuery}`
    )
      .then((r) => r.json())
      .then((data) =>
        setApplications(
          Array.isArray(data)
            ? data
            : []
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, [user, filter]);

  const updateStatus = async (
    id,
    status,
    feedback = ""
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainer-applications/${id}?email=${user.email}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            status,
            feedback,
          }),
        }
      );

      if (!res.ok) throw new Error();

      toast.success(
        `Application ${status}`
      );

      setOpen(false);
      setShowReject(false);
      setReason("");

      fetchApplications();
    } catch {
      toast.error(
        "Update failed"
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl">

      <h1 className="text-xl font-bold text-[#F5F3EF]">
        Applied Trainers
      </h1>

      <p className="mt-1 text-sm text-[#9A9CA6]">
        Review and approve trainer applications.
      </p>

      <div className="mt-4 flex gap-2">
        {[
          "All",
          "Pending",
          "Approved",
          "Rejected",
        ].map((f) => (
          <button
            key={f}
            onClick={() =>
              setFilter(f)
            }
            className={`rounded-lg px-4 py-2 text-sm ${
              filter === f
                ? "bg-[#FF5B3C] text-white"
                : "border border-white/10 text-[#9A9CA6]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">

        {loading ? (
          <p>Loading...</p>
        ) : applications.length === 0 ? (
          <p>No applications</p>
        ) : (
          applications.map(
            (app) => (

              <div
                key={app._id}
                className="rounded-2xl border border-white/10 bg-[#1C1E24] p-6"
              >

                <div className="flex items-start justify-between">

                  <div className="flex gap-3">

                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${app.userName}`}
                      className="h-11 w-11 rounded-full"
                    />

                    <div>

                      <h3 className="font-semibold text-[#F5F3EF]">
                        {app.userName}
                      </h3>

                      <p className="text-sm text-[#9A9CA6]">
                        {app.userEmail}
                      </p>

                    </div>

                  </div>

                  <ApplicationStatusBadge
                    status={
                      app.status
                    }
                  />

                </div>

                <button
                  onClick={() => {
                    setSelected(
                      app
                    );
                    setOpen(
                      true
                    );
                  }}
                  className="mt-5 rounded-xl bg-[#FF5B3C]/10 px-5 py-2 text-sm text-[#FF5B3C]"
                >
                  View Details
                </button>

              </div>

            )
          )
        )}

      </div>

      {open && selected && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5">

          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#1C1E24] p-7">

            <div className="flex justify-between">

              <h2 className="text-xl font-bold text-white">
                Trainer Details
              </h2>

              <button
                onClick={() =>
                  setOpen(false)
                }
                className="text-white"
              >
                ✕
              </button>

            </div>

            <div className="mt-6 space-y-4 text-sm">

              <p className="text-[#F5F3EF]">
                Name:
                {" "}
                {selected.userName}
              </p>

              <p className="text-[#F5F3EF]">
                Email:
                {" "}
                {selected.userEmail}
              </p>

              <p className="text-[#F5F3EF]">
                Specialty:
                {" "}
                {selected.specialty}
              </p>

              <p className="text-[#F5F3EF]">
                Experience:
                {" "}
                {selected.experience}
              </p>

              <p className="text-[#9A9CA6]">
                {selected.bio}
              </p>

            </div>

            {selected.status ===
              "Pending" && (

              <>

                {showReject && (

                  <textarea
                    rows={4}
                    value={reason}
                    onChange={(e)=>
                      setReason(
                        e.target.value
                      )
                    }
                    placeholder="Write rejection reason..."
                    className="mt-5 w-full rounded-xl border border-white/10 bg-[#14151A] p-3 text-white"
                  />

                )}

                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() =>
                      updateStatus(
                        selected._id,
                        "Approved"
                      )
                    }
                    className="rounded-xl bg-green-500/10 px-5 py-3 text-green-400"
                  >
                    Approve
                  </button>

                  {!showReject ? (

                    <button
                      onClick={() =>
                        setShowReject(
                          true
                        )
                      }
                      className="rounded-xl bg-red-500/10 px-4 py-3 text-red-400"
                    >
                      Reject
                    </button>

                  ) : (

                    <button
                      disabled={
                        !reason.trim()
                      }
                      onClick={() =>
                        updateStatus(
                          selected._id,
                          "Rejected",
                          reason
                        )
                      }
                      className="rounded-xl bg-red-500 px-4 py-3 text-white"
                    >
                      Reject Application
                    </button>

                  )}

                </div>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}