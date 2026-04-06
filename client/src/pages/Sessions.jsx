import React from "react";
import Layout from "../components/Layout";
import { motion } from "framer-motion";
import { Target } from "lucide-react";
import { titleVariants, itemVariants } from "../utils/animations";

const Sessions = () => {
  return (
    <Layout>
      <section className="section-block">
        <div className="container-content">
          <motion.h1
            className="section-heading text-gradient"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            الجلسات والاستشارات
          </motion.h1>
        </div>
      </section>

      <section className="section-block pt-0">
        <div className="container-content max-w-xl mx-auto">
          <motion.div
            className="card-base text-center p-8 md:p-12 bg-gradient-to-br from-[var(--color-mint-light)]/40 to-[var(--color-sky-calm-light)]/40"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <Target size={64} className="text-[var(--color-sky-calm-dark)] opacity-80" />
            </div>

            <h2 className="text-[var(--color-sky-calm-dark)] font-bold text-xl mb-3">
              قريباً...
            </h2>
            <p className="text-sm leading-relaxed text-[var(--color-ink-light)] max-w-sm mx-auto">
              نعمل حالياً على تجهيز جلسات واستشارات متخصصة لدعم أطفال التوحد
              وأسرهم. ترقبوا التحديثات القادمة!
            </p>

            {/* Decorative dots */}
            <div className="flex items-center justify-center gap-2 mt-6">
              <span className="w-2 h-2 rounded-full bg-[var(--color-mint)] animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-[var(--color-sky-calm)] animate-pulse" style={{ animationDelay: "0.2s" }} />
              <span className="w-2 h-2 rounded-full bg-[var(--color-lavender)] animate-pulse" style={{ animationDelay: "0.4s" }} />
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Sessions;
