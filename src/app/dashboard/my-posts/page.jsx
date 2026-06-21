"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

export default function MyForumPostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = () => {
    if (!user?.email) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts/my?authorEmail=${user.email}`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => toast.error("Failed to load posts."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts/${id}?authorEmail=${user.email}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error();
      toast.success("Post deleted.");
      fetchPosts();
    } catch {
      toast.error("Failed to delete post.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">My Forum Posts</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">Posts you've shared with the community.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {loading ? (
          <p className="text-sm text-[#6B6D78]">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-sm text-[#6B6D78]">You haven't posted anything yet.</p>
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24]"
            >
              {post.image && (
                <img src={post.image} alt={post.title} className="h-40 w-full object-cover" />
              )}
              <div className="p-5">
                <h3 className="font-semibold text-[#F5F3EF]">{post.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-[#9A9CA6]">{post.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-[#6B6D78]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="rounded-lg bg-red-500/15 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/25"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}