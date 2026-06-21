"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

const CATEGORIES = ["Yoga", "Weights", "Cardio", "HIIT", "Pilates", "Cycling", "Boxing"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const STATUS_STYLES = {
  Pending: "bg-amber-500/15 text-amber-400",
  Approved: "bg-emerald-500/15 text-emerald-400",
  Rejected: "bg-red-500/15 text-red-400",
};

// ── Update Modal ──────────────────────────────────────────────────────────
function UpdateModal({ cls, onClose, onUpdated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...cls });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${cls._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trainerEmail: user.email,
          name: form.name,
          image: form.image,
          category: form.category,
          difficulty: form.difficulty,
          duration: form.duration,
          schedule: form.schedule,
          price: form.price,
          description: form.description,
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Class updated successfully!");
      onUpdated();
      onClose();
    } catch {
      toast.error("Failed to update class.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-[#1C1E24] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F5F3EF]">Update Class</h2>
          <button onClick={onClose} className="text-[#9A9CA6] hover:text-[#F5F3EF]">✕</button>
        </div>

        <form onSubmit={handleSave} className="mt-5 flex flex-col gap-4">
          <input
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            placeholder="Class Name"
            className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
          <input
            name="image"
            value={form.image || ""}
            onChange={handleChange}
            placeholder="Image URL"
            className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />

          <div className="grid grid-cols-2 gap-3">
            <select
              name="category"
              value={form.category || ""}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              name="difficulty"
              value={form.difficulty || ""}
              onChange={handleChange}
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            >
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              name="duration"
              value={form.duration || ""}
              onChange={handleChange}
              placeholder="Duration"
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            />
            <input
              name="price"
              type="number"
              value={form.price || ""}
              onChange={handleChange}
              placeholder="Price"
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            />
          </div>

          <input
            name="schedule"
            value={form.schedule || ""}
            onChange={handleChange}
            placeholder="Schedule"
            className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />

          <textarea
            name="description"
            rows={3}
            value={form.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="resize-none rounded-xl border border-white/10 bg-[#14151A] px-4 py-2.5 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-medium text-[#9A9CA6] hover:text-[#F5F3EF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-xl bg-[#FF5B3C] py-2.5 text-sm font-semibold text-black disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── View Students Modal ─────────────────────────────────────────────────
function StudentsModal({ classId, className, onClose }) {
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${classId}/attendees`)
      .then((r) => r.json())
      .then((data) => setAttendees(data.attendees || []))
      .catch(() => toast.error("Failed to load students."))
      .finally(() => setLoading(false));
  }, [classId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="max-h-[80vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#1C1E24] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#F5F3EF]">Students — {className}</h2>
          <button onClick={onClose} className="text-[#9A9CA6] hover:text-[#F5F3EF]">✕</button>
        </div>

        <div className="mt-5 space-y-2">
          {loading ? (
            <p className="text-sm text-[#6B6D78]">Loading...</p>
          ) : attendees.length === 0 ? (
            <p className="text-sm text-[#6B6D78]">No students enrolled yet.</p>
          ) : (
            attendees.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#14151A] p-3"
              >
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${s.email}`}
                  alt={s.email}
                  className="h-9 w-9 rounded-full"
                />
                <p className="text-sm text-[#F5F3EF]">{s.email}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────────
export default function MyClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingClass, setEditingClass] = useState(null);
  const [viewingStudents, setViewingStudents] = useState(null);

  const fetchClasses = () => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes/my?trainerEmail=${user.email}`)
      .then((r) => r.json())
      .then((data) => setClasses(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load classes."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClasses();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this class? This cannot be undone.")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${id}?trainerEmail=${user.email}`,
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
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">My Classes</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">Manage the classes you've created.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1C1E24] text-xs uppercase tracking-wide text-[#6B6D78]">
            <tr>
              <th className="px-5 py-3.5 font-medium">Class</th>
              <th className="px-5 py-3.5 font-medium">Category</th>
              <th className="px-5 py-3.5 font-medium">Price</th>
              <th className="px-5 py-3.5 font-medium">Status</th>
              <th className="px-5 py-3.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-[#6B6D78]">Loading...</td></tr>
            ) : classes.length === 0 ? (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-[#6B6D78]">No classes yet. Add one!</td></tr>
            ) : (
              classes.map((c) => (
                <tr key={c._id} className="border-t border-white/10 bg-[#14151A]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={c.image} alt={c.name} className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-semibold text-[#F5F3EF]">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#9A9CA6]">{c.category}</td>
                  <td className="px-5 py-4 text-[#FF5B3C]">${c.price}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[c.status] || "bg-white/10 text-[#9A9CA6]"}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setEditingClass(c)}
                        className="rounded-lg bg-blue-500/15 px-3 py-1.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/25"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setViewingStudents(c)}
                        className="rounded-lg bg-[#FF5B3C]/15 px-3 py-1.5 text-xs font-semibold text-[#FF5B3C] hover:bg-[#FF5B3C]/25"
                      >
                        View Students
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25"
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

      {editingClass && (
        <UpdateModal
          cls={editingClass}
          onClose={() => setEditingClass(null)}
          onUpdated={fetchClasses}
        />
      )}

      {viewingStudents && (
        <StudentsModal
          classId={viewingStudents._id}
          className={viewingStudents.name}
          onClose={() => setViewingStudents(null)}
        />
      )}
    </div>
  );
}