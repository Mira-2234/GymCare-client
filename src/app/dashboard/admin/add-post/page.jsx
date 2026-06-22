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
    throw new Error(data.error?.message || "Image upload failed");
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts`, {
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
      });

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
      <h1 className="text-2xl font-bold text-[#F5F3EF]">Add Forum Post</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">
        Share an update or guide with the community.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#9A9CA6]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. New Class Booking Rules"
            className="rounded-xl border border-white/10 bg-[#1C1D24] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#9A9CA6]">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="rounded-xl border border-white/10 bg-[#1C1D24] p-3 text-sm text-[#9A9CA6] outline-none"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 h-40 w-full rounded-xl object-cover"
            />
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-[#9A9CA6]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            placeholder="Write your post content here..."
            className="rounded-xl border border-white/10 bg-[#1C1D24] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-[#FF5B3C] px-6 py-3 text-sm font-semibold text-black transition hover:scale-[1.01] disabled:opacity-50"
        >
          {submitting ? (uploading ? "Uploading Image..." : "Publishing...") : "Publish Post"}
        </button>
      </form>
    </div>
  );
}