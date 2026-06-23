"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function BookingConfirmationPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();

  const [cls, setCls] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionLoading && !session?.user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/booking/${id}`)}`);
    }
  }, [sessionLoading, session, router, id]);

  useEffect(() => {
    if (!id) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/classes/${id}`)
      .then((r) => r.json())
      .then((data) => setCls(data))
      .catch(() => setCls(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleProceedToPay = () => {
    router.push(`/payment/${id}`);   
  };

  if (loading || sessionLoading || !session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#14151A]">
        <p className="text-[#9A9CA6]">Loading...</p>
      </div>
    );
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
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/classes/${id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-[#9A9CA6] hover:text-[#FF5B3C]"
        >
          ← Back to Class
        </Link>

        <h1 className="text-3xl font-bold text-[#F5F3EF]">Complete Booking</h1>
        <p className="mt-1 text-sm text-[#9A9CA6]">
          Review your order details below and proceed to our secure Stripe checkout.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-[1.3fr_1fr]">
         
          <div className="rounded-2xl border border-white/10 bg-[#1C1D24] p-6">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#9A9CA6]">
              Order Summary
            </h2>

            <div className="overflow-hidden rounded-xl">
              <img src={cls.image} alt={cls.name} className="h-40 w-full object-cover" />
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6D78]">Item</span>
                <span className="font-semibold text-[#F5F3EF]">{cls.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#6B6D78]">Trainer</span>
                <span className="font-semibold text-[#F5F3EF]">{cls.trainerName}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base">
                <span className="font-semibold text-[#F5F3EF]">Total Due</span>
                <span className="font-bold text-[#FF5B3C]">${cls.price}</span>
              </div>
            </div>
          </div>

          
          <div className="h-fit rounded-2xl border border-white/10 bg-[#1C1D24] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#9A9CA6]">
                Payment
              </h2>
              <span className="flex items-center gap-1 text-xs text-[#6B6D78]">
                🔒 Secure Checkout
              </span>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-white/10 bg-[#14151A] p-4">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#FF5B3C]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              <p className="text-xs leading-relaxed text-[#9A9CA6]">
                You will be redirected to{" "}
                <span className="font-semibold text-[#F5F3EF]">Stripe</span> to complete your
                purchase securely. We do not store any of your payment information.
              </p>
            </div>

            <button
              onClick={handleProceedToPay}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5B3C] py-3 text-sm font-semibold text-black transition hover:scale-[1.01]"
            >
              🔒 Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}