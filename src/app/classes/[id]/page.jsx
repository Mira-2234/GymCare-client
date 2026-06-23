"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";
import Image from "next/image";

function DetailsSkeleton() {
  return (
    <div className="min-h-screen bg-[#14151A] px-6 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="h-72 animate-pulse rounded-2xl bg-white/5" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-white/5" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-white/5" />
      </div>
    </div>
  );
}

export default function ClassDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);

  const [alreadyBooked, setAlreadyBooked] = useState(false);
  const [bookingChecked, setBookingChecked] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

 
  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      toast.error("Please login first");
      router.replace(`/login?redirect=${encodeURIComponent(`/classes/${id}`)}`);
    }
  }, [sessionLoading, session, router, id]);

  
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch class");
        return r.json();
      })
      .then((data) => setCls(data))
      .catch((err) => {
        console.error("Failed to load class:", err);
        setCls(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  
  useEffect(() => {
    if (!session?.user?.email || !id) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId: id, userEmail: session.user.email }),
    })
      .then((r) => r.json())
      .then((d) => setAlreadyBooked(!!d.alreadyBooked))
      .catch(() => {})
      .finally(() => setBookingChecked(true));

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/favorites/check?classId=${id}&userEmail=${session.user.email}`
    )
      .then((r) => r.json())
      .then((d) => {
        setIsFavorite(!!d.isFavorite);
        setFavoriteId(d.favoriteId ?? null);
      })
      .catch(() => {});
  }, [session, id]);

  const handleBookNow = () => {
    if (!session?.user) {
      toast.error("Please login to book this class.");
      router.push("/login");
      return;
    }

    if (alreadyBooked) {
      toast.error("You have already booked this class.");
      return;
    }

    router.push(`/booking/${id}`); 
  };

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      toast.error("Please login to save favorites.");
      router.push("/login");
      return;
    }

    setFavoriteLoading(true);
    try {
      if (isFavorite) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites/${favoriteId}`, {
          method: "DELETE",
        });
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success("Removed from favorites.");
      } else {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/favorites`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            classId: id,
            userEmail: session.user.email,
            className: cls.className,
            classImage: cls.image,
          }),
        });

        if (res.status === 409) {
          toast.error("Already in your favorites.");
          setIsFavorite(true);
          return;
        }

        const data = await res.json();
        setIsFavorite(true);
        setFavoriteId(data.insertedId);
        toast.success("Successfully added to your favorites!");
      }
    } catch (err) {
      console.error("Favorite toggle error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setFavoriteLoading(false);
    }
  };

  if (loading || sessionLoading || !session?.user) {
    return <DetailsSkeleton />;
  }

  if (!cls) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#14151A]">
        <p className="text-[#9A9CA6]">Class not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#14151A] px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="relative mb-8 h-72 overflow-hidden rounded-2xl border border-white/10">
  <Image
    src={cls.image}
    alt={cls.name}
    fill
    sizes="(max-width: 896px) 100vw, 896px"
    className="object-cover"
    priority
  />
  <div className="absolute inset-0 bg-gradient-to-t from-[#14151A] via-transparent to-transparent" />
  <span className="absolute left-4 top-4 rounded-full bg-[#14151A]/80 px-3 py-1 text-xs font-medium text-[#FF5B3C] backdrop-blur-sm">
    {cls.category}
  </span>
</div>

        <h1 className="text-3xl font-bold text-[#F5F3EF]">{cls.className}</h1>
        <p className="mt-2 text-sm text-[#9A9CA6]">by {cls.trainerName}</p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-[#1C1D24] p-4">
            <p className="text-xs text-[#6B6D78]">Difficulty</p>
            <p className="mt-1 text-sm font-semibold text-[#F5F3EF]">{cls.difficulty}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1C1D24] p-4">
            <p className="text-xs text-[#6B6D78]">Duration</p>
            <p className="mt-1 text-sm font-semibold text-[#F5F3EF]">{cls.duration}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1C1D24] p-4">
            <p className="text-xs text-[#6B6D78]">Schedule</p>
            <p className="mt-1 text-sm font-semibold text-[#F5F3EF]">{cls.schedule}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1C1D24] p-4">
            <p className="text-xs text-[#6B6D78]">Price</p>
            <p className="mt-1 text-sm font-semibold text-[#FF5B3C]">${cls.price}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#1C1D24] p-6">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#9A9CA6]">
            Description
          </h2>
          <p className="text-sm leading-relaxed text-[#F5F3EF]">{cls.description}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleBookNow}
            disabled={bookingChecked && alreadyBooked}
            className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
              bookingChecked && alreadyBooked
                ? "cursor-not-allowed bg-white/5 text-[#6B6D78]"
                : "bg-[#FF5B3C] text-black hover:scale-[1.01]"
            }`}
          >
            {bookingChecked && alreadyBooked ? "Already Booked" : "Book Now"}
          </button>

          <button
            onClick={handleToggleFavorite}
            disabled={favoriteLoading}
            className={`flex items-center justify-center gap-2 rounded-xl border px-6 py-3 text-sm font-semibold transition ${
              isFavorite
                ? "border-[#FF5B3C]/40 bg-[#FF5B3C]/10 text-[#FF5B3C]"
                : "border-white/10 text-[#F5F3EF] hover:border-[#FF5B3C]/40"
            } disabled:opacity-60`}
          >
            <svg
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.75"
              viewBox="0 0 24 24"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {isFavorite ? "Saved to Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </div>
  );
}