"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
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

function ThumbUpIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  );
}

function ThumbDownIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
      <path d="M17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"/>
    </svg>
  );
}

function FileImageIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#6B6D78]">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
}

function confirmDelete(onConfirm) {
  toast(
    (t) => (
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
          <p className="text-sm font-semibold text-[#F5F3EF]">Delete this post?</p>
        </div>
        <p className="text-xs text-[#9A9CA6]">This action cannot be undone.</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="flex-1 rounded-lg bg-red-500/20 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/30"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 rounded-lg bg-white/10 py-1.5 text-xs font-semibold text-[#9A9CA6] hover:bg-white/15"
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      duration: Infinity,
      style: {
        background: "#1C1E24",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "14px",
        padding: "16px",
        minWidth: "220px",
      },
    }
  );
}

export default function ForumModerationPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/forum-posts?email=${user.email}`)
      .then((r) => r.json())
      .then((d) => setPosts(d.posts ?? []))
      .catch((err) => console.error("Failed to fetch posts:", err))
      .finally(() => setLoading(false));
  }, [user]);

  const handleDelete = async (postId) => {
    confirmDelete(async () => {
      setDeletingId(postId);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/admin/forum-posts/${postId}?email=${user.email}`,
          { method: "DELETE" }
        );

        if (!res.ok) throw new Error();
        setPosts((prev) => prev.filter((p) => p._id !== postId));
        toast.success("Post deleted.");
      } catch (err) {
        console.error("Delete post error:", err);
        toast.error("Failed to delete post.");
      } finally {
        setDeletingId(null);
      }
    });
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
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-14 w-20 flex-shrink-0 rounded-lg object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                    <FileImageIcon />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#F5F3EF]">{post.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <AuthorBadge role={post.authorRole} />
                    <span className="text-xs text-[#6B6D78]">{post.authorName}</span>
                  </div>
                  <p className="mt-1 text-[10px] text-[#6B6D78]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-[#6B6D78]">
                  <span className="flex items-center gap-1">
                    <ThumbUpIcon />
                    {post.likes?.length || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbDownIcon />
                    {post.dislikes?.length || 0}
                  </span>
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