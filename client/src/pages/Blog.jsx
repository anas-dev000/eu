import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { blogText } from "../data/blogText";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  cardVariants,
  viewportOnce,
} from "../utils/animations";
import { 
  BookOpen, 
  Heart, 
  GraduationCap, 
  MessageSquare, 
  Baby, 
  ArrowRight,
  Clock,
} from "lucide-react";

const categories = [
  { id: "all", label: "الكل", icon: BookOpen },
  { id: "daily", label: "مهارات يومية", icon: Heart, color: "var(--color-sky-calm)" },
  { id: "academic", label: "أكاديمي", icon: GraduationCap, color: "var(--color-mint)" },
  { id: "communication", label: "تواصل", icon: MessageSquare, color: "var(--color-lavender)" },
  { id: "preschool", label: "ما قبل المدرسة", icon: Baby, color: "var(--color-apricot)" },
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    rtl: true,
  };

  const filteredPosts = blogText.blogPosts.filter(post => {
    if (activeCategory === "all") return true;
    if (activeCategory === "daily") return post.title.includes("الحياة اليومية");
    if (activeCategory === "academic") return post.title.includes("الأكاديمية");
    if (activeCategory === "communication") return post.title.includes("التواصل");
    if (activeCategory === "preschool") return post.title.includes("قبل المدرسة");
    return true;
  });

  const getCategoryTheme = (title) => {
    if (title.includes("الحياة اليومية")) return { icon: Heart, color: "var(--color-sky-calm)", label: "مهارات يومية" };
    if (title.includes("الأكاديمية")) return { icon: GraduationCap, color: "var(--color-mint)", label: "أكاديمي" };
    if (title.includes("التواصل")) return { icon: MessageSquare, color: "var(--color-lavender)", label: "تواصل" };
    if (title.includes("قبل المدرسة")) return { icon: Baby, color: "var(--color-apricot)", label: "ما قبل المدرسة" };
    return { icon: BookOpen, color: "var(--color-sky-calm)", label: "عام" };
  };

  return (
    <Layout>
      {/* 1. Blog Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-b from-[var(--color-sky-calm-light)]/20 to-transparent">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-mint-light)]/30 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="container-content relative z-10 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-5xl md:text-6xl font-black text-gradient leading-tight mb-6"
              variants={titleVariants}
            >
              مدونة مُبدع
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-[var(--color-ink-muted)] leading-relaxed"
              variants={itemVariants}
            >
              مقالات ومعلومات متخصصة أعدها خبراء لمساعدتكم في فهم ودعم أبطالنا أصحاب الهمم في كل خطوة.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. Category Filter */}
      <section className="pb-12 sticky top-20 z-30 bg-cloud/80 backdrop-blur-lg">
        <div className="container-content">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300
                  ${activeCategory === cat.id 
                    ? "bg-[var(--color-ink)] text-white shadow-lg scale-105" 
                    : "bg-white text-[var(--color-ink-muted)] hover:bg-[var(--color-cloud-dark)] border border-soft"
                  }
                `}
              >
                <cat.icon size={20} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Article Grid */}
      <section className="pb-24">
        <div className="container-content">
          <motion.div 
            layout
            className="grid grid-cols-1 gap-12"
          >
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, index) => {
                const theme = getCategoryTheme(post.title);
                return (
                  <motion.article
                    key={post.title}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-[3rem] overflow-hidden border border-soft hover:shadow-2xl transition-all duration-500"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                      {/* Left: Content (8 cols) */}
                      <div className="lg:col-span-8 p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-6">
                          <div 
                            className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-black"
                            style={{ backgroundColor: `${theme.color}20`, color: theme.color }}
                          >
                            <theme.icon size={16} />
                            <span>{theme.label}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-sm text-[var(--color-ink-muted)] font-medium">
                            <Clock size={16} />
                            <span>8 دقائق للقراءة</span>
                          </div>
                        </div>

                        <h2 className="text-3xl font-black text-[var(--color-ink)] mb-6 group-hover:text-[var(--color-sky-calm-dark)] transition-colors">
                          {post.title}
                        </h2>

                        <p className="text-lg text-[var(--color-ink-muted)] leading-relaxed mb-8">
                          {post.intro}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                          <div>
                            <h3 className="font-black text-[var(--color-ink)] mb-4 flex items-center gap-2">
                              <span className="w-1.5 h-6 rounded-full bg-[var(--color-mint)]" />
                              أهمية التدريب
                            </h3>
                            <ul className="space-y-3">
                              {post.importance.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-sm text-[var(--color-ink-muted)] flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-mint)] mt-1.5 shrink-0" />
                                  <span>{item.split(":")[0]}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-black text-[var(--color-ink)] mb-4 flex items-center gap-2">
                              <span className="w-1.5 h-6 rounded-full bg-[var(--color-lavender)]" />
                              استراتيجيات
                            </h3>
                            <ul className="space-y-3">
                              {post.strategies.slice(0, 3).map((item, i) => (
                                <li key={i} className="text-sm text-[var(--color-ink-muted)] flex items-start gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-lavender)] mt-1.5 shrink-0" />
                                  <span className="line-clamp-1">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <button className="flex items-center gap-3 font-black text-[var(--color-sky-calm-dark)] group/btn">
                          <span className="border-b-2 border-transparent group-hover/btn:border-[var(--color-sky-calm)] transition-all">اقرأ المقال كاملاً</span>
                          <ArrowRight size={20} className="rotate-180 transition-transform group-hover/btn:translate-x-[-5px]" />
                        </button>
                      </div>

                      {/* Right: Media (4 cols) */}
                      <div className="lg:col-span-4 bg-white min-h-[300px] relative">
                        {post.images && post.images.length > 0 ? (
                          <div className="h-full">
                            <Slider {...sliderSettings} className="h-full blog-slider">
                              {post.images.map((img, i) => (
                                <div key={i} className="h-full outline-none">
                                  <img 
                                    src={img} 
                                    alt={post.title} 
                                    className="w-full border border-soft h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                                  />
                                </div>
                              ))}
                            </Slider>
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center p-12 bg-gradient-to-br from-[var(--color-sky-calm-light)] to-[var(--color-lavender-light)]">
                            <theme.icon size={100} className="text-white opacity-40 rotate-12" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent hidden lg:block pointer-events-none" />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <BookOpen size={64} className="mx-auto text-[var(--color-ink-muted)] opacity-20 mb-6" />
              <h3 className="text-2xl font-bold text-[var(--color-ink-muted)]">لا توجد مقالات في هذا القسم حالياً</h3>
            </div>
          )}
        </div>
      </section>

      {/* 4. Support Banner */}
      <section className="container-content pb-24">
        <div className="p-12 rounded-[4rem] bg-[var(--color-ink)] text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <h2 className="text-3xl md:text-4xl font-black mb-6">هل تحتاج إلى استشارة متخصصة؟</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            خبراؤنا هنا لمساعدتك في فهم احتياجات طفلك وتزويدك بأهم النصائح والتمارين المخصصة.
          </p>
          <button className="btn-primary px-10 py-4"> تواصل مع الأخصائيين </button>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
