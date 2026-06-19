"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#14151A]">
      <div className="relative flex items-center justify-center">
        
        <div className="h-24 w-24 animate-spin rounded-full border-4 border-t-[#FF5B3C] border-r-transparent border-b-[#FF5B3C]/20 border-l-transparent"></div>
        
        
        <div className="absolute h-16 w-16 animate-reverse-spin rounded-full border-4 border-t-transparent border-r-white border-b-transparent border-l-white/20"></div>
        
     
        <div className="absolute text-[#FF5B3C] animate-pulse">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
      </div>

      
      <h2 className="mt-8 text-xl font-black tracking-widest text-white uppercase animate-pulse">
        GymCare
      </h2>
      <p className="mt-2 text-xs tracking-wider text-[#9A9CA6] uppercase">
        Loading Your Journey...
      </p>

   
      <style jsx global>{`
        @keyframes reverse-spin {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        .animate-reverse-spin {
          animation: reverse-spin 1.5s linear infinite;
        }
      `}</style>
    </div>
  );
}