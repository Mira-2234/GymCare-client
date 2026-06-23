"use client";

import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const features = [
    { 
      title: "Expert Trainers", 
      desc: "Access to verified, industry-certified professional fitness coaches.", 
      image: "https://cdn-icons-png.flaticon.com/512/2936/2936886.png" 
    },
    { 
      title: "Flexible Schedule", 
      desc: "Book and attend any time, fitting seamlessly into your busy lifestyle.", 
      image: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png" 
    },
    { 
      title: "Interactive Community", 
      desc: "Engage in active forums, share tips, and grow together with peers.", 
      image: "https://cdn-icons-png.flaticon.com/512/1256/1256650.png" 
    },
    { 
      title: "Secure Checkout", 
      desc: "Stripe-integrated seamless and secure subscription or class booking.", 
      image: "https://cdn-icons-png.flaticon.com/512/2182/2182502.png" 
    },
  ];

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
          <span className="text-[#FF5B3C] text-sm font-bold uppercase tracking-widest">Our Premium Edge</span>
          <h2 className="text-3xl font-extrabold mt-2 sm:text-4xl leading-tight">
            Why Fitness Enthusiasts Choose Us
          </h2>
          <p className="text-[#9A9CA6] mt-4 text-base leading-relaxed">
            We bridge the gap between world-class fitness coaching and passionate individuals who want a streamlined workout routine.
          </p>
        </motion.div>

     
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 bg-[#1C1E24] border border-white/5 rounded-2xl hover:border-[#FF5B3C]/20 transition group flex flex-col justify-between"
            >
              <div>
               
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-[#FF5B3C]/10 transition p-3">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-contain filter invert opacity-80 group-hover:opacity-100 transition"
                  />
                </div>
                <h3 className="text-lg font-bold mt-5 text-[#F5F3EF] group-hover:text-[#FF5B3C] transition">
                  {item.title}
                </h3>
                <p className="text-sm text-[#9A9CA6] mt-3 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}