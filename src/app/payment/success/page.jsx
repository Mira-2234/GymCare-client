"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState("verifying"); 
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/verify-payment/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setBooking(data.booking);
          setStatus("success");
        } else {
          setStatus("error");
          toast.error(data.error || "Payment verification failed.");
        }
      })
      .catch(() => setStatus("error"));
  }, [sessionId]);

  if (status === "verifying") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#14151A]">
        <p className="text-[#9A9CA6]">Verifying your payment...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#14151A] px-6">
        <p className="text-[#FF5B3C]">Something went wrong verifying your payment.</p>
        <Link href="/dashboard" className="text-sm text-[#9A9CA6] underline">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#14151A] px-6 text-center">
      <div className="rounded-full bg-green-500/10 p-4">
        <svg className="h-10 w-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-[#F5F3EF]">Booking Confirmed!</h1>
      <p className="text-sm text-[#9A9CA6]">
        You're booked for <span className="text-[#F5F3EF]">{booking?.className}</span>
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="mt-4 rounded-xl bg-[#FF5B3C] px-6 py-3 text-sm font-semibold text-black hover:scale-[1.01]"
      >
        Go to Dashboard
      </button>
    </div>
  );
}