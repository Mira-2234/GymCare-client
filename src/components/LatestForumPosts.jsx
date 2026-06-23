"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function PostSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-[#1C1E24]">
      <div className="h-32 w-full animate-pulse bg-white/5" />
      <div className="space-y-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function LatestForumPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts/latest`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load forum posts.");
        return r.json();
      })
      .then((data) => {
        
        setPosts((data.posts ?? []).slice(0, 3));
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(true);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-[#14151A] px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-6 text-sm font-medium text-[#9A9CA6]">Latest from the forum</h2>

        {error ? (
          <p className="text-sm text-[#9A9CA6]">Could not load forum posts right now.</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <PostSkeleton key={i} />)
              : posts.map((post) => (
                  <div
                    key={post._id}
                    className="overflow-hidden rounded-lg border border-white/10 bg-[#1C1E24]"
                  >
                    <img
                      src={post.image || "https://loremflickr.com/480/300/fitness,gym"}
                      alt={post.title}
                      className="h-32 w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm font-semibold text-[#F5F3EF] line-clamp-2">
                        {post.title}
                      </p>
                      <p className="mt-1 text-xs text-[#9A9CA6]">{post.authorName}</p>
                    
                      <Link
                        href={`/forum/${post._id}`}
                        className="mt-3 inline-block text-xs font-medium text-[#FF5B3C] hover:underline"
                      >
                        Read more
                      </Link>
                    </div>
                  </div>
                ))}
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <p className="text-sm text-[#9A9CA6]">No forum posts yet.</p>
        )}
      </div>
    </section>
  );
}
