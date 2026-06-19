"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <main
      className="
      min-h-screen

      bg-[#14151A]

      flex
      items-center
      justify-center

      px-6
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
        text-center
        max-w-xl
        "
      >
        {/* 404 */}

        <h1
          className="
          text-[100px]
          sm:text-[180px]

          font-black

          leading-none

          text-[#FF5B3C]
          "
        >
          404
        </h1>

        {/* TEXT */}

        <h2
          className="
          mt-2

          text-3xl
          sm:text-4xl

          font-bold

          text-white
          "
        >
          Page Not Found
        </h2>

        <p
          className="
          mt-4

          text-slate-400

          leading-8
          "
        >
          The page you are looking for doesn’t exist
          or has been moved.
        </p>

        {/* BUTTON */}

        <Link
          href="/"
          className="
          inline-flex

          mt-10

          rounded-xl

          bg-[#FF5B3C]

          px-8
          py-4

          text-sm
          font-semibold

          text-[#14151A]

          hover:scale-[1.03]

          transition
          "
        >
          Back To Home
        </Link>
      </motion.div>
    </main>
  );
}