"use client";

import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";


export function useAuth() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const logout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return {
    user: session?.user ?? null,
    loading: isPending,
    logout,
  };
}