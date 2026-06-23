"use client";
import { motion } from "framer-motion";

export default function SuccessStories() {
  const stories = [
    { name: "Alex Rivera", change: "Lost 25 lbs", role: "Corporate Professional", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=400" },
    { name: "Sarah Jenkins", change: "Gained Muscle", role: "Mother of Two", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=400" },
    { name: "David Kim", change: "Increased Stamina", role: "Software Engineer", img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=400" },
  ];

  return (
    <section className="py-20 bg-[#121318] text-[#F5F3EF] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight">Real Transformations, Real Results</h2>
          <p className="text-[#9A9CA6] mt-3 max-w-xl mx-auto">See how our community members completely reshaped their lives and fitness journeys.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              whileHover={{ scale: 1.03, translateY: -5 }}
              className="bg-[#1C1D24] border border-white/5 rounded-2xl overflow-hidden shadow-xl group"
            >
              <div className="h-64 overflow-hidden relative">
                <img src={story.img} alt={story.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                <div className="absolute top-4 left-4 bg-[#FF4500] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full text-white">
                  {story.change}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold">{story.name}</h3>
                <p className="text-sm text-[#9A9CA6] mt-1">{story.role}</p>
                <p className="text-sm mt-4 text-[#6B6D78] italic">"Joining this platform was the best decision of my fitness journey. The trainers are top-notch!"</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}