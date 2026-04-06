import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  cardVariants,
  viewportOnce,
} from "../utils/animations";
import { Play, PlayCircle, Star, Sparkles, X } from "lucide-react";
import OptimizedThumbnail from "../components/OptimizedThumbnail";

const images = [
  "/assets/images/communication/image-1.jpg",
  "/assets/images/communication/image-2.jpg",
  "/assets/images/communication/image-3.jpg",
  "/assets/images/communication/image-4.jpg",
  "/assets/images/communication/image-5.jpg",
  "/assets/images/communication/image-6.jpg",
];

const videos = [
  {
    id: "4Gf5Zbbxunc",
    title: "كيف تحسن تركيز طفل التوحد",
    description: "استراتيجيات عملية لزيادة الانتباه والتركيز بطرق ممتعة وتفاعلية.",
    color: "var(--color-sky-calm)",
  },
  {
    id: "zIA552waea0",
    title: "تدريب دمج المهارات الحركية والبصرية",
    description: "خطوات تدريبية للجلوس والتواصل البصري والتقليد للأطفال ذوي التوحد.",
    color: "var(--color-mint)",
  },
  {
    id: "c2aJ6chNwmA",
    title: "استراتيجيات التواصل الفعالة",
    description: "دليل عملي لبناء جسور التواصل العاطفي واللفظي مع أطفالنا.",
    color: "var(--color-lavender)",
  },
];

const sections = [
  {
    title: "قبل التفاعل",
    color: "var(--color-mint)",
    items: [
      "تعلم عن التوحد: قبل التفاعل مع شخص يعاني من التوحد، من المهم أن تتعلم عن هذا الاضطراب وتفهم احتياجاته.",
      "تحضير البيئة: تأكد من أن البيئة خالية من المشتتات والصوت العالي الذي قد يزعج الشخص.",
    ],
  },
  {
    title: "أثناء التفاعل",
    color: "var(--color-sky-calm)",
    items: [
      "التحدث بوضوح وبطء لضمان فهم الشخص لك.",
      "استخدام لغة بسيطة وواضحة لتجنب الارتباك.",
      "الاستماع جيدًا لما يقوله الشخص وتأكد من فهمك لما يقوله.",
      "تجنب التلامس الجسدي إذا لم يكن الشخص مرتاحًا له.",
      "قدم للشخص خيارات لتحديد ما يريد القيام به.",
    ],
  },
  {
    title: "بعد التفاعل",
    color: "var(--color-lavender)",
    items: [
      "التعليق الإيجابي: قدم تعليقات إيجابية على سلوك الشخص.",
      "تقديم الدعم والتشجيع للشخص.",
      "التواصل مع عائلة الشخص لتقديم الدعم والمساعدة.",
    ],
  },
  {
    title: "النصائح العامة",
    color: "var(--color-apricot)",
    items: [
      "احترم احتياجات الشخص وحدوده.",
      "كن صادقًا في تعاملك مع الشخص.",
      "تفهم أن الشخص يعاني من اضطراب التوحد وله احتياجات فريدة.",
      "تواصل مع الشخص بانتظام لضمان فهمك لاحتياجاته.",
      "قدم المساعدة والدعم للشخص عند الحاجة.",
    ],
  },
];

const Communication = () => {
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <Layout>
      {/* Header with decorative elements */}
      <section className="section-block relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-60 bg-[var(--color-sky-calm-light)]/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-60 bg-[var(--color-lavender-light)]/20 rounded-full blur-3xl" />
        
        <div className="container-content relative">
          <motion.h1
            className="section-heading text-gradient !mb-8"
            variants={titleVariants}
            initial="hidden"
            animate="visible"
          >
            أساليب التواصل
          </motion.h1>
          <motion.p
            className="text-intro !max-w-3xl"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            التعامل مع الأشخاص الذين يعانون من التوحد يتطلب فهمًا وتقديرًا
            لاحتياجاتهم الفريدة. نقدم هنا مجموعة من النصائح لتحسين التفاعل معهم
            بطريقة فعّالة وداعمة.
          </motion.p>
        </div>
      </section>

      {/* Videos Section - Modern Grid */}
      <section className="section-block pt-0">
        <div className="container-content">
          <motion.div
            className="flex items-center gap-3 mb-10 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-sky-calm)]" />
            <h2 className="text-2xl font-black text-gradient">فيديوهات إرشادية</h2>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-sky-calm)]" />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {videos.map((video, index) => (
              <motion.div
                key={index}
                className="group relative"
                variants={cardVariants}
                custom={index}
              >
                {/* Decorative background shadow */}
                <div 
                  className="absolute inset-0 rounded-[var(--radius-xl)] blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"
                  style={{ backgroundColor: video.color }}
                />

                <div className="card-base !p-0 overflow-hidden relative glass border-none shadow-md group-hover:shadow-glow-lg transition-all duration-500">
                  {/* Thumbnail Section */}
                  <div className="relative aspect-video overflow-hidden group/thumb">
                    <OptimizedThumbnail 
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full transition-transform duration-700 group-hover:scale-110"
                      onClick={() => setActiveVideo(video.id)}
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-500 flex items-center justify-center pointer-events-none">
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 rounded-full bg-white/90 text-[var(--color-sky-calm-dark)] flex items-center justify-center shadow-lg transition-all hover:bg-white hover:text-[var(--color-sky-calm)] pointer-events-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVideo(video.id);
                        }}
                      >
                        <Play size={28} className="fill-current ml-1" />
                      </motion.button>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="badge glass !bg-white/80 !text-[var(--color-ink)] shadow-sm font-bold">
                        إرشادات مبدعة #{index + 1}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 text-right">
                    <h3 className="text-xl font-bold mb-3 text-[var(--color-ink)] group-hover:text-[var(--color-sky-calm-dark)] transition-colors line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed mb-4 line-clamp-2">
                      {video.description}
                    </p>
                    <button 
                      onClick={() => setActiveVideo(video.id)}
                      className="text-sm font-bold text-[var(--color-sky-calm-dark)] flex items-center gap-2 hover:gap-3 transition-all justify-end w-full"
                    >
                      <span>مشاهدة الآن</span>
                      <PlayCircle size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Images Grid Section */}
      <section className="section-block pt-0">
        <div className="container-content">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-[var(--color-ink)] mb-4 flex items-center justify-center gap-3">
              <Star className="text-[var(--color-apricot)]" fill="currentColor" />
              <span>لحظات من التواصل</span>
              <Star className="text-[var(--color-apricot)]" fill="currentColor" />
            </h2>
          </div>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                className="group relative rounded-[var(--radius-xl)] overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
                variants={cardVariants}
                custom={index}
              >
                <img
                  src={image}
                  alt={`صورة تواصل ${index + 1}`}
                  className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <p className="text-white text-xs font-bold">بناء جسور التواصل بالحب والفهم</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tips Sections with Premium Cards */}
      <section className="section-block bg-gradient-to-b from-white to-[var(--color-cloud)]">
        <div className="container-content max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[var(--color-ink)] mb-4">نصائح ذهبية للتفاعل</h2>
            <div className="w-20 h-1.5 bg-gradient-to-r from-[var(--color-sky-calm)] to-[var(--color-lavender)] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                className="card-base group hover:border-[var(--color-sky-calm)] transition-colors p-8 relative overflow-hidden"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
              >
                <div 
                  className="absolute top-0 right-0 w-16 h-16 opacity-10 flex items-center justify-center -mr-4 -mt-4 transition-transform group-hover:scale-150 rotate-12"
                  style={{ color: section.color }}
                >
                  <Sparkles size={64} />
                </div>
                <h2 className="font-black text-xl mb-6 flex items-center gap-3" style={{ color: section.color }}>
                   <div className="w-2 h-8 rounded-full" style={{ backgroundColor: section.color }} />
                   {section.title}
                </h2>
                <ul className="space-y-4">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="text-sm text-[var(--color-ink-muted)] flex gap-3">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: section.color }} />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
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
                className="absolute top-4 right-4 z-[101] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10"
              >
                <X size={24} />
              </button>
              
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="مشغل الفيديوهات الإرشادية"
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

export default Communication;
