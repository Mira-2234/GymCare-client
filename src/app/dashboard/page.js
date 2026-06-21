"use client";

/**
 * src/app/dashboard/page.js  —  Role-aware Overview
 *
 * একই /dashboard route, কিন্তু user.role অনুযায়ী আলাদা content দেখাবে।
 * User → UserOverview, Admin → AdminOverview, Trainer → TrainerOverview
 */

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const PIE_COLORS = ["#FF5B3C", "#4F8EF7", "#FFB23C"]; // Admin, Trainer, User

// ─── Shared UI pieces ─────────────────────────────────────────────────────
function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1C1E24] p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#9A9CA6]">{label}</p>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-[#F5F3EF]">{value}</p>
    </div>
  );
}

function ProfileCard({ user, badgeLabel, badgeColor }) {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-[#1C1E24] p-6">
      <h2 className="text-sm font-semibold text-[#F5F3EF]">Profile</h2>
      <div className="mt-4 flex items-center gap-4">
        <img
          src={user?.image || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
          alt={user?.name}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-[#F5F3EF]">{user?.name}</p>
          <p className="text-xs text-[#9A9CA6]">{user?.email}</p>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize"
            style={{ backgroundColor: `${badgeColor}26`, color: badgeColor }}
          >
            {badgeLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function ApplicationStatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/15 text-amber-400",
    Approved: "bg-emerald-500/15 text-emerald-400",
    Rejected: "bg-red-500/15 text-red-400",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status] || "bg-white/10 text-[#9A9CA6]"}`}>
      {status}
    </span>
  );
}

// ─── User Overview ─────────────────────────────────────────────────────────
function UserOverview({ user }) {
  const [stats, setStats] = useState({ bookedCount: 0, favoritesCount: 0 });
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const controller = new AbortController();

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/user-stats?userEmail=${user.email}`, {
        signal: controller.signal,
      }).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/trainer-applications/my?userEmail=${user.email}`, {
        signal: controller.signal,
      }).then((r) => r.json()),
    ])
      .then(([statsData, appData]) => {
        setStats(statsData);
        setApplication(appData.application);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [user?.email]);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Total Booked Classes" value={loading ? "..." : stats.bookedCount} icon="📅" />
        <StatCard label="Total Favorites" value={loading ? "..." : stats.favoritesCount} icon="♥" />
      </div>

      <ProfileCard user={user} badgeLabel="User" badgeColor="#FF5B3C" />

      {!loading && application && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-[#1C1E24] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#F5F3EF]">Trainer Application</h2>
            <ApplicationStatusBadge status={application.status} />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-[#9A9CA6]">
            <p>Experience: {application.experience} years</p>
            <p>Specialty: {application.specialty}</p>
          </div>
          {application.status === "Rejected" && application.feedback && (
            <div className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-xs text-red-400">
              <span className="font-semibold">Admin feedback:</span> {application.feedback}
            </div>
          )}
        </div>
      )}
    </>
  );
}

// ─── Admin Overview ──────────────────────────────────────────────────────
function AdminOverview({ user }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClasses: 0,
    totalApprovedClasses: 0,
    totalBookedClasses: 0,
    classesByCategory: [],
    usersByRole: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    const controller = new AbortController();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats?email=${user.email}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [user?.email]);

  return (
    <>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Users" value={loading ? "..." : stats.totalUsers} icon="👥" />
        <StatCard
          label="Approved Classes"
          value={loading ? "..." : stats.totalApprovedClasses}
          icon="🏋️"
        />
        <StatCard
          label="Total Bookings"
          value={loading ? "..." : stats.totalBookedClasses}
          icon="💳"
        />
      </div>

      <ProfileCard user={user} badgeLabel="Admin" badgeColor="#FF5B3C" />

      {!loading && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {/* ── Classes by Category (Bar Chart) ── */}
          <div className="rounded-2xl border border-white/10 bg-[#1C1E24] p-6">
            <h2 className="mb-4 text-sm font-semibold text-[#F5F3EF]">Classes by Category</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.classesByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="category" stroke="#9A9CA6" fontSize={11} />
                <YAxis stroke="#9A9CA6" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#14151A",
                    border: "1px solid #ffffff1a",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#FF5B3C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── User Role Distribution (Pie Chart) ── */}
          <div className="rounded-2xl border border-white/10 bg-[#1C1E24] p-6">
            <h2 className="mb-4 text-sm font-semibold text-[#F5F3EF]">User Role Distribution</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.usersByRole}
                  dataKey="count"
                  nameKey="role"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ role, percent }) => `${role} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  fontSize={11}
                >
                  {stats.usersByRole.map((entry, index) => (
                    <Cell key={entry.role} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#14151A",
                    border: "1px solid #ffffff1a",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#9A9CA6", fontSize: 11 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Trainer Overview placeholder ────────────────────────────────────────
function TrainerOverview({ user }) {
  return (
    <>
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#1C1E24] p-6 text-center text-sm text-[#9A9CA6]">
        Trainer Overview — coming soon.
      </div>
      <ProfileCard user={user} badgeLabel="Trainer" badgeColor="#4F8EF7" />
    </>
  );
}

// ─── Main Page — role অনুযায়ী switch করে ────────────────────────────────
export default function DashboardOverviewPage() {
  const { user, loading: authLoading } = useAuth();
  const role = user?.role || "user";

  if (authLoading) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/5" />;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-xl font-bold text-[#F5F3EF]">Overview</h1>
      <p className="mt-1 text-sm text-[#9A9CA6]">Welcome back, {user?.name}.</p>

      {role === "admin" && <AdminOverview user={user} />}
      {role === "trainer" && <TrainerOverview user={user} />}
      {role === "user" && <UserOverview user={user} />}
    </div>
  );
}