import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import {
  titleVariants,
  itemVariants,
} from "../utils/animations";
import { ChevronRight, ChevronLeft, Mic, Play } from "lucide-react";
import OptimizedThumbnail from "../components/OptimizedThumbnail";

const podcasts = [
  {
    id: "s3Lgh7ZFUe8",
    title: "التوحد الخفيف",
    description:
      "التوحد الخفيف هو نوع من اضطراب طيف التوحد يتميز بصعوبات بسيطة في التواصل الاجتماعي والسلوك، ويكون الشخص قادرًا على التعلم والتحدث والتفاعل لكن بشكل مختلف قليلاً عن الآخرين.",
    color: "var(--color-mint)",
    badge: "المستوى الأول",
  },
  {
    id: "5OeBFPuHITk",
    title: "التوحد المتوسط",
    description:
      "التوحد المتوسط هو مستوى من اضطراب طيف التوحد يُظهر فيه الشخص صعوبات واضحة في التواصل والتفاعل الاجتماعي، مع وجود سلوكيات متكررة واحتياجات لدعم أكبر.",
    color: "var(--color-sky-calm)",
    badge: "المستوى الثاني",
  },
  {
    id: "fh5_q36ffB8",
    title: "التوحد الشديد",
    description:
      "التوحد الشديد هو أعلى درجات اضطراب طيف التوحد، ويتميز بصعوبات كبيرة في التواصل والسلوك، مع اعتماد كبير على الدعم والمساعدة في الحياة اليومية.",
    color: "var(--color-lavender)",
    badge: "المستوى الثالث",
  },
];

const Podcasts = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);

  const nextPodcast = () => {
    if (currentIndex < podcasts.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevPodcast = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <Layout>
      <section className="section-block">
        <div className="container-content">
          <motion.div 
            className="flex items-center justify-center gap-3 mb-2"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            <Mic size={32} className="text-[var(--color-sky-calm-dark)]" />
            <h1 className="section-heading !mb-0 text-gradient">
              البودكاست
            </h1>
          </motion.div>
          <motion.p
            className="text-intro"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            نقدم سلسلة من البودكاست التعليمية التي تهدف إلى توعية الأفراد
            وأسرهم حول اضطراب طيف التوحد. كل بودكاست يركز على مستوى مختلف.
          </motion.p>
        </div>
      </section>

      <section className="section-block pt-0">
        <div className="container-content max-w-4xl mx-auto">
          {/* Step Indicator */}
          <div className="flex justify-center items-center gap-4 mb-10">
            {podcasts.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`
                  h-3 transition-all duration-500 rounded-full
                  ${currentIndex === index 
                    ? "w-12 bg-[var(--color-sky-calm)] shadow-glow" 
                    : "w-3 bg-[var(--color-cloud-dark)] hover:bg-[var(--color-sky-calm-light)]"
                  }
                `}
                aria-label={`الانتقال إلى ${podcasts[index].badge}`}
              />
            ))}
          </div>

          {/* Sequential Viewer */}
          <div className="relative overflow-hidden min-h-[500px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className="w-full"
              >
                <div className="card-base !p-0 overflow-hidden border-2 border-[var(--color-cloud-dark)] shadow-lg">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Content Column */}
                    <div className="p-8 flex flex-col justify-center bg-white order-2 lg:order-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                          style={{ background: podcasts[currentIndex].color }}
                        >
                          {podcasts[currentIndex].badge}
                        </span>
                        <Play size={18} className="text-[var(--color-sky-calm)] fill-current" />
                      </div>
                      <h2 className="text-2xl font-bold mb-4 text-[var(--color-ink)]">
                        {podcasts[currentIndex].title}
                      </h2>
                      <p className="text-[var(--color-ink-light)] leading-relaxed mb-8">
                        {podcasts[currentIndex].description}
                      </p>

                      {/* Navigation Controls */}
                      <div className="flex items-center gap-4 mt-auto">
                        <button
                          onClick={prevPodcast}
                          disabled={currentIndex === 0}
                          className={`
                            p-3 rounded-full transition-all duration-300
                            ${currentIndex === 0 
                              ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                              : "bg-[var(--color-cloud)] text-[var(--color-sky-calm-dark)] hover:bg-[var(--color-sky-calm)] hover:text-white hover:shadow-md"
                            }
                          `}
                          aria-label="السابق"
                        >
                          <ChevronRight size={24} />
                        </button>
                        
                        <div className="text-sm font-bold text-[var(--color-ink-muted)] flex flex-row-reverse gap-1">
                          <span>{podcasts.length}</span>
                          <span>/</span>
                          <span>{currentIndex + 1}</span>
                        </div>

                        <button
                          onClick={nextPodcast}
                          disabled={currentIndex === podcasts.length - 1}
                          className={`
                            p-3 rounded-full transition-all duration-300
                            ${currentIndex === podcasts.length - 1 
                              ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                              : "bg-[var(--color-cloud)] text-[var(--color-sky-calm-dark)] hover:bg-[var(--color-sky-calm)] hover:text-white hover:shadow-md"
                            }
                          `}
                          aria-label="التالي"
                        >
                          <ChevronLeft size={24} />
                        </button>
                      </div>
                    </div>

                    <div className="bg-[var(--color-cloud)] order-1 lg:order-2 group relative min-h-[300px]">
                      <div className="absolute inset-0 overflow-hidden">
                        <OptimizedThumbnail 
                          src={`https://img.youtube.com/vi/${podcasts[currentIndex].id}/maxresdefault.jpg`}
                          alt={podcasts[currentIndex].title}
                          className="w-full h-full opacity-80 group-hover:scale-105 transition-transform duration-700"
                          onClick={() => setActiveVideo(podcasts[currentIndex].id)}
                        />
                      </div>
                      
                      {/* Overlay and Play Button */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors flex items-center justify-center pointer-events-none">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVideo(podcasts[currentIndex].id);
                          }}
                          className="relative z-10 w-20 h-20 rounded-full bg-white/90 text-[var(--color-sky-calm-dark)] flex items-center justify-center shadow-2xl transition-all hover:bg-white hover:text-[var(--color-sky-calm)] pointer-events-auto"
                        >
                          <Play size={36} className="fill-current ml-1" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Video Overlay / Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/90 backdrop-blur-md" 
              onClick={() => setActiveVideo(null)}
            />
            
            <motion.div 
              className="relative w-full max-w-5xl aspect-video bg-black rounded-[var(--radius-xl)] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
            >
              <button 
                onClick={() => setActiveVideo(null)}
                className="absolute top-4 right-4 z-[101] w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors"
                aria-label="إغلاق"
              >
                ✕
              </button>
              
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="مشغل البودكاست"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Podcasts;
