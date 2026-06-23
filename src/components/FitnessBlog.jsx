"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BLOG_POSTS = [
  {
    id: 1,
    title: "5 Essential Exercises for Building Lean Muscle",
    category: "Workout",
    date: "June 18, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
    excerpt: "Discover the foundational compound movements that every beginner should incorporate into their routine to maximize strength gains.",
    author: "Trainer Rahat",
  },
  {
    id: 2,
    title: "The Ultimate Guide to Pre-Workout Nutrition",
    category: "Diet & Nutrition",
    date: "June 15, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1546483875-5f0147a5c643?q=80&w=600&auto=format&fit=crop",
    excerpt: "Fueling your body correctly before a intense gym session can drastically improve your performance and stamina. Here is what to eat.",
    author: "Nutritionist Sarah",
  },
  {
    id: 3,
    title: "Mental Discipline: Staying Motivated in the Gym",
    category: "Mindset",
    date: "June 10, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop",
    excerpt: "Fitness is 80% mental. Learn the cognitive strategies elite athletes use to overcome workout fatigue and consistency slumps.",
    author: "Coach Asif",
  }
];

export default function FitnessBlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Workout", "Diet & Nutrition", "Mindset"];

  const filteredBlogs = activeCategory === "All" 
    ? BLOG_POSTS 
    : BLOG_POSTS.filter(blog => blog.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#14151A] text-[#F5F3EF] py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-[#F5F3EF] sm:text-5xl">
            Fitness <span className="text-[#FF5B3C]">Insights</span>
          </h1>
          <p className="mt-4 text-lg text-[#9A9CA6] max-w-xl mx-auto">
            Expert advice on training, nutrition, and lifestyle to help you achieve your fitness goals faster.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeCategory === category
                  ? "bg-[#FF5B3C] text-white shadow-lg shadow-[#FF5B3C]/20"
                  : "bg-[#1C1E24] text-[#9A9CA6] border border-white/5 hover:border-white/20"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        <motion.div 
          layout
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, index) => (
              <motion.article 
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                key={blog.id} 
                className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#1C1E24] hover:border-[#FF5B3C]/30 shadow-xl"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-lg bg-[#FF5B3C] px-3 py-1 text-xs font-semibold text-white">
                    {blog.category}
                  </span>
                </div>
                
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 text-xs text-[#9A9CA6] mb-3">
                      <span>{blog.date}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#F5F3EF] line-clamp-2 hover:text-[#FF5B3C] cursor-pointer transition-colors">
                      {blog.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#9A9CA6] line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs font-medium text-[#F5F3EF]">By {blog.author}</span>
                    <motion.button 
                      whileHover={{ x: 4 }}
                      className="text-xs font-bold text-[#FF5B3C] flex items-center gap-1"
                    >
                      Read More →
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </div>
  );
}