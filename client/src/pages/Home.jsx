import React, { useState } from "react";
import Layout from "../components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { textData } from "../data/textData";
import { Link } from "react-router-dom";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  cardVariants,
  viewportOnce,
} from "../utils/animations";
import { 
  MessageCircle, 
  Target, 
  Mic, 
  Gamepad2, 
  Users, 
  BookOpen, 
  ChevronLeft,
  ArrowRight,
  Plus,
  Minus,
  Info,
  X,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const ageImages = [
  "/assets/images/age/age-0.jpg",
  "/assets/images/age/age-1.jpg",
  "/assets/images/age/age-2.jpg",
  "/assets/images/age/age-3.jpg",
  "/assets/images/age/age-4.jpg",
];

const services = [
  { to: "/communication", text: "أساليب التواصل", desc: "طرق مبتكرة للتعبير والفهم", Icon: MessageCircle, color: "var(--color-sky-calm)" },
  { to: "/sessions", text: "جلساتنا", desc: "دعم مخصص لكل بطل صغير", Icon: Target, color: "var(--color-mint)" },
  { to: "/podcasts", text: "البودكاست", desc: "رحلة صوتية غنية بالمعرفة", Icon: Mic, color: "var(--color-lavender)" },
  { to: "/games", text: "الألعاب", desc: "متعة التعلم من خلال اللعب", Icon: Gamepad2, color: "var(--color-apricot)" },
  { to: "/interaction", text: "التفاعل", desc: "بناء جسور التواصل الاجتماعي", Icon: Users, color: "var(--color-sky-calm)" },
  { to: "/stories", text: "القصص", desc: "عالم من الخيال والدروس", Icon: BookOpen, color: "var(--color-mint)" },
];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring", stiffness: 300, damping: 30,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }
};

const modalItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const Home = () => {
  const [selectedAgeIndex, setSelectedAgeIndex] = useState(null);
  const selectedGroup = selectedAgeIndex !== null ? textData.ageGroups[selectedAgeIndex] : null;
  const detailedGroup = selectedAgeIndex !== null ? textData.detailedAgeGroups[selectedAgeIndex] : null;

  return (
    <Layout>
      {/* 1. Immersive Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden pt-8 pb-16">
        {/* Animated Background Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--color-sky-calm-light)]/30 blur-[120px] rounded-full animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[var(--color-lavender-light)]/20 blur-[100px] rounded-full animate-pulse-slow" style={{ animationDelay: '2s' }} />
        
        <div className="container-content relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Image block */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative order-2 lg:order-1"
            >
              <div className="aspect-square bg-gradient-to-t from-[#C3E2DD] to-[#ADD1CD] rounded-[4rem] rotate-3 overflow-hidden shadow-2xl relative z-0">
                <img 
                  src="/assets/images/about-image.jpg" 
                  alt="" 
                  className="w-full h-full object-contain -rotate--8 scale-130 transition-transform duration-700 hover:scale-135"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-white glass rounded-[3rem] -rotate-3 p-6 shadow-xl hidden md:flex flex-col justify-center z-10">
                <span className="text-4xl font-black text-[var(--color-sky-calm)]"></span>
                <span className="text-sm font-bold text-[var(--color-ink-muted)]">موجودون لدعم الطفل والأسرة</span>
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2 text-center lg:text-right"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="inline-block px-4 py-1.5 mb-6 rounded-full bg-white/40 border border-white/50 backdrop-blur-sm shadow-sm"
                variants={itemVariants}
              >
                <span className="text-sm font-bold text-[var(--color-sky-calm-dark)] tracking-wide">
                  مرحباً بكم في عالم الإبداع
                </span>
              </motion.div>
              
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-black text-gradient leading-tight mb-8"
                variants={titleVariants}
              >
                {textData.siteName.split(' ')[0]} <span className="text-stroke">{textData.siteName.split(' ')[1]}</span>
              </motion.h1>
              
              <motion.p
                className="text-xl md:text-2xl text-[var(--color-ink-muted)] leading-relaxed mb-12 lg:mx-0"
                variants={itemVariants}
              >
                نسعى لخلق بيئة رقمية آمنة ومحفزة تدعم أبطالنا من ذوي التوحد في رحلتهم للاستكشاف والتعلم.
              </motion.p>
              
              <motion.div 
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                variants={itemVariants}
              >
                <Link to="/about" className="btn-primary w-full sm:w-auto px-10 py-4 text-lg">
                  اكتشف رحلتنا
                </Link>
                <Link to="/podcasts" className="flex items-center gap-2 font-bold text-[var(--color-ink)] hover:text-[var(--color-sky-calm)] transition-colors">
                  <span>شاهد آخر الجلسات</span>
                  <ChevronLeft size={20} />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. The Heart of Mubde' (Mission & Values) */}
      <section className="py-24 bg-gradient-to-b from-transparent to-[var(--color-cloud-light)]">
        <div className="container-content">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gradient-alt mb-8 leading-tight">
                لماذا منصة مُبدع؟
              </h2>
              <div className="space-y-6">
                {textData.homeIntro.split('\n').filter(t => t.trim()).map((para, i) => (
                  <p key={i} className="text-xl text-[var(--color-ink-muted)] leading-relaxed">
                    {para.trim()}
                  </p>
                ))}
              </div>
              <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-10">
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-16 h-16 bg-[var(--color-sky-calm-light)] rounded-3xl flex items-center justify-center text-[var(--color-sky-calm-dark)] mb-2 shadow-lg">
                    <Target size={32} />
                  </div>
                  <h4 className="font-bold text-2xl text-[var(--color-ink)]">أهداف محددة</h4>
                  <p className="text-base text-[var(--color-ink-muted)]">خطط مدروسة لكل مرحلة عمرية</p>
                </div>
                <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-[var(--color-sky-calm)] to-transparent opacity-20" />
                <div className="space-y-3 flex flex-col items-center">
                  <div className="w-16 h-16 bg-[var(--color-lavender-light)] rounded-3xl flex items-center justify-center text-[var(--color-lavender-dark)] mb-2 shadow-lg">
                    <Users size={32} />
                  </div>
                  <h4 className="font-bold text-2xl text-[var(--color-ink)]">مجتمع متكامل</h4>
                  <p className="text-base text-[var(--color-ink-muted)]">تواصل مباشر مع المختصين</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. The Discovery Hub (Services) */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-content">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-gradient mb-4">اكتشف خدماتنا</h2>
            <p className="text-xl text-[var(--color-ink-muted)]">صممنا لك أدوات تفاعلية تجعل التعلم تجربة ممتعة</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {services.map((service, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Link
                  to={service.to}
                  className="group relative block p-8 rounded-[3rem] bg-white border border-soft hover:border-[var(--color-sky-calm)] hover:shadow-2xl transition-all duration-500 overflow-hidden"
                >
                  <div 
                    className="absolute top-0 left-0 w-2 h-full transition-all duration-500 group-hover:w-full group-hover:opacity-5 opacity-0"
                    style={{ backgroundColor: service.color }}
                  />
                  <div 
                    className="w-16 h-16 rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6"
                    style={{ backgroundColor: `${service.color}30` }}
                  >
                    <service.Icon size={32} style={{ color: service.color }} />
                  </div>
                  <h3 className="text-2xl font-black text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-sky-calm-dark)] transition-colors">
                    {service.text}
                  </h3>
                  <p className="text-[var(--color-ink-muted)] leading-relaxed mb-6">
                    {service.desc}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-sky-calm)] opacity-0 -translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
                    <span>ابدأ الآن</span>
                    <ArrowRight size={16} className="rotate-180" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. The Growth Journey (Age Groups) */}
      <section className="py-24 bg-[var(--color-ink)] text-white rounded-t-[4rem] rounded-b-[4rem] mx-4 md:mx-8 relative overflow-hidden">
        {/* Subtle texture background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        
        <div className="container-content relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6">رحلة النمو</h2>
            <p className="text-xl text-gray-400">
              {textData.ageGroupsIntro}
            </p>
          </div>

          <div className="space-y-4">
            {textData.ageGroups.map((group, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ delay: index * 0.1 }}
                className="group p-1 border-b border-white/10 last:border-0"
              >
                <details className="group cursor-pointer">
                  <summary className="list-none flex items-center justify-between p-8 hover:bg-white/5 rounded-3xl transition-colors">
                    <div className="flex items-center gap-6">
                      <span className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/20 text-white font-black text-xl transition-colors">
                        0{index + 1}
                      </span>
                      <h3 className="text-2xl font-bold text-white">{group.title}</h3>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full border border-white/30 transition-all overflow-hidden group-open:bg-white/10">
                      <Plus size={24} className="text-white transition-all duration-300 group-open:hidden group-hover:scale-110" />
                      <Minus size={24} className="text-white transition-all duration-300 hidden group-open:block group-hover:scale-110" />
                    </div>
                  </summary>
                  <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-12 animate-fade-in">
                    <div className="space-y-6">
                      <p className="text-gray-400 text-lg italic leading-relaxed">
                        {textData.detailedAgeGroups[index]?.details[0]}
                      </p>
                      <ul className="grid grid-cols-1 gap-4">
                        {group.points.map((point, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-sky-calm)]" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4">
                        <button 
                          onClick={() => setSelectedAgeIndex(index)}
                          className="text-[var(--color-sky-calm)] font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform group/btn"
                        >
                          <Info size={18} className="group-hover/btn:scale-110 transition-transform" />
                          <span>اقرأ المزيد عن هذا العمر</span>
                          <ChevronLeft size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <img 
                        src={ageImages[index]} 
                        alt={group.title}
                        className="w-full h-64 object-cover rounded-[2rem] shadow-2xl opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-transparent to-transparent rounded-[2rem]" />
                    </div>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <div className="inline-block p-8 bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] max-w-2xl mx-auto">
              <p className="text-lg text-gray-300 leading-relaxed italic">
                "{textData.ageGroupsOutro}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Final Inspiring Quote */}
      <section className="py-24 text-center">
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            className="max-w-3xl mx-auto"
          >
            <BookOpen size={64} className="mx-auto mb-8 text-[var(--color-sky-calm-light)] opacity-50" />
            <h2 className="text-4xl font-black text-[var(--color-ink)] mb-6">قصتنا لم تنتهِ بعد</h2>
            <p className="text-xl text-[var(--color-ink-muted)] mb-10">
              كل يوم هو فرصة جديدة لمبدعينا ليتعلموا، ينموا، ويبهروا العالم بجمال اختلافهم.
            </p>
            <Link to="/stories" className="btn-primary-alt px-10 py-4"> تصفح قصص ملهمة </Link>
          </motion.div>
        </div>
      </section>

      {/* Premium Age Detail Modal */}
      <AnimatePresence>
        {selectedAgeIndex !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Dark Immersive Backdrop */}
            <motion.div 
              className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgeIndex(null)}
            />
            
            <motion.div 
              className="relative w-full max-w-5xl bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row max-h-[90vh]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Close Button - Glass style */}
              <button 
                onClick={() => setSelectedAgeIndex(null)}
                className="absolute top-6 left-6 z-[101] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/10 shadow-lg group"
                aria-label="إغلاق"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Sidebar Hero Image - Left Alignment */}
              <div className="hidden lg:block w-80 shrink-0 relative bg-slate-900 border-l border-white/10">
                <img 
                  src={ageImages[selectedAgeIndex]} 
                  alt={selectedGroup.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-ink)] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)]/80 to-transparent" />
                
                {/* Visual Decorative elements */}
                <div className="absolute bottom-12 right-12 left-12 p-8 glass-dark rounded-3xl border border-white/20 shadow-2xl backdrop-blur-md">
                   <div className="flex items-center gap-3 mb-3 text-[var(--color-sky-calm-light)]">
                      <span className="text-xs font-black uppercase tracking-widest">Premium Guidance</span>
                   </div>
                   <h5 className="text-xl font-bold text-white mb-2 leading-tight">مرحلة {selectedGroup.title}</h5>
                   <p className="text-xs text-gray-400 leading-relaxed">اكتشف الطرق العلمية والتربوية المناسبة لدعم طفلك في هذه الفترة الذهبية.</p>
                </div>
              </div>

              {/* Main Content Area - Scrollable */}
              <div className="flex-1 p-8 md:p-14 overflow-y-auto custom-scrollbar text-right">
                <motion.div variants={modalItemVariants} className="flex items-center gap-5 mb-10 border-b border-white/10 pb-8">
                  <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-sky-calm)] to-[var(--color-lavender)] text-white font-black text-2xl shadow-glow">
                    0{selectedAgeIndex + 1}
                  </div>
                  <div>
                    <h2 className="text-4xl font-black text-white mb-2 leading-tight">
                      {selectedGroup.title}
                    </h2>
                    <p className="text-[var(--color-sky-calm-light)] font-medium flex items-center gap-2 justify-end">
                      دليلك الشامل لرحلة النمو
                    </p>
                  </div>
                </motion.div>

                <div className="space-y-12">
                  {/* Indicators Section - Vertical Flow style */}
                  <motion.section variants={modalItemVariants}>
                    <div className="flex items-center gap-3 mb-8">
                      <AlertCircle size={24} className="text-amber-400" />
                      <h4 className="font-bold text-xl text-white">العلامات والسمات المميزة</h4>
                    </div>
                    <div className="space-y-4 pr-4 border-r-2 border-white/10">
                      {detailedGroup.details.map((detail, idx) => (
                        <motion.div 
                          key={idx} 
                          variants={modalItemVariants}
                          className="flex gap-4 group/item"
                        >
                          <div className="mt-2 w-2 h-2 rounded-full bg-[var(--color-sky-calm)] shrink-0 shadow-[0_0_8px_var(--color-sky-calm)] group-hover/item:scale-125 transition-transform" />
                          <p className="text-gray-200 text-base leading-relaxed font-medium">
                            {detail}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>

                  {/* Recommendations Section - Modern Grid */}
                  <motion.section variants={modalItemVariants}>
                    <div className="flex items-center gap-3 mb-8">
                      <CheckCircle2 size={24} className="text-emerald-400" />
                      <h4 className="font-bold text-xl text-white">أهداف التنمية المقترحة</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedGroup.points.map((point, idx) => (
                        <motion.div 
                          key={idx} 
                          variants={modalItemVariants}
                          className="p-5 glass-dark rounded-2xl border border-white/5 hover:border-white/20 transition-colors flex items-center gap-4 group/goal"
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400 group-hover/goal:bg-emerald-400/20 transition-colors">
                            <Lightbulb size={20} />
                          </div>
                          <span className="text-gray-200 font-bold text-sm tracking-wide">{point}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.section>

                  {/* Professional Tip Section - Styled Quote */}
                  <motion.div 
                    variants={modalItemVariants}
                    className="relative p-8 bg-gradient-to-br from-white/5 to-transparent rounded-[2.5rem] border border-white/10 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sky-calm)]/10 blur-3xl rounded-full" />
                    <p className="relative z-10 text-gray-300 text-lg italic leading-relaxed text-center font-medium">
                      "نحن هنا لندعمكم في هذه المرحلة الحساسة، لأن الفهم العميق للطفل هو مفتاح بوابة الإمكانيات غير المحدودة."
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default Home;
