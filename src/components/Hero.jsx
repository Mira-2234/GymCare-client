"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  const stats = [
  {
    title: "Total Members",
    value: "12,40+",
  },
  
  {
    title: "Classes Running",
    value: "120+",
  },
 
  {
    title: "Success Rate",
    value: "98%",
  },
   {
    title: "Active Trainers",
    value: "85+",
  },
  
];
  return (
    <section className="relative overflow-hidden bg-[#14151A] px-6 py-20">
      <svg
        className="absolute left-0 top-10 w-full opacity-[0.12]"
        height="120"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M0 60 H360 L420 10 L500 110 L560 60 H1200"
          stroke="#FF5B3C"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
      </svg>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        {/* Text column */}
        <div className="text-center lg:max-w-md lg:text-left">
        <motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1 mt-5 border border-white/10 backdrop-blur-sm"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[#FF5B3C]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
    />
  </svg>

  <span className="text-[11px] text-[#F5F3EF]">
    Transform Your Body & Mind
  </span>
</motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-3 text-4xl font-extrabold text-[#F5F3EF] sm:text-5xl"
          >
               Achieve Your Fitness Goals With Us
             </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 max-w-md text-sm text-[#9A9CA6] lg:mx-0"
          >
           Join thousands of fitness enthusiasts who have transformed their lives through our world-class trainers, diverse classes, and supportive community.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8"
          >
            <Link
              href="/classes"
              className="inline-block rounded-md bg-[#FF5B3C] px-7 py-3 text-sm font-semibold text-[#1A0703] transition-transform hover:scale-[1.02] mx-2"
            >
              Explore classes
            </Link>
            <Link
              href="/classes"
              className="inline-block rounded-md border border-[#FF5B3C] px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            >
              Watch Video
            </Link>
          </motion.div>

        

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 mt-5">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              className="group"
            >
              <h2 className="mt-4 text-xl font-bold text-[#FF5B3C]">
                {stat.value}
              </h2>

              <h3 className="text-[10px]  text-gray-400">
                {stat.title}
              </h3>

            </motion.div>
          ))}
        </div>
        </div>

        {/* Image column — swap the src for a real uploaded photo when ready */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative w-full max-w-sm shrink-0"
        >
          <div className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center mt-10">
            <motion.span
              className="absolute h-3 w-3 rounded-full bg-[#FF5B3C]"
              animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
            />
            <span className="h-2 w-2 rounded-full bg-[#FF5B3C]" />
          </div>

          {/* Interim placeholder via LoremFlickr. For the final deploy, swap
              this for a licensed photo matching this vibe — search "fitness
              model gym dumbbell" on Pexels/Unsplash for free, usable shots,
              then point src at your own /public/hero.jpg or Imgbb URL. */}
          <img
  src="/gym.jpg"
  alt="Gym athlete"

  className="
  aspect-[4/5]
  w-full

  rounded-[28px]

  border
  border-[#FF5B3C]/15

  object-cover mt-10
  
  shadow-[0_0_90px_-10px_rgba(255,91,60,.35)]

  hover:scale-[1.02]

  transition
  duration-700
  "
/>
        </motion.div>
      </div>
    </section>
  );
}