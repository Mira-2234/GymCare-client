"use client";

import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

export default function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(true);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="w-9 h-9 rounded-xl flex items-center justify-center border border-white/5 bg-slate-900/50 text-yellow-400 hover:bg-slate-800/80 transition-all duration-200 cursor-pointer"
      aria-label="Toggle theme"
    >
      {isDark ? <FaSun size={15} /> : <FaMoon size={14} className="text-slate-300" />}
    </button>
  );
}