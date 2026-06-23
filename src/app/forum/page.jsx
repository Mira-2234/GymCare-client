"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";

function PostCard({ post, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24]"
    >
      <div className="relative h-44 w-full shrink-0 overflow-hidden">
        <img
          src={post.image || "https://loremflickr.com/480/300/fitness,gym"}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {post.authorRole && (
          <span className="absolute left-3 top-3 rounded-full bg-[#FF5B3C] px-2.5 py-0.5 text-[10px] font-semibold capitalize text-white">
            {post.authorRole}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-sm font-semibold text-[#F5F3EF] line-clamp-2">{post.title}</h3>
        <p className="text-xs text-[#9A9CA6]">{post.authorName}</p>
        <p className="text-xs text-[#9A9CA6] line-clamp-2">{post.description}</p>

        <div className="mt-auto pt-2">
          <Link
            href={`/forum/${post._id}`}
            className="block w-full rounded-xl border border-[#FF5B3C]/40 py-2 text-center text-xs font-medium text-[#FF5B3C] transition-colors hover:bg-[#FF5B3C] hover:text-white hover:border-[#FF5B3C]"
          >
            Read More
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24]">
      <div className="h-44 w-full animate-pulse bg-white/5" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-full animate-pulse rounded bg-white/5" />
        <div className="mt-2 h-8 w-full animate-pulse rounded-xl bg-white/5" />
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#9A9CA6] transition hover:border-[#FF5B3C] hover:text-[#FF5B3C] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 rounded-lg text-xs font-medium transition ${
            p === page
              ? "bg-[#FF5B3C] text-white"
              : "border border-white/10 text-[#9A9CA6] hover:border-[#FF5B3C] hover:text-[#FF5B3C]"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#9A9CA6] transition hover:border-[#FF5B3C] hover:text-[#FF5B3C] disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}

const LIMIT = 6; 

export default function CommunityForumPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const updateURL = useCallback((p) => {
    const params = new URLSearchParams();
    if (p > 1) params.set("page", p);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");

    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts?page=${page}&limit=${LIMIT}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load forum posts.");
        return r.json();
      })
      .then((data) => {
        setPosts(data.posts);
       
        setTotalPages(data.pagination?.totalPages || 1);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setError("Could not load forum posts. Please try again.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [page]);

  const handlePageChange = (p) => {
    setPage(p);
    updateURL(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#14151A] px-6 py-12">
      <div className="mx-auto max-w-5xl">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F5F3EF]">Community Forum</h1>
          <p className="mt-1 text-sm text-[#9A9CA6]">
            Tips, advice, and stories from trainers and the IronPulse team.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : posts.map((post, i) => (
                <PostCard key={post._id} post={post} index={i} />
              ))}
        </div>

        {!loading && posts.length === 0 && !error && (
          <div className="py-20 text-center">
            <p className="text-4xl">💬</p>
            <p className="mt-3 text-sm text-[#9A9CA6]">No forum posts yet.</p>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>
    </main>
  );
}
