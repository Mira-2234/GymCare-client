"use client";

import { motion } from "framer-motion";

const SUCCESS_STORIES = [
  {
    id: 1,
    name: "Tasmim Mira",
    role: "Frontend Developer",
    transformation: "Lost 12kg & Built Lean Muscle",
    quote: "Thanks to GymCare's flexible scheduling, I perfectly balanced my workout routine alongside heavy coding sessions. The Stripe payment and class booking system is absolutely seamless!",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    duration: "6 Months Journey",
  },
  {
    id: 2,
    name: "Arif Rahman",
    role: "Corporate Executive",
    transformation: "Gained 8kg Lean Mass & Strength",
    quote: "The personalized guidance from certified trainers completely reshaped my lifestyle. The interactive community forum, in particular, kept me accountable and motivated every single day.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    duration: "4 Months Journey",
  },
  {
    id: 3,
    name: "Fariha Islam",
    role: "UI/UX Designer",
    transformation: "Achieved Core Strength & Flexibility",
    quote: "The dashboard layout and built-in BMI health tracker are incredibly user-friendly. Real-time coach feedback allowed me to adjust my training split and hit my fitness goals ahead of schedule.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    duration: "3 Months Journey",
  }
];

export default function SuccessStories() {
  return (
    <section className="py-20 bg-[#14151A] text-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[#FF5B3C] text-sm font-bold uppercase tracking-widest">Inspiration</span>
          <h2 className="text-3xl font-extrabold mt-2 sm:text-4xl leading-tight">
            Real Transformations, Real Stories
          </h2>
          <p className="text-[#9A9CA6] mt-4 text-base">
            See how our members have smashed their fitness goals and rewritten their health blueprints.
          </p>
        </motion.div>

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SUCCESS_STORIES.map((story, idx) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="p-6 bg-[#1C1E24] border border-white/5 rounded-2xl hover:border-[#FF5B3C]/30 transition group flex flex-col justify-between shadow-2xl relative overflow-hidden"
            >
             
              <span className="absolute right-6 top-4 text-7xl font-serif text-white/5 group-hover:text-[#FF5B3C]/10 transition pointer-events-none select-none">
                “
              </span>

              <div>
              
                <span className="inline-block rounded-lg bg-[#FF5B3C]/10 border border-[#FF5B3C]/20 px-3 py-1 text-xs font-bold text-[#FF5B3C] mb-4">
                  {story.transformation}
                </span>

               
                <p className="text-sm sm:text-base text-[#9A9CA6] italic leading-relaxed group-hover:text-[#F5F3EF] transition duration-300">
                  "{story.quote}"
                </p>
              </div>

         
              <div className="mt-8 flex items-center gap-4 pt-4 border-t border-white/5">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white/10 group-hover:border-[#FF5B3C] transition"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#F5F3EF]">{story.name}</h4>
                  <p className="text-[11px] text-[#9A9CA6]">{story.role}</p>
                  <span className="text-[10px] text-[#FF5B3C]/80 font-semibold block mt-0.5">
                    {story.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}