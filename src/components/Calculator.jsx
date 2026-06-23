"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FitnessCalculatorPage() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [statusColor, setStatusColor] = useState("");
  const [advice, setAdvice] = useState("Enter your details to calculate your BMI and get personalized health insights.");

  const calculateBMI = (e) => {
    e.preventDefault();
    if (!weight || !height) return;

    const heightInMeters = height / 100;
    const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    setBmi(bmiValue);

    if (bmiValue < 18.5) {
      setStatus("Underweight");
      setStatusColor("text-amber-400 bg-amber-500/10 border-amber-500/20");
      setAdvice("Focus on nutrient-dense foods, healthy fats, and strength training to build lean muscle mass safely.");
    } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
      setStatus("Normal Weight (Healthy)");
      setStatusColor("text-emerald-400 bg-emerald-500/10 border-emerald-500/20");
      setAdvice("Great job! Your weight is in the ideal range. Maintain your active lifestyle and balanced diet.");
    } else if (bmiValue >= 25 && bmiValue <= 29.9) {
      setStatus("Overweight");
      setStatusColor("text-orange-400 bg-orange-500/10 border-orange-500/20");
      setAdvice("Consider incorporating more cardio sessions, tracking your daily calorie intake, and managing portion sizes.");
    } else {
      setStatus("Obese");
      setStatusColor("text-red-400 bg-red-500/10 border-red-500/20");
      setAdvice("We highly recommend consulting a fitness coach and a nutritionist to create a structured fat-loss blueprint.");
    }
  };

  const resetForm = () => {
    setWeight("");
    setHeight("");
    setBmi(null);
    setStatus("");
    setStatusColor("");
    setAdvice("Enter your details to calculate your BMI and get personalized health insights.");
  };

  return (
    <div className="min-h-screen bg-[#14151A] text-[#F5F3EF] py-16 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="mx-auto max-w-5xl w-full">
        
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center lg:text-left mb-12"
        >
          <h1 className="text-3xl font-extrabold text-[#F5F3EF] sm:text-4xl text-center">
            Body Mass <span className="text-[#FF5B3C]">Index</span>
          </h1>
          <p className="mt-2 text-sm text-[#9A9CA6] text-center">
            Track your fitness blueprint using our split-screen health analyzer.
          </p>
        </motion.div>

        {/* ─── Split Screen Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side: Calculator Form */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 rounded-2xl border border-white/10 bg-[#1C1E24] p-6 sm:p-8 flex flex-col justify-between shadow-2xl"
          >
            <form onSubmit={calculateBMI} className="space-y-6">
              <h2 className="text-lg font-bold text-[#F5F3EF] border-b border-white/5 pb-3">Calculator</h2>
              <div>
                <label className="block text-xs font-semibold text-[#9A9CA6] uppercase tracking-wider mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 72"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] placeholder-[#9A9CA6]/40 focus:border-[#FF5B3C] focus:outline-none focus:ring-1 focus:ring-[#FF5B3C] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#9A9CA6] uppercase tracking-wider mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 178"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#14151A] px-4 py-3 text-sm text-[#F5F3EF] placeholder-[#9A9CA6]/40 focus:border-[#FF5B3C] focus:outline-none focus:ring-1 focus:ring-[#FF5B3C] transition-all"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex-1 rounded-xl bg-[#FF5B3C] py-3 text-sm font-bold text-white transition-colors hover:bg-[#ff4a24] shadow-lg shadow-[#FF5B3C]/10"
                >
                  Calculate
                </motion.button>
                
                {bmi && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-[#9A9CA6] hover:bg-white/10 transition"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>

            {/* Standard Metrics reference on bottom of left card */}
            <div className="mt-8 grid grid-cols-2 gap-2 text-[11px] text-[#9A9CA6] bg-[#14151A]/60 p-3 rounded-xl border border-white/5">
              <p>Underweight: &lt; 18.5</p>
              <p>Healthy: 18.5 – 24.9</p>
              <p>Overweight: 25 – 29.9</p>
              <p>Obese: 30 or more</p>
            </div>
          </motion.div>

          {/* Right Side: Dynamic Illustrator & Results Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-7 rounded-2xl border border-white/10 bg-[#1C1E24] p-8 flex flex-col justify-between items-center text-center shadow-2xl relative overflow-hidden bg-gradient-to-br from-[#1C1E24] to-[#14151A]"
          >
            <div className="w-full">
              <h2 className="text-left text-sm font-semibold uppercase tracking-widest text-[#9A9CA6] mb-6">
                Analysis & Insights
              </h2>

              <AnimatePresence mode="wait">
                {!bmi ? (
                  /* Default Fitness Graphic when no result */
                  <motion.div
                    key="graphic"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-8"
                  >
                    <div className="w-40 h-40 rounded-full bg-[#FF5B3C]/5 border border-[#FF5B3C]/10 flex items-center justify-center mb-6">
                      <svg className="w-20 h-20 text-[#FF5B3C] opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
                      </svg>
                    </div>
                  </motion.div>
                ) : (
                  /* Dynamic Results display */
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-xs text-[#9A9CA6] uppercase tracking-widest font-semibold">Your Calculated BMI</p>
                    <motion.h3 
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="text-6xl font-black text-[#F5F3EF] tracking-tight"
                    >
                      {bmi}
                    </motion.h3>
                    <div className={`inline-block rounded-xl border px-4 py-1.5 text-xs font-extrabold capitalize tracking-wide ${statusColor}`}>
                      {status}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Dynamic Content Advice Text Box */}
            <div className="w-full bg-[#14151A] border border-white/5 p-5 rounded-xl text-sm text-[#9A9CA6] leading-relaxed mt-6">
              <span className="block text-xs font-bold text-[#F5F3EF] uppercase tracking-wider mb-2 text-left">
                Trainer's Recommendation:
              </span>
              <p className="text-left text-xs sm:text-sm">{advice}</p>
            </div>

          </motion.div>

        </div>
      </div>
    </div>
  );
}