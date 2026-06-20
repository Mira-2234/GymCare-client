"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      router.replace(`/login?redirect=${encodeURIComponent(`/payment/${id}`)}`);
      return;
    }

    const initiateCheckout = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/create-checkout-session`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ classId: id, userEmail: session.user.email }),
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Something went wrong.");
          setError(data.error || "Failed to start payment.");
          return;
        }

        window.location.href = data.url; // Stripe hosted checkout e redirect
      } catch (err) {
        console.error("Payment init error:", err);
        toast.error("Failed to start payment.");
        setError("Failed to start payment.");
      }
    };

    initiateCheckout();
  }, [session, sessionLoading, id, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#14151A] px-6 text-center">
      {error ? (
        <>
          <p className="text-[#FF5B3C]">{error}</p>
          <button
            onClick={() => router.push(`/booking/${id}`)}
            className="text-sm text-[#9A9CA6] underline"
          >
            Go back
          </button>
        </>
      ) : (
        <p className="text-[#9A9CA6]">Redirecting you to secure Stripe checkout...</p>
      )}
    </div>
  );
}