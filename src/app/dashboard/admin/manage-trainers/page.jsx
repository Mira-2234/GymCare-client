"use client";

import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function TableSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
      ))}
    </div>
  );
}

export default function ManageTrainersPage() {
  const { data: session } = useSession();

  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demotingId, setDemotingId] = useState(null);

  // Custom Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    trainerId: null,
    trainerName: "",
  });

  useEffect(() => {
    if (!session?.user?.email) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainers?email=${session.user.email}`)
      .then((r) => r.json())
      .then((data) => {
        setTrainers(data?.trainers || []);
      })
      .catch((err) => {
        console.error("Failed to fetch trainers:", err);
        setTrainers([]);
      })
      .finally(() => setLoading(false));
  }, [session]);

  // Triggers when the user clicks "Demote to User"
  const initiateDemote = (trainerId, trainerName) => {
    setConfirmModal({
      isOpen: true,
      trainerId,
      trainerName,
    });
  };

  // Triggers when the user clicks "Confirm" in the custom modal
  const handleDemote = async () => {
    const { trainerId, trainerName } = confirmModal;
    
    // Close modal immediately
    setConfirmModal({ isOpen: false, trainerId: null, trainerName: "" });
    setDemotingId(trainerId);

    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/trainers/${trainerId}/demote?email=${session.user.email}`,
        { method: "PATCH" }
      );

      setTrainers((prev) => prev.filter((t) => t._id !== trainerId));
      toast.success(`${trainerName} demoted to regular user.`);
    } catch (err) {
      console.error("Demote trainer error:", err);
      toast.error("Failed to demote trainer.");
    } finally {
      setDemotingId(null);
    }
  };

  return (
    <div className="relative">
      
      {/* ─── Custom Dark Confirmation Modal (Matches image_263f03.png) ─── */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1C1E24] p-6 shadow-2xl text-left"
            >
              <p className="text-sm font-medium text-[#F5F3EF] leading-relaxed">
                Remove trainer role from <span className="font-bold text-[#FF5B3C]">"{confirmModal.trainerName}"</span>? They will become a regular user.
              </p>
              
              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={handleDemote}
                  className="flex-1 rounded-xl bg-red-500/10 border border-red-500/20 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
                >
                  Confirm
                </button>
                <button
                  onClick={() => setConfirmModal({ isOpen: false, trainerId: null, trainerName: "" })}
                  className="flex-1 rounded-xl bg-white/5 border border-white/5 py-2.5 text-xs font-medium text-[#9A9CA6] hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <h1 className="text-2xl font-bold text-[#F5F3EF]">Manage Trainers</h1>

      <p className="mt-1 text-sm text-[#9A9CA6]">
        All currently active trainers — {trainers?.length || 0} total.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#1C1D24]">
        {loading ? (
          <TableSkeleton />
        ) : trainers.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#9A9CA6]">
            No active trainers yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-[#6B6D78]">
                  <th className="px-5 py-3">Trainer</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {trainers.map((trainer) => (
                  <tr
                    key={trainer._id}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            trainer.image ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${trainer.name}`
                          }
                          alt={trainer.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <span className="font-semibold text-[#F5F3EF]">
                          {trainer.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-[#9A9CA6]">
                      {trainer.email}
                    </td>

                    <td className="px-5 py-4 text-[#9A9CA6]">
                      {trainer.createdAt
                        ? new Date(trainer.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => initiateDemote(trainer._id, trainer.name)}
                        disabled={demotingId === trainer._id}
                        className="rounded-lg bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-400/20 disabled:opacity-50"
                      >
                        {demotingId === trainer._id
                          ? "Demoting..."
                          : "Demote to User"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}