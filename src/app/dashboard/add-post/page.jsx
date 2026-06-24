"use client";



import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { uploadToCloudinary } from "@/lib/cloudinary";
import toast from "react-hot-toast";

export default function AddForumPostPage() {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    if (!user?.email) {
      toast.error("Please login first.");
      return;
    }
    if (!title.trim() || !description.trim() || !imageFile) {
      toast.error("Please fill all fields and select an image.");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);
      const imageUrl = await uploadToCloudinary(imageFile);
      setUploading(false);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          image: imageUrl,
          authorName: user.name,
          authorEmail: user.email,
          authorRole: user.role || "trainer",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to publish.");

      toast.success("Post published successfully!");
      setTitle("");
      setDescription("");
      setImageFile(null);
      setPreviewUrl("");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to publish post.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF5B3C]/15 text-xl">
          📝
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#F5F3EF]">Add Forum Post</h1>
          <p className="mt-1 text-sm text-[#9A9CA6]">Share something with the community</p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col gap-6 rounded-3xl border border-white/10 bg-[#1C1E24] p-8"
      >
        {/* Title */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#9A9CA6]">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Write a title..."
            className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-4 text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        {/* Image Upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#9A9CA6]">Image</label>
          <label
            htmlFor="forum-image-upload"
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
                {previewUrl ? "Change image" : "Click to upload image"}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">JPG, PNG · max 5MB</p>
            </div>
            <input
              id="forum-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          {previewUrl && (
            <img src={previewUrl} alt="Preview" className="mt-2 h-48 w-full rounded-xl object-cover" />
          )}
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-[#9A9CA6]">Description</label>
          <textarea
            rows={7}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write your post content here..."
            className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-4 text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#FF5B3C] py-4 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {submitting
            ? uploading
              ? "Uploading image..."
              : "Publishing..."
            : "Publish Post"}
        </button>
      </form>
    </div>
  );
}