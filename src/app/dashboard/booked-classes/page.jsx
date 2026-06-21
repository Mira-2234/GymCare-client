"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";

function TableSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-14 w-full animate-pulse rounded-xl bg-white/5" />
      ))}
    </div>
  );
}

export default function BookedClassesPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const controller = new AbortController();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/my?userEmail=${user.email}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        setBookings(data.bookings || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [user?.email]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">Booked Classes</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">Classes you've successfully registered and paid for.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24]">
        {loading ? (
          <div className="p-4"><TableSkeleton /></div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-3xl">📅</p>
            <p className="mt-3 text-sm text-[#9A9CA6]">You haven't booked any classes yet.</p>
            <Link href="/classes" className="mt-3 inline-block text-xs font-medium text-[#FF5B3C] hover:underline">
              Browse classes
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs text-[#9A9CA6]">
                <th className="px-5 py-3 font-medium">Class Name</th>
                <th className="px-5 py-3 font-medium">Trainer</th>
                <th className="px-5 py-3 font-medium">Schedule</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-white/5 last:border-0">
                  <td className="px-5 py-4 font-medium text-[#F5F3EF]">{b.className}</td>
                  <td className="px-5 py-4 text-[#9A9CA6]">{b.trainerName}</td>
                  <td className="px-5 py-4 text-[#9A9CA6]">{b.schedule || "—"}</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/classes/${b.classId}`}
                      className="text-xs font-medium text-[#FF5B3C] hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}