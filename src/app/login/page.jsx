"use client";

import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  // ফর্ম সাবমিট হ্যান্ডলার (আপনার Better Auth হ্যান্ডলারের সাথে কানেক্ট করবেন)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Auth logic goes here...
  };

  return (
    <section className="min-h-screen bg-[#14151A] flex items-center justify-center px-5 py-8">
      <div
        className="
          w-full
          max-w-4xl
          grid
          overflow-hidden
          rounded-[28px]
          border border-[#FF5B3C]/10
          bg-[#1A1C22]
          shadow-[0_0_100px_-40px_rgba(255,91,60,.30)]
          lg:grid-cols-2
        "
      >
        {/* LEFT IMAGE SECTION */}
        <div className="relative hidden lg:block">
          <img
            src="/g1.jpg" // আপনার পাবলিক ফোল্ডারের ইমেজ পাথ
            alt="Fitness Login"
            className="h-full w-full object-cover"
          />
          {/* রেজিস্ট্রেশন পেইজের সাথে মিল রেখে ওভারলে গ্রেডিয়েন্ট */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14151A] via-[#14151A]/20 to-transparent" />
          
          <div className="absolute left-8 bottom-8">
             <h2 className="text-4xl font-black leading-tight text-white">
              Train
              <br />
              Beyond Limits
            </h2>

            <p className="mt-3 max-w-[260px] text-sm text-gray-300">
              Build strength, discipline and confidence.
            </p>
          </div>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h1 className="text-3xl font-bold text-white">Sign In</h1>
            <p className="mt-2 text-sm text-[#9A9CA6]">
              Enter your credentials to access your dashboard
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              {/* EMAIL INPUT */}
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email Address"
                  className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-3 text-white outline-none focus:border-[#FF5B3C] transition-colors"
                />
              </div>

              {/* PASSWORD INPUT */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Password"
                  className="w-full rounded-xl border border-white/10 bg-[#14151A] px-5 py-3 text-white outline-none focus:border-[#FF5B3C] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-[#FF5B3C] hover:opacity-80 transition-opacity"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>

              {/* SIGN IN BUTTON */}
              <button
                type="submit"
                className="
                  w-full
                  rounded-xl
                  bg-[#FF5B3C]
                  py-3
                  font-semibold
                  text-black
                  transition
                  hover:scale-[1.02]
                  active:scale-[0.98]
                "
              >
                Sign In
              </button>
            </form>

            {/* SEPARATOR */}
            <div className="my-6 flex items-center">
              <div className="h-px flex-1 bg-white/10" />
              <span className="px-3 text-xs text-gray-500 tracking-wider">OR</span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* GOOGLE LOGIN BUTTON */}
            <button
              type="button"
              className="
                flex
                w-full
                items-center
                justify-center
                gap-3
                rounded-xl
                border
                border-white/10
                py-3
                text-white
                transition
                hover:border-[#FF5B3C]
                hover:bg-white/[0.02]
                active:scale-[0.98]
              "
            >
              <FcGoogle size={20} />
              Continue with Google
            </button>

            {/* REDIRECTION TO REGISTER */}
            <p className="mt-8 text-center text-sm text-gray-400">
              New to the platform?
              <Link
                href="/register"
                className="ml-2 font-semibold text-[#FF5B3C] hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}