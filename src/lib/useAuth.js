"use client";

import { useRouter } from "next/navigation";
import { authClient, useSession } from "@/lib/auth-client";

/**
 * Thin wrapper around Better Auth's useSession, reshaped into
 * { user, loading, logout } so components like Navbar don't need to know
 * about Better Auth's internal field names (isPending, data, etc).
 *
 * IMPORTANT: `role` is NOT a default field on the Better Auth user object.
 * On your server, add it as an additional field when you create the auth
 * instance, e.g. in your auth.js (server config):
 *
 *   export const auth = betterAuth({
 *     // ...your existing config
 *     user: {
 *       additionalFields: {
 *         role: { type: "string", defaultValue: "user" },
 *       },
 *     },
 *   });
 *
 * Without this, session.user.role will always be undefined, and the
 * role-based Dashboard link / route guards won't work correctly.
 */
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