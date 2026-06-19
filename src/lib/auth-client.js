import { createAuthClient } from "better-auth/react";

// NEXT_PUBLIC_BETTER_AUTH_URL should point at your auth server's base URL.
// If your auth API lives on the same domain/origin as the frontend, you can
// drop baseURL entirely.
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export const { useSession, signIn, signUp, signOut } = authClient;