"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@heroui/react";
import { useAuth } from "@/lib/useAuth";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "All Classes", href: "/classes" },
  { label: "Community Forum", href: "/forum" },
];

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function PulseMark() {
  const reduceMotion = useReducedMotion();
  return (
    <svg width="30" height="16" viewBox="0 0 30 16" fill="none" aria-hidden="true">
      <motion.path
        d="M0 8 H7 L10 2 L14 14 L17 8 H30"
        stroke="#FF5B3C"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0.4 }}
        animate={
          reduceMotion
            ? { pathLength: 1, opacity: 1 }
            : { pathLength: [0, 1], opacity: [0.4, 1, 0.4] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
        }
      />
    </svg>
  );
}

// ─── Custom Avatar Dropdown ──────────────────────────────────────────────────
// HeroUI-র default Dropdown white theme দেখায় — তাই সম্পূর্ণ custom বানানো।
// useRef দিয়ে outside click detect করা হচ্ছে।
function AvatarMenu({ user, onLogout, onDashboard }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onOutsideClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onOutsideClick);
    return () => document.removeEventListener("mousedown", onOutsideClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Avatar circle — click করলে toggle */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open account menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[#FF5B3C]/20 text-sm font-bold text-[#FF5B3C] transition hover:border-[#FF5B3C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5B3C]"
      >
        {user?.image ? (
          <img
            src={user.image}
            alt={user?.name}
            className="h-9 w-9 object-cover"
          />
        ) : (
          getInitials(user?.name)
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            
            <div className="border-b border-white/10 px-4 py-3">
              <p className="truncate text-sm font-semibold text-[#F5F3EF]">
                {user?.name}
              </p>
              <p className="truncate text-xs text-[#9A9CA6]">{user?.email}</p>
            </div>

            {/* Dashboard */}
            <button
              onClick={() => { setOpen(false); onDashboard(); }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-[#F5F3EF] transition-colors hover:bg-white/[0.06]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              Dashboard
            </button>

            {/* Logout */}
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex w-full items-center gap-3 border-t border-white/10 px-4 py-3 text-sm font-medium text-[#FF5B3C] transition-colors hover:bg-[#FF5B3C]/10"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
    router.refresh();
  };

  const isActive = (href) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#14151A]/90 backdrop-blur-md">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-extrabold uppercase tracking-tight text-[#F5F3EF]">
            Gym<span className="text-[#FF5B3C]">Care</span>
          </span>
          <PulseMark />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "text-[#FF5B3C]"
                    : "text-[#9A9CA6] hover:text-[#F5F3EF]"
                }`}
                aria-current={isActive(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {!loading && user && (
            <li>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors ${
                  pathname.startsWith("/dashboard")
                    ? "text-[#FF5B3C]"
                    : "text-[#9A9CA6] hover:text-[#F5F3EF]"
                }`}
              >
                Dashboard
              </Link>
            </li>
          )}
        </ul>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <AvatarMenu
              user={user}
              onLogout={handleLogout}
              onDashboard={() => router.push("/dashboard")}
            />
          ) : (
            <>
              <Button
                onPress={() => router.push("/login")}
                className="border border-[#FF5B3C] shadow-[0_0_15px_rgba(255,91,60,0.3)] px-3 py-1 rounded-md text-[#F5F3EF] bg-transparent hover:bg-[#FF5B3C] hover:text-white transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Login
              </Button>
              <Button
                onPress={() => router.push("/register")}
                className="bg-[#FF5B3C] px-3 py-1 rounded-md shadow-[0_0_20px_rgba(255,91,60,0.5)] text-white border border-[#FF5B3C] transition-transform duration-300 ease-in-out hover:scale-105"
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <svg className="h-6 w-6 text-[#F5F3EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <ul className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="block py-2 text-sm font-medium text-[#F5F3EF]">
                    {link.label}
                  </Link>
                </li>
              ))}
              {!loading && user && (
                <li>
                  <Link href="/dashboard" className="block py-2 text-sm font-medium text-[#F5F3EF]">
                    Dashboard
                  </Link>
                </li>
              )}
              <li className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
                {loading ? (
                  <div className="h-9 w-full animate-pulse rounded-md bg-white/10" />
                ) : user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-xl border border-[#FF5B3C]/40 py-2.5 text-sm font-medium text-[#FF5B3C] hover:bg-[#FF5B3C]/10 transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <>
                    <Button variant="ghost" onPress={() => router.push("/login")}>
                      Login
                    </Button>
                    <Button
                      className="border border-[#FF5B3C] rounded-md"
                      onPress={() => router.push("/register")}
                    >
                      Get Started
                    </Button>
                  </>
                )}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}