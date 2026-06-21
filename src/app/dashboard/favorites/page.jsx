"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import toast from "react-hot-toast";

function CardSkeleton() {
  return <div className="h-48 animate-pulse rounded-2xl bg-white/5" />;
}

export default function FavoriteClassesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    if (!user?.email) return;
    fetchFavorites();
  }, [user?.email]);

  const fetchFavorites = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/my?userEmail=${user.email}`)
      .then((r) => r.json())
      .then((data) => {
        setFavorites(data.favorites || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleRemove = async (favoriteId) => {
    setRemovingId(favoriteId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${favoriteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();

      setFavorites((prev) => prev.filter((f) => f._id !== favoriteId));
      toast.success("Removed from favorites.");
    } catch {
      toast.error("Failed to remove. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">Favorite Classes</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">Classes you've saved for later.</p>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#1C1E24] py-16 text-center">
          <p className="text-3xl">♡</p>
          <p className="mt-3 text-sm text-[#9A9CA6]">No favorite classes yet.</p>
          <Link href="/classes" className="mt-3 inline-block text-xs font-medium text-[#FF5B3C] hover:underline">
            Browse classes
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div key={fav._id} className="overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24]">
              <img
                src={fav.classImage || "https://loremflickr.com/480/300/gym,fitness"}
                alt={fav.className}
                className="h-32 w-full object-cover"
              />
              <div className="p-4">
                <p className="text-sm font-semibold text-[#F5F3EF]">{fav.className}</p>
                <p className="mt-1 text-xs text-[#9A9CA6]">{fav.trainerName}</p>

                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/classes/${fav.classId}`}
                    className="flex-1 rounded-lg border border-white/10 py-1.5 text-center text-xs font-medium text-[#F5F3EF] hover:border-[#FF5B3C]"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(fav._id)}
                    disabled={removingId === fav._id}
                    className="flex-1 rounded-lg border border-red-500/30 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {removingId === fav._id ? "..." : "Remove"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}