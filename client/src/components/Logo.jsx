import React from "react";

const Logo = ({ className = "h-10 w-auto", showText = true }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="h-full aspect-square">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Organic Circles (Spectrum) */}
          <circle cx="50" cy="50" r="40" fill="url(#spectrum-gradient)" opacity="0.1" />
          
          {/* Overlapping paths for the "Radiant" feel */}
          <path
            d="M50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C33.4315 80 20 66.5685 20 50"
            stroke="url(#gradient-1)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M30 40C30 28.9543 38.9543 20 50 20C61.0457 20 70 28.9543 70 40C70 51.0457 61.0457 60 50 60"
            stroke="url(#gradient-2)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.6"
          />
          
          <defs>
            <linearGradient id="spectrum-gradient" x1="0" y1="0" x2="100" y2="100">
              <stop stopColor="var(--color-sky-calm)" />
              <stop offset="1" stopColor="var(--color-lavender)" />
            </linearGradient>
            <linearGradient id="gradient-1" x1="20" y1="50" x2="80" y2="50">
              <stop stopColor="var(--color-sky-calm)" />
              <stop offset="1" stopColor="var(--color-mint)" />
            </linearGradient>
            <linearGradient id="gradient-2" x1="30" y1="40" x2="70" y2="40">
              <stop stopColor="var(--color-lavender)" />
              <stop offset="1" stopColor="var(--color-apricot)" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className="font-bold text-xl tracking-tight text-gradient bg-gradient-to-l from-[var(--color-sky-calm-dark)] to-[var(--color-lavender-dark)]">
          مُبـدع
        </span>
      )}
    </div>
  );
};

export default Logo;
