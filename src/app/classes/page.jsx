"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion } from "framer-motion";


const CATEGORIES = ["All", "Yoga", "Cardio", "Weights", "HIIT", "Pilates", "Cycling", "Boxing"];

function ClassCard({ cls, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24]"
    >
      
      <div className="relative h-44 w-full shrink-0 overflow-hidden">
        <img
          src={cls.image || `https://loremflickr.com/480/300/${cls.category?.toLowerCase()},gym`}
          alt={cls.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {/* Category badge */}
        <span className="absolute left-3 top-3 rounded-full bg-[#FF5B3C] px-2.5 py-0.5 text-[10px] font-semibold text-white">
          {cls.category}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-sm font-semibold text-[#F5F3EF] line-clamp-1">{cls.name}</h3>
          <p className="mt-0.5 text-xs text-[#9A9CA6]">{cls.trainerName}</p>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-xs text-[#9A9CA6]">
          <span>${cls.price} · {cls.duration}</span>
          <span className="flex items-center gap-1">
            {/* Person icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
            {cls.bookingCount} booked
          </span>
        </div>

        {/* Difficulty badge */}
        <span className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${
          cls.difficulty === "Beginner"
            ? "bg-emerald-500/15 text-emerald-400"
            : cls.difficulty === "Intermediate"
            ? "bg-amber-500/15 text-amber-400"
            : "bg-red-500/15 text-red-400"
        }`}>
          {cls.difficulty}
        </span>

        {/* View details */}
        <div className="mt-auto">
          <Link
            href={`/classes/${cls._id}`}
            className="block w-full rounded-xl border border-[#FF5B3C]/40 py-2 text-center text-xs font-medium text-[#FF5B3C] transition-colors hover:bg-[#FF5B3C] hover:text-white hover:border-[#FF5B3C]"
          >
            View Details
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
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-full animate-pulse rounded bg-white/5" />
        <div className="mt-auto h-8 w-full animate-pulse rounded-xl bg-white/5" />
      </div>
    </div>
  );
}


function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* Previous */}
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

      {/* Next */}
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


const LIMIT = 9; 
export default function AllClassesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

 
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [classes, setClasses] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const updateURL = useCallback((s, cat, p) => {
    const params = new URLSearchParams();
    if (s) params.set("search", s);
    if (cat && cat !== "All") params.set("category", cat);
    if (p > 1) params.set("page", p);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [pathname, router]);


  useEffect(() => {
    const controller = new AbortController(); 
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      page,
      limit: LIMIT,
      ...(search && { search }),
      ...(category !== "All" && { category }),
    });

    
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes?${params}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load classes.");
        return r.json();
      })
      .then((data) => {
        
        setClasses(data.classes);
        setTotalPages(data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError("Could not load classes. Please try again.");
        setLoading(false);
      });

    return () => controller.abort();
  }, [search, category, page]);


  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setPage(1);
    updateURL(val, category, 1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    updateURL(search, cat, 1);
  };

  const handlePageChange = (p) => {
    setPage(p);
    updateURL(search, category, p);
    window.scrollTo({ top: 0, behavior: "smooth" }); 
  };

  return (
    <main className="min-h-screen bg-[#14151A] px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F5F3EF]">All Classes</h1>
          <p className="mt-1 text-sm text-[#9A9CA6]">
            Find the perfect class for your fitness goal.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

      
          <div className="relative w-full sm:max-w-xs">
         
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9A9CA6]"
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Search classes..."
              className="w-full rounded-xl border border-white/10 bg-[#1C1E24] py-2.5 pl-9 pr-4 text-sm text-[#F5F3EF] placeholder:text-[#9A9CA6] outline-none focus:border-[#FF5B3C]"
            />
          </div>

          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-[#FF5B3C] text-white"
                    : "border border-white/10 text-[#9A9CA6] hover:border-[#FF5B3C] hover:text-[#FF5B3C]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

       
        {!loading && !error && (
          <p className="mb-4 text-xs text-[#9A9CA6]">
            {classes.length === 0
              ? "No classes found."
              : `Showing ${classes.length} class${classes.length !== 1 ? "es" : ""}`}
          </p>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: LIMIT }).map((_, i) => <SkeletonCard key={i} />)
            : classes.map((cls, i) => (
                <ClassCard key={cls._id} cls={cls} index={i} />
              ))}
        </div>

       
        {!loading && classes.length === 0 && !error && (
          <div className="py-20 text-center">
            <p className="text-4xl">🏋️</p>
            <p className="mt-3 text-sm text-[#9A9CA6]">No classes match your search.</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); setPage(1); updateURL("", "All", 1); }}
              className="mt-4 text-xs font-medium text-[#FF5B3C] hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>
    </main>
  );
}