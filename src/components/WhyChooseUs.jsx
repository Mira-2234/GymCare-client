export default function WhyChooseUs() {
  const features = [
    { title: "Expert Trainers", desc: "Access to verified, industry-certified professional fitness coaches.", icon: "💪" },
    { title: "Flexible Schedule", desc: "Book and attend any time, fitting seamlessly into your busy lifestyle.", icon: "📅" },
    { title: "Interactive Community", desc: "Engage in active forums, share tips, and grow together with peers.", icon: "🤝" },
    { title: "Secure Checkout", desc: "Stripe-integrated seamless and secure subscription or class booking.", icon: "💳" },
  ];

  return (
    <section className="py-20 bg-[#1C1D24] text-[#F5F3EF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-4">
            <span className="text-[#FF4500] text-sm font-bold uppercase tracking-widest">Our Premium Edge</span>
            <h2 className="text-4xl font-extrabold mt-2 leading-tight">Why Fitness Enthusiasts Choose Us</h2>
            <p className="text-[#9A9CA6] mt-4">We bridge the gap between world-class fitness coaching and passionate individuals who want a streamlined workout routine.</p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((item, idx) => (
              <div key={idx} className="p-6 bg-[#121318] border border-white/5 rounded-2xl hover:border-white/20 transition group">
                <div className="text-3xl bg-white/5 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-[#FF4500]/10 transition">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold mt-4">{item.title}</h3>
                <p className="text-sm text-[#9A9CA6] mt-2 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}