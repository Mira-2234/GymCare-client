"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

const SPECIALTIES = ["Yoga", "Weights", "Cardio", "HIIT", "Pilates", "Cycling", "Boxing"];

function ProfileStrip({ user }) {
  return (
    <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1C1E24] p-5">
      <img
        src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
        alt={user?.name}
        className="h-14 w-14 rounded-full border-2 border-[#FF5B3C]/30 object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#F5F3EF]">{user?.name}</p>
        <p className="truncate text-xs text-[#9A9CA6]">{user?.email}</p>
      </div>
      <span className="shrink-0 rounded-full bg-[#FF5B3C]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-[#FF5B3C]">
        Applicant
      </span>
    </div>
  );
}

export default function ApplyTrainerPage() {
  const { user } = useAuth();

  const [experience, setExperience] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [existingApplication, setExistingApplication] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainer-applications/my?userEmail=${user.email}`)
      .then((r) => r.json())
      .then((data) => {
        setExistingApplication(data.application);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [user?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!experience || !specialty || !bio.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainer-applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name,
          experience: Number(experience),
          specialty,
          bio: bio.trim(),
        }),
      });

      if (res.status === 409) {
        toast.error("You already have a pending application.");
        return;
      }
      if (!res.ok) throw new Error();

      toast.success("Application submitted! Status: Pending.");
      setExistingApplication({ status: "Pending", experience, specialty, bio });
      setExperience("");
      setSpecialty("");
      setBio("");
    } catch {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5B3C]/15 text-xl">
          🏅
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#F5F3EF]">Apply as Trainer</h1>
          <p className="mt-0.5 text-sm text-[#9A9CA6]">
            Tell us about your experience — our team reviews every application.
          </p>
        </div>
      </div>

      <ProfileStrip user={user} />

      {checking ? (
        <div className="mt-6 h-64 animate-pulse rounded-3xl bg-white/5" />
      ) : existingApplication?.status === "Pending" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 rounded-3xl border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.06] to-transparent p-10 text-center"
        >
          <motion.p
            animate={{ rotate: [0, -8, 8, -8, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 1.5 }}
            className="text-4xl"
          >
            ⏳
          </motion.p>
          <p className="mt-4 text-base font-semibold text-[#F5F3EF]">Application Pending</p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-[#9A9CA6]">
            Your application is being reviewed by our team. Check the Overview page for updates.
          </p>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#1C1E24] p-8"
        >
          {existingApplication?.status === "Rejected" && (
            <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400">
              <span className="font-semibold">Your previous application was rejected</span>
              {existingApplication.feedback && (
                <p className="mt-1 text-red-300/80">"{existingApplication.feedback}"</p>
              )}
              <p className="mt-1 text-xs text-red-400/70">You can apply again below.</p>
            </div>
          )}

          {/* Experience */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">
              Years of Experience
            </label>
            <input
              type="number"
              min="0"
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="e.g. 5"
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none transition-colors focus:border-[#FF5B3C]"
            />
          </div>

          {/* Specialty — dropdown */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">
              Specialty
            </label>
            <select
              required
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none transition-colors focus:border-[#FF5B3C]"
            >
              <option value="" disabled>
                Select your specialty
              </option>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Bio / Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">
              Bio / Description
            </label>
            <textarea
              required
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your training background, certifications, and what you'd like to teach..."
              className="resize-none rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none transition-colors focus:border-[#FF5B3C]"
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting}
            className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#FF5B3C] py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
            )}
            {submitting ? "Submitting..." : "Submit Application"}
          </motion.button>
        </motion.form>
      )}
    </div>
  );
}