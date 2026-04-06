import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import games from "../data/gamesData";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  cardVariants,
  viewportOnce,
} from "../utils/animations";

import { 
  Gamepad2, 
  Search, 
  Sparkles, 
  Brain, 
  Heart, 
  Ghost, 
  ExternalLink,
  Filter,
  CheckCircle2
} from "lucide-react";

/* ──────── category config ──────── */
const categories = [
  { id: "all", label: "الكل", icon: Filter },
  { id: "emotions", label: "مشاعر", icon: Heart },
  { id: "logic", label: "ذكاء", icon: Brain },
  { id: "social", label: "مهارات", icon: Sparkles },
  { id: "sensory", label: "هدوء", icon: Ghost },
];

const Games = () => {
  const [activeTab, setActiveTab] = useState("all");

  /* filter games */
  const filteredGames = useMemo(() => {
    if (activeTab === "all") return games;
    return games.filter(g => g.category === activeTab);
  }, [activeTab]);

  return (
    <Layout>
      {/* ────── Hero Section ────── */}
      <section className="section-block relative overflow-hidden">
        {/* background decoration */}
        <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-[var(--color-apricot-light)]/20 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[var(--color-mint-light)]/20 blur-[80px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="container-content relative z-10">
          <motion.div 
            className="flex flex-col items-center text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-apricot)] to-[var(--color-mint)] flex items-center justify-center mb-6 shadow-glow"
              variants={itemVariants}
            >
              <Gamepad2 size={32} className="text-white" />
            </motion.div>
            
            <motion.h1 
              className="section-heading text-gradient !mb-4"
              variants={titleVariants}
            >
              عالم الألعاب التفاعلية
            </motion.h1>
            
            <motion.p
              className="text-intro max-w-2xl"
              variants={itemVariants}
            >
              اكتشف مجموعة مختارة من الألعاب الأونلاين التي تهدف إلى تنمية المهارات اللغوية، الاجتماعية، والحسية لأبطالنا في بيئة آمنة وممتعة.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ────── Filter Tabs ────── */}
      <section className="pb-12 pt-0">
        <div className="container-content">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all duration-300 cursor-pointer
                    ${activeTab === cat.id 
                      ? "bg-[var(--color-apricot-dark)] text-white shadow-lg scale-105" 
                      : "bg-white text-[var(--color-ink-muted)] hover:bg-[var(--color-apricot-light)] hover:text-[var(--color-apricot-dark)] border border-soft"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ────── Games Grid ────── */}
      <section className="section-block pt-0">
        <div className="container-content">
          <motion.div
            className="grid-auto"
            layout
          >
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.title}
                  layout
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                  viewport={viewportOnce}
                  className="glass-card group rounded-[2rem] overflow-hidden flex flex-col h-full border-2 border-transparent hover:border-[var(--color-apricot)] transition-all duration-500"
                >
                  {/* Game Image */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 badge bg-white/90 backdrop-blur-md shadow-md">
                      {game.categoryAr}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col items-start text-right">
                    <div className="flex items-center gap-2 mb-3">
                       <CheckCircle2 size={14} className="text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-ink-muted)] opacity-60">Working Online Game</span>
                    </div>

                    <h3 className="text-xl font-black text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-apricot-dark)] transition-colors">
                      {game.title}
                    </h3>
                    
                    <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed mb-6 flex-1">
                      {game.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {game.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-cloud-dark)] text-[var(--color-ink-muted)]">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Button */}
                    <a
                      href={game.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary w-full group/btn relative overflow-hidden"
                      style={{ background: "linear-gradient(135deg, var(--color-apricot), var(--color-apricot-dark))" }}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <span>العب الآن</span>
                        <ExternalLink size={18} className="transition-transform group-hover/btn:translate-y-[-2px] group-hover/btn:translate-x-[2px]" />
                      </span>
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredGames.length === 0 && (
            <motion.div 
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 rounded-full bg-[var(--color-cloud-dark)] flex items-center justify-center mx-auto mb-4 text-[var(--color-ink-muted)]">
                <Search size={32} />
              </div>
              <p className="text-[var(--color-ink-muted)] font-bold">لا يوجد ألعاب في هذا القسم حالياً</p>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Games;
