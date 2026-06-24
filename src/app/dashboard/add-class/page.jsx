"use client";

import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import toast from "react-hot-toast";

const CATEGORIES  = ["Yoga", "Weights", "Cardio", "HIIT", "Pilates", "Cycling", "Boxing"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

export default function AddClassPage() {
  const { user } = useAuth();

  const [imageFile,  setImageFile]  = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading,  setUploading]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "", category: "", difficulty: "",
    duration: "", schedule: "", price: "", description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB.");
      return;
    }
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, category, difficulty, duration, schedule, price, description } = form;

    if (!name || !category || !difficulty || !duration || !schedule || !price || !description) {
      toast.error("Please fill in all fields.");
      return;
    }
    
    if (!imageFile) {
      toast.error("Please upload a class image.");
      return;
    }

    setSubmitting(true);

    
    let imageUrl = "";
    try {
      setUploading(true);
      imageUrl = await uploadToCloudinary(imageFile);
      setUploading(false);
    } catch (err) {
      toast.error(err.message || "Image upload failed. Try again.");
      setUploading(false);
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/classes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          image: imageUrl, 
          trainerName:  user.name,
          trainerEmail: user.email,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Class submitted! Pending admin review.");
      setForm({ name: "", category: "", difficulty: "", duration: "", schedule: "", price: "", description: "" });
      setImageFile(null);
      setPreviewUrl("");
    } catch {
      toast.error("Failed to submit class. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5B3C]/15 text-xl">
          ➕
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#F5F3EF]">Add New Class</h1>
          <p className="mt-0.5 text-sm text-[#9A9CA6]">
            New classes will be reviewed by admin before going live.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-5 rounded-3xl border border-white/10 bg-[#1C1E24] p-8"
      >
        {/* Class Name */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Class Name</label>
          <input
            type="text" name="name" value={form.name} onChange={handleChange}
            placeholder="e.g. Power Yoga Flow"
            className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Image</label>
          <label
            htmlFor="class-image-upload"
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#FF5B3C]/30 bg-[#FF5B3C]/[0.03] p-4 transition-colors hover:border-[#FF5B3C]/60 hover:bg-[#FF5B3C]/[0.06]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#14151A]">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5B3C" strokeWidth="1.8" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-[#F5F3EF]">
                {previewUrl ? "Change image" : "Click to upload class image"}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">JPG, PNG · max 5MB</p>
            </div>
            <input
              id="class-image-upload"
              type="file" accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 h-48 w-full rounded-xl object-cover" />
          )}
        </div>

        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Category</label>
            <select
              name="category" value={form.category} onChange={handleChange}
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            >
              <option value="" disabled>Select</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Difficulty</label>
            <select
              name="difficulty" value={form.difficulty} onChange={handleChange}
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            >
              <option value="" disabled>Select</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Duration</label>
            <input
              type="text" name="duration" value={form.duration} onChange={handleChange}
              placeholder="e.g. 60 min"
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Price ($)</label>
            <input
              type="number" min="0" name="price" value={form.price} onChange={handleChange}
              placeholder="e.g. 25"
              className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
            />
          </div>
        </div>

        {/* Schedule */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Schedule</label>
          <input
            type="text" name="schedule" value={form.schedule} onChange={handleChange}
            placeholder="e.g. Mon, Wed, Fri - 7:00 AM"
            className="rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-[#9A9CA6]">Description</label>
          <textarea
            rows={4} name="description" value={form.description} onChange={handleChange}
            placeholder="Describe what this class covers..."
            className="resize-none rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-[#FF5B3C] py-3.5 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />
          )}
          {submitting
            ? uploading ? "Uploading image..." : "Submitting..."
            : "Submit Class for Review"}
        </button>
      </form>
    </div>
  );
}