"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function AuthorBadge({ role }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
        isAdmin ? "bg-red-400/10 text-red-400" : "bg-[#FF5B3C]/10 text-[#FF5B3C]"
      }`}
    >
      {isAdmin ? "Admin" : "Trainer"}
    </span>
  );
}

export default function ForumModerationPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/forum-posts`)
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch((err) => console.error("Failed to fetch posts:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (postId) => {
    if (!confirm("Delete this post permanently? This cannot be undone.")) return;

    setDeletingId(postId);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/forum-posts/${postId}`, {
        method: "DELETE",
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Post deleted.");
    } catch (err) {
      console.error("Delete post error:", err);
      toast.error("Failed to delete post.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#F5F3EF]">Forum Moderation</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">
        Review and remove inappropriate community posts — {posts.length} total posts.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#1C1D24]">
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#9A9CA6]">No posts to moderate.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {posts.map((post) => (
              <div key={post._id} className="flex items-center gap-4 px-5 py-4">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-14 w-20 flex-shrink-0 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#F5F3EF]">{post.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <AuthorBadge role={post.authorRole} />
                    <span className="text-xs text-[#6B6D78]">{post.authorName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#6B6D78]">
                  <span>👍 {post.likes?.length || 0}</span>
                  <span>👎 {post.dislikes?.length || 0}</span>
                </div>
                <button
                  onClick={() => handleDelete(post._id)}
                  disabled={deletingId === post._id}
                  className="rounded-lg bg-red-400/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-400/20 disabled:opacity-50"
                >
                  {deletingId === post._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}