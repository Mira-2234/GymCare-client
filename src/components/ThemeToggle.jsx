"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration ম্যাচ করার জন্য মাউন্ট হওয়া পর্যন্ত অপেক্ষা করা
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />; // ব্ল্যাঙ্ক স্পেস হোল্ডার
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-xl bg-white/5 border border-white/10 text-[#9A9CA6] hover:text-[#F5F3EF] dark:bg-white/5 dark:border-white/10 dark:text-[#9A9CA6] dark:hover:text-[#F5F3EF] light:bg-black/5 light:border-black/10 light:text-black/60 transition-all duration-300"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-indigo-600" />
      )}
    </button>
  );
}