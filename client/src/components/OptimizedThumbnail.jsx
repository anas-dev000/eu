import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * OptimizedThumbnail — A performance-first component for video thumbnails.
 * Features:
 * 1. Animated Skeleton Placeholder (Shimmer)
 * 2. Progressive Image Loading
 * 3. Smooth Fade-in Transition
 * 4. Lazy Loading by default
 */
const OptimizedThumbnail = ({ src, alt, className = "", onClick }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer ${className}`} 
      onClick={onClick}
    >
      {/* Skeleton Shimmer Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-shimmer"
            style={{
              backgroundSize: "200% 100%",
              animation: "shimmer 2s infinite linear",
            }}
          />
        )}
      </AnimatePresence>

      {/* Actual Thumbnail */}
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ 
          opacity: isLoaded ? 1 : 0, 
          scale: isLoaded ? 1 : 1.05 
        }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full h-full object-cover ${isLoaded ? "block" : "invisible"}`}
      />

      {/* Play Icon Placeholder (Optional - if handled by parent, this can be ignored) */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background: linear-gradient(
            90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.4) 50%, 
            rgba(255,255,255,0) 100%
          ), var(--color-cloud-dark);
          background-size: 200% 100%;
        }
      `}</style>
    </div>
  );
};

export default OptimizedThumbnail;
