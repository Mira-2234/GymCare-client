"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = useSession();
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (sessionLoading) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?email=${session.user.email}`
    )
      .then((r) => {
        if (r.status === 403) {
          router.replace("/dashboard");
          return null;
        }
        return r.json();
      })
      .then((data) => {
        if (data) setIsAdmin(true);
      })
      .catch(() => router.replace("/dashboard"))
      .finally(() => setChecking(false));
  }, [session, sessionLoading, router]);

  if (checking || sessionLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#14151A]">
        <p className="text-[#9A9CA6]">Checking admin access...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#14151A]">
      <div className="border-b border-white/10 bg-[#1C1D24]">
       
      </div>
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}