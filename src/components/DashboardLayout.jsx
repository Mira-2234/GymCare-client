"use client";


import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/useAuth";

const NAV_BY_ROLE = {
  user: [
    { label: "Overview", href: "/dashboard", icon: "grid" },
    { label: "Booked Classes", href: "/dashboard/booked-classes", icon: "calendar" },
    { label: "Apply as Trainer", href: "/dashboard/apply-trainer", icon: "badge" },
    { label: "Favorite Classes", href: "/dashboard/favorites", icon: "heart" },
  ],
  trainer: [
    { label: "Overview", href: "/dashboard", icon: "grid" },
    { label: "Add Class", href: "/dashboard/add-class", icon: "plus" },
    { label: "My Classes", href: "/dashboard/my-classes", icon: "list" },
    { label: "Add Forum Post", href: "/dashboard/add-post", icon: "edit" },
    { label: "My Forum Posts", href: "/dashboard/my-posts", icon: "file" },
  ],
  admin: [
    { label: "Overview", href: "/dashboard", icon: "grid" },
    { label: "Manage Users", href: "/dashboard/admin/manage-users", icon: "users" },
    { label: "Applied Trainers", href: "/dashboard/admin/applied-trainers", icon: "badge" },
    { label: "Manage Trainers", href: "/dashboard/admin/manage-trainers", icon: "shield" },
    { label: "Manage Classes", href: "/dashboard/admin/manage-classes", icon: "list" },
    { label: "Add Forum Post", href: "/dashboard/admin/add-post", icon: "edit" },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: "card" },
    { label: "Forum Moderation", href: "/dashboard/admin/forum-moderation", icon: "shield-check" },
  ],
};

const ICONS = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
  badge: <><circle cx="12" cy="8" r="5"/><path d="M9 14l-3 7 6-3 6 3-3-7"/></>,
  heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
  plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
  list: <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
  edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
  card: <><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
  "shield-check": <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></>,
};

function NavIcon({ name }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function SidebarContent({ role, pathname, onNavigate }) {
  const links = NAV_BY_ROLE[role] || NAV_BY_ROLE.user;

  return (
    <nav className="flex flex-col gap-1 p-4">
      <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-widest text-[#5A5C68]">
        {role} dashboard
      </p>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#FF5B3C] text-white"
                : "text-[#9A9CA6] hover:bg-white/5 hover:text-[#F5F3EF]"
            }`}
          >
            <NavIcon name={link.icon} />
            {link.label}
          </Link>
        );
      })}

      <Link
        href="/"
        className="mt-4 flex items-center gap-3 rounded-xl border-t border-white/10 px-3 pt-4 text-sm font-medium text-[#9A9CA6] hover:text-[#F5F3EF]"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        </svg>
        Back to site
      </Link>
    </nav>
  );
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  
  const role = user?.role || "user";


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#14151A]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#FF5B3C]" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#14151A]">

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#1C1E24] lg:block">
        <SidebarContent role={role} pathname={pathname} onNavigate={() => {}} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-[#1C1E24] lg:hidden"
            >
              <SidebarContent role={role} pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      
      <div className="flex-1">
        
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#1C1E24] px-4 py-3 lg:hidden">
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F5F3EF" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </button>
          <span className="text-sm font-semibold text-[#F5F3EF] capitalize">{role} Dashboard</span>
        </div>

        
        <main className="p-6 lg:p-10">{children}</main>
      </div>
    </div>
  );
}