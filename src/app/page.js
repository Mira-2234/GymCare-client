
import Link from "next/link";
import Hero from "@/components/Hero"; 
import StatsPage from "@/components/Stats";
import FeaturedClasses from "@/components/FeaturedClasses";
import { FormStateSubscribe } from "react-hook-form";
import LatestForumPosts from "@/components/LatestForumPosts";
import SuccessStories from "@/components/SuccessStories";
import WhyChooseUs from "@/components/WhyChooseUs";

import FitnessCalculatorPage from "@/components/Calculator";



export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedClasses/>
       <LatestForumPosts/>
       
       <FitnessCalculatorPage/>
       <SuccessStories/>
       <WhyChooseUs/>
      
     
    </main>
  );
}