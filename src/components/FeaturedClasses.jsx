"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

function FeaturedCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#1C1D24]">
      <div className="h-44 animate-pulse bg-white/5" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/5" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="h-8 w-full animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

function FeaturedCard({ cls, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#1C1D24] transition-all hover:border-[#FF5B3C]/30 hover:shadow-[0_0_40px_-15px_rgba(255,91,60,.25)]"
    >
     <div className="relative h-44 overflow-hidden">
  <Image
    src={cls.image}
    alt={cls.name}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover transition-transform duration-500 group-hover:scale-105"
  />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C1D24] via-transparent to-transparent" />

        {index === 0 && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#FF5B3C] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
            </svg>
            Most Booked
          </span>
        )}

        <span className="absolute right-3 top-3 rounded-full bg-[#14151A]/80 px-2.5 py-1 text-xs font-medium text-[#FF5B3C] backdrop-blur-sm">
          {cls.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="truncate text-base font-bold text-[#F5F3EF]">{cls.className}</h3>
        <p className="mt-1 text-sm text-[#9A9CA6]">by {cls.trainerName}</p>

        <div className="mt-3 flex items-center gap-4 text-xs text-[#6B6D78]">
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
            </svg>
            {cls.duration}
          </span>
          <span className="flex items-center gap-1 font-medium text-[#FF5B3C]">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {cls.bookingCount ?? 0} booked
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-bold text-[#FF5B3C]">${cls.price}</span>
          <Link
            href={`/classes/${cls._id}`}
            className="rounded-lg bg-[#FF5B3C]/10 px-4 py-2 text-sm font-semibold text-[#FF5B3C] transition hover:bg-[#FF5B3C] hover:text-white"
          >
            Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function FeaturedClasses() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes?limit=6&page=1`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load featured classes.");
        return r.json();
      })
      .then((data) => {
        console.log("FEATURED DATA:", data); 
        setClasses(data.classes ?? []);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.error(err);
        setError(true);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);


  return (
    <section className="bg-[#14151A] px-30 py-20 ">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left"
        >
          <div>
            <p className="text-xs font-medium tracking-widest text-[#FF5B3C]">FEATURED</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[#F5F3EF]">
              Our Most Popular Classes
            </h2>
            <p className="mt-2 max-w-md text-sm text-[#9A9CA6]">
              The classes our members are booking the most — start where the energy is.
            </p>
          </div>
          <Link
            href="/classes"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-[#F5F3EF] transition hover:border-[#FF5B3C]/40 hover:text-[#FF5B3C] sm:mt-0"
          >
            View All Classes
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <FeaturedCardSkeleton key={i} />)}
          </div>
        ) : classes.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#1C1D24] py-16 text-center">
            <p className="text-sm text-[#9A9CA6]">No classes available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {classes.map((cls, i) => (
              <FeaturedCard key={cls._id} cls={cls} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}