import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  cardVariants,
  viewportOnce,
} from "../utils/animations";

const stories = [
  {
    id: "rO2xFOVkhTM",
    title: "رحلة البحث عن الصديق",
    description: "قصة ملهمة حول طفل يكتشف قوة الصداقة والتواصل بطريقته الفريدة والمميزة.",
    color: "var(--color-sky-calm)",
  },
  {
    id: "vTNuaztbv_U",
    title: "عالم الألوان السري",
    description: "كيف يرى الأطفال ذوو التوحد العالم من خلال الألوان والمشاعر الرقيقة والجميلة.",
    color: "var(--color-mint)",
  },
  {
    id: "CtLnxzBB4bQ",
    title: "بطل الطيف الخارق",
    description: "قصة طفل يمتلك قدرات استثنائية في التركيز والملاحظة تجعله بطلاً في عيون الجميع.",
    color: "var(--color-lavender)",
  },
];

import {Star, Play, PlayCircle } from "lucide-react";
import OptimizedThumbnail from "../components/OptimizedThumbnail";

const Stories = () => {
  const [activeVideo, setActiveVideo] = React.useState(null);

  return (
    <Layout>
      {/* Magical Hero Section - Compact & Elevated */}
      <section className="pt-8 pb-4 overflow-hidden relative">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-60 bg-[var(--color-sky-calm-light)]/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-60 bg-[var(--color-lavender-light)]/20 rounded-full blur-3xl" />

        <div className="container-content relative">
          <motion.div 
            className="card-base glass-card border-none !py-6 !px-8 text-center relative overflow-hidden w-full mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1 
              className="text-2xl md:text-3xl font-black mb-2 text-gradient"
              variants={titleVariants}
            >
              القصص الرقمية المبدعة
            </motion.h1>
            
            <motion.p 
              className="text-sm md:text-base !m-0 !max-w-2xl !mx-auto !text-[var(--color-ink-muted)] font-medium"
              variants={itemVariants}
            >
              نقدم لكم عالماً من القصص الملهمة والمصممة خصيصاً لتناسب احتياجات واهتمامات
              أبطالنا من ذوي طيف التوحد، حيث نجمع بين المتعة والتعلم والتفاعل.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Discovery Section */}
      <section className="section-block pt-0">
        <div className="container-content">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {stories.map((story, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={cardVariants}
                custom={index}
              >
                {/* Decorative background shadow */}
                <div 
                  className="absolute inset-0 rounded-[var(--radius-xl)] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: story.color }}
                />

                <div className="card-base !p-0 overflow-hidden relative glass border-none shadow-md group-hover:shadow-glow-lg transition-all duration-500">
                  {/* Thumbnail Section */}
                  <div className="relative aspect-video overflow-hidden group/thumb">
                    <OptimizedThumbnail 
                      src={`https://img.youtube.com/vi/${story.id}/mqdefault.jpg`}
                      alt={story.title}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                      onClick={() => setActiveVideo(story.id)}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center pointer-events-none">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 rounded-full bg-white/90 text-[var(--color-sky-calm-dark)] flex items-center justify-center shadow-lg transition-all hover:bg-white hover:text-[var(--color-sky-calm)] pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideo(story.id);
                        }}
                      >
                        <Play size={28} className="fill-current ml-1" />
                      </motion.button>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="badge glass !bg-white/80 !text-[var(--color-ink)] shadow-sm">
                        قصة مبدعة #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-[var(--color-ink)] group-hover:text-[var(--color-sky-calm-dark)] transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed mb-4">
                      {story.description}
                    </p>
                    <button 
                      onClick={() => setActiveVideo(story.id)}
                      className="text-sm font-bold text-[var(--color-sky-calm-dark)] flex items-center gap-2 hover:gap-3 transition-all"
                    >
                      مشاهدة القصة الآن <Play size={16} className="fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
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
              >
                ✕
              </button>
              
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="مشغل القصص"
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

export default Stories;
