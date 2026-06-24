"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function AdminAddForumPostPage() {
  const { data: session } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const uploadToCloudinary = async () => {
    if (!imageFile) throw new Error("Select an image first");

    const formData = new FormData();

    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      throw new Error(data?.error?.message || "Image upload failed");
    }

    return data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim() || !imageFile) {
      toast.error("Please fill all fields and select an image.");
      return;
    }

    try {
      setSubmitting(true);
      setUploading(true);

      const imageUrl = await uploadToCloudinary();
      setUploading(false);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            image: imageUrl,
            description: description.trim(),
            authorName: session?.user?.name,
            authorEmail: session?.user?.email,
            authorRole: "admin",
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to post");

      toast.success("Forum post published!");

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
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-[#F5F3EF]">
        Add Forum Post
      </h1>

      <p className="mt-1 text-sm text-[#9A9CA6]">
        Share an update or guide with the community.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">

        {/* TITLE */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#9A9CA6]">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New Class Booking Rules"
            className="rounded-xl border border-white/10 bg-[#1C1D24] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

       
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#9A9CA6]">
            Upload Image
          </label>

          <label
            htmlFor="forum-image-upload"
            className="flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-[#FF5B3C]/30 bg-[#FF5B3C]/[0.03] p-4 transition-colors hover:border-[#FF5B3C]/60 hover:bg-[#FF5B3C]/[0.06]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#14151A]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FF5B3C"
                  strokeWidth="1.8"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              )}
            </div>

            <div>
              <p className="text-sm font-medium text-[#F5F3EF]">
                {previewUrl ? "Change image" : "Click to upload image"}
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                JPG, PNG · max 5MB
              </p>
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
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 h-40 w-full rounded-xl object-cover"
            />
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#9A9CA6]">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Write your post content here..."
            className="rounded-xl border border-white/10 bg-[#1C1D24] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#FF5B3C] px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-50"
        >
          {submitting
            ? uploading
              ? "Uploading Image..."
              : "Publishing..."
            : "Publish Post"}
        </button>

      </form>
    </div>
  );
}