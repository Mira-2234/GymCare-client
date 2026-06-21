"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function AdminAddForumPostPage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !image.trim() || !description.trim()) {
      toast.error("All fields are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          image,
          description,
          authorName: session?.user?.name,
          authorEmail: session?.user?.email,
          authorRole: "admin",
        }),
      });

      if (!res.ok) throw new Error("Failed to post");

      toast.success("Forum post published!");
      setTitle("");
      setImage("");
      setDescription("");
    } catch (err) {
      console.error("Add forum post error:", err);
      toast.error("Failed to publish post.");
    } finally {
      setSubmitting(false);
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
          <label className="text-xs font-semibold text-[#9A9CA6]">
            Image URL {/* Imgbb upload থেকে পাওয়া URL এখানে paste করবে */}
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://i.ibb.co/..."
            className="rounded-xl border border-white/10 bg-[#1C1D24] px-4 py-3 text-sm text-[#F5F3EF] outline-none focus:border-[#FF5B3C]"
          />
          {image && (
            <img src={image} alt="Preview" className="mt-2 h-40 w-full rounded-xl object-cover" />
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
          {submitting ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}