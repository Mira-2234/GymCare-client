"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Avatar, Button, Dropdown, Label, Separator, Header } from "@heroui/react";
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

// Signature element: a small heartbeat/EKG blip next to the wordmark.
// Ties literally to "Pulse" in the brand name. Respects reduced-motion.
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

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close the mobile menu automatically whenever the route changes,
  // so navigating never leaves a stale open menu behind.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
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
          {/* Dashboard link only appears once we know the user is logged in */}
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

        {/* Auth actions */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? (
            // While the session is being verified, show a neutral
            // placeholder instead of guessing Login/Logout — this is
            // exactly the loading-state guard from the route wrappers.
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <Dropdown>
              <button
                className="rounded-full outline-none ring-offset-2 ring-offset-[#14151A] focus-visible:ring-2 focus-visible:ring-[#FF5B3C]"
                aria-label="Open account menu"
              >
                <Avatar size="sm">
                  <Avatar.Image src={user.image} alt={user.name} />
                  <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
                </Avatar>
              </button>
              <Dropdown.Popover>
                <Dropdown.Menu
                  onAction={(key) => {
                    if (key === "dashboard") router.push("/dashboard");
                    if (key === "logout") handleLogout();
                  }}
                >
                  <Dropdown.Section>
                    <Header>{user.name}</Header>
                    <Dropdown.Item id="dashboard" textValue="Dashboard">
                      <Label>Dashboard</Label>
                    </Dropdown.Item>
                  </Dropdown.Section>
                  <Separator />
                  <Dropdown.Item id="logout" textValue="Logout" variant="danger">
                    <Label>Logout</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <>
              <Button
               onPress={() => router.push("/login")}
               className="border border-[#FF5B3C] shadow-[0_0_15px_rgba(255,91,60,0.3)] px-3 py-1 rounded-md text-[#F5F3EF] bg-transparent hover:bg-[#FF5B3C]
                 hover:text-white
                 transition-transform duration-300 ease-in-out
hover:scale-105"
             >
               Login
             </Button>
             
             <Button
               onPress={() => router.push("/register")}
               className="bg-[#FF5B3C] px-3 py-1 rounded-md shadow-[0_0_20px_rgba(255,91,60,0.5)] text-white border border-[#FF5B3C] transition-transform duration-300 ease-in-out
              hover:scale-105"
             >
               Get Started
             </Button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
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

      {/* Mobile menu panel */}
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
                  <Button variant="danger-soft" onPress={handleLogout}>
                    Logout
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onPress={() => router.push("/login")}>
                      Login
                    </Button>
                    <Button
                    className='border border-[#FF5B3C] rounded-md' 
                    variant="primary" onPress={() => router.push("/register")}>
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