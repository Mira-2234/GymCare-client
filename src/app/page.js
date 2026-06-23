
import Link from "next/link";
import Hero from "@/components/Hero"; 
import StatsPage from "@/components/Stats";
import FeaturedClasses from "@/components/FeaturedClasses";
import { FormStateSubscribe } from "react-hook-form";
import LatestForumPosts from "@/components/LatestForumPosts";
import SuccessStories from "@/components/SuccessStories";
import WhyChooseUs from "@/components/WhyChooseUs";
import FitnessBlogPage from "@/components/FitnessBlog";
import FitnessCalculatorPage from "@/components/Calculator";

// const FEATURED_CLASSES = [
//   {
//     id: "power-yoga-flow",
//     name: "Power Yoga Flow",
//     trainer: "Aisha Khan",
//     category: "Yoga",
//     price: 25,
//     duration: "60 min",
//     bookingCount: 184,
//     image: "https://loremflickr.com/480/300/yoga",
//   },
//   {
//     id: "strength-foundations",
//     name: "Strength Foundations",
//     trainer: "Marcus Reed",
//     category: "Weights",
//     price: 30,
//     duration: "45 min",
//     bookingCount: 152,
//     image: "https://loremflickr.com/480/300/weightlifting,gym",
//   },
//   {
//     id: "hiit-ignite",
//     name: "HIIT Ignite",
//     trainer: "Priya Sharma",
//     category: "Cardio",
//     price: 20,
//     duration: "30 min",
//     bookingCount: 211,
//     image: "https://loremflickr.com/480/300/cardio,running",
//   },
// ];



// const HOW_IT_WORKS = [
//   { step: "01", title: "Browse classes", description: "Filter by category and find a class that fits your schedule." },
//   { step: "02", title: "Book and pay", description: "Secure checkout with Stripe, confirmed instantly." },
//   { step: "03", title: "Show up and train", description: "Your trainer already has your spot ready." },
// ];

// const STATS = [
//   { value: "1,200+", label: "Members" },
//   { value: "85", label: "Trainers" },
//   { value: "340", label: "Weekly classes" },
// ];

// function FeaturedClasses() {
//   return (
//     <section className="bg-[#14151A] px-6 py-14">
//       <div className="mx-auto max-w-6xl">
//         <h2 className="mb-6 text-sm font-medium text-[#9A9CA6]">Featured classes</h2>
//         <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {FEATURED_CLASSES.map((cls) => (
//             <div
//               key={cls.id}
//               className="overflow-hidden rounded-lg border border-white/10 bg-[#1C1E24]"
//             >
//               <img src={cls.image} alt={cls.name} className="h-36 w-full object-cover" />
//               <div className="p-4">
//                 <p className="text-sm font-semibold text-[#F5F3EF]">{cls.name}</p>
//                 <p className="mt-1 text-xs text-[#9A9CA6]">
//                   {cls.trainer} · {cls.category}
//                 </p>
//                 <div className="mt-3 flex items-center justify-between text-xs text-[#9A9CA6]">
//                   <span>
//                     ${cls.price} / {cls.duration}
//                   </span>
//                   <span>{cls.bookingCount} booked</span>
//                 </div>
//                 <Link
//                   href={`/classes/${cls.id}`}
//                   className="mt-4 inline-block text-xs font-medium text-[#FF5B3C] hover:underline"
//                 >
//                   View details
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function LatestForumPosts() {
//   return (
//     <section className="bg-[#14151A] px-6 py-14">
//       <div className="mx-auto max-w-6xl">
//         <h2 className="mb-6 text-sm font-medium text-[#9A9CA6]">Latest from the forum</h2>
//         <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
//           {LATEST_POSTS.map((post) => (
//             <div
//               key={post.id}
//               className="overflow-hidden rounded-lg border border-white/10 bg-[#1C1E24]"
//             >
//               <img src={post.image} alt={post.title} className="h-32 w-full object-cover" />
//               <div className="p-4">
//                 <p className="text-sm font-semibold text-[#F5F3EF]">{post.title}</p>
//                 <p className="mt-1 text-xs text-[#9A9CA6]">{post.author}</p>
//                 <p className="mt-2 text-xs text-[#9A9CA6] line-clamp-2">{post.excerpt}</p>
//                 {/* Forum Post Details is a private route — logged out users still see
//                     the preview card here, but clicking through will land them on
//                     /login first (handled by your PrivateRoute / middleware). */}
//                 <Link
//                   href={`/forum/${post.id}`}
//                   className="mt-3 inline-block text-xs font-medium text-[#FF5B3C] hover:underline"
//                 >
//                   Read more
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function HowItWorks() {
//   return (
//     <section className="bg-[#14151A] px-6 py-14">
//       <div className="mx-auto max-w-4xl">
//         <h2 className="mb-6 text-sm font-medium text-[#9A9CA6]">How it works</h2>
//         <div className="grid gap-8 text-center sm:grid-cols-3">
//           {HOW_IT_WORKS.map((item) => (
//             <div key={item.step}>
//               <p className="text-xs font-semibold text-[#FF5B3C]">{item.step}</p>
//               <p className="mt-2 text-sm font-semibold text-[#F5F3EF]">{item.title}</p>
//               <p className="mt-1 text-xs text-[#9A9CA6]">{item.description}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

// function StatsStrip() {
//   return (
//     <section className="border-t border-white/10 bg-[#14151A] px-6 py-10">
//       <div className="mx-auto grid max-w-4xl grid-cols-3 text-center">
//         {STATS.map((stat) => (
//           <div key={stat.label}>
//             <p className="text-2xl font-semibold text-[#F5F3EF]">{stat.value}</p>
//             <p className="mt-1 text-xs text-[#9A9CA6]">{stat.label}</p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedClasses/>
       <LatestForumPosts/>
       {/* <FitnessBlogPage/> */}
       <FitnessCalculatorPage/>
       <SuccessStories/>
       <WhyChooseUs/>
      
     
    </main>
  );
}