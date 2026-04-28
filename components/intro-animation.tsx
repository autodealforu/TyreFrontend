'use client';

import { useState, useEffect } from 'react';

export default function IntroAnimation() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide overflow for the brief animation time so scrolling doesn't break
    document.body.style.overflow = 'hidden';

    const timer = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = '';
    }, 4000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-[#14213d] flex items-center justify-center overflow-hidden fade-out-bg pointer-events-none">

      {/* Dynamic Background Accents */}
      <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-transparent to-red-600/10 z-0"></div>

      {/* Brand Text Revealing Behind Tyre */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
        <h1 className="text-5xl md:text-7xl lg:text-9xl font-black uppercase tracking-wider opacity-0 animate-brand-reveal drop-shadow-2xl flex items-center">
          <span className="text-white">Auto</span>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-[#fca311] to-[#dc3545] mx-1">deal</span>
          <span className="text-white">4U</span>
        </h1>
        <p className="text-gray-400 tracking-[0.4em] text-xs md:text-sm lg:text-base opacity-0 animate-subtitle-reveal mt-4 font-semibold uppercase">
          Premium Tyre Solutions
        </p>
      </div>

      <div className="animate-tyre-roll relative z-20">
        <svg width="250" height="250" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
          {/* Tyre Outer Wall */}
          <circle cx="50" cy="50" r="48" fill="#1A1A1A" stroke="#0F0F0F" strokeWidth="2" />

          {/* Deep Tyre Treads Loop */}
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M 50 2 C 55 2 55 12 50 12"
              stroke="#0D0D0D"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              transform={`rotate(${i * 22.5} 50 50)`}
            />
          ))}

          {/* Inner Tyre Bead */}
          <circle cx="50" cy="50" r="28" fill="#111" stroke="#2A2A2A" strokeWidth="1" />
          <circle cx="50" cy="50" r="26" fill="#141414" />

          {/* Modern 5-Spoke Alloy Rim in Bronze/Gold (#fca311) */}
          {Array.from({ length: 5 }).map((_, i) => (
            <polygon
              key={i}
              points="45,28 55,28 52,18 48,18"
              fill="#ffc300"
              opacity="0.8"
              transform={`rotate(${i * 72} 50 50)`}
            />
          ))}

          {/* Alloy Base Layer */}
          <circle cx="50" cy="50" r="20" fill="#222" stroke="#444" strokeWidth="2" />

          {/* Center Cap with subtle brand dot */}
          <circle cx="50" cy="50" r="8" fill="#111" stroke="#e5e5e5" strokeWidth="1" />
          <circle cx="50" cy="50" r="3" fill="#dc3545" />

          {/* Lug Nuts */}
          {Array.from({ length: 5 }).map((_, i) => (
            <circle
              key={`lug-${i}`}
              cx="50"
              cy="45"
              r="2"
              fill="#888"
              transform={`rotate(${(i * 72) + 36} 50 50)`}
            />
          ))}
        </svg>

        {/* Speed Lines Effect */}
        <div className="absolute top-1/2 left-0 -translate-x-[150px] -translate-y-1/2 w-[120px] h-[3px] bg-linear-to-l from-white/40 to-transparent rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
        <div className="absolute top-1/4 left-0 -translate-x-[100px] -translate-y-1/2 w-20 h-0.5 bg-linear-to-l from-[#fca311]/60 to-transparent rounded-full"></div>
        <div className="absolute top-3/4 left-0 -translate-x-[120px] -translate-y-1/2 w-[100px] h-0.5 bg-linear-to-l from-[#dc3545]/60 to-transparent rounded-full"></div>
      </div>

      <style>{`
        @keyframes rollAcross {
          0% { transform: translateX(0vw) rotate(0deg); }
          100% { transform: translateX(140vw) rotate(1440deg); }
        }

        .animate-tyre-roll {
          animation: rollAcross 3.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          position: absolute;
          left: -20vw;
          will-change: transform;
        }

        .animate-brand-reveal {
          animation: revealText 2.5s ease-out 0.4s forwards;
          will-change: opacity, transform, letter-spacing;
        }

        .animate-subtitle-reveal {
          animation: revealSubtitle 2s ease-out 1s forwards;
          will-change: opacity, transform;
        }

        @keyframes revealText {
          0% { opacity: 0; transform: scale(0.95); letter-spacing: 0.05em; }
          100% { opacity: 1; transform: scale(1); letter-spacing: 0.1em; }
        }

        @keyframes revealSubtitle {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .fade-out-bg {
          animation: fadeOutBg 0.6s ease-out 3.4s forwards;
          will-change: opacity;
        }

        @keyframes fadeOutBg {
          from { opacity: 1; }
          to { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
}
