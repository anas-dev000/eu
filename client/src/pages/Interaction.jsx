import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  viewportOnce,
} from "../utils/animations";
import {
  Users,
  Gamepad2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Heart,
  Shield,
  Sparkles,
  ChevronLeft,
  Info,
  AlertTriangle,
} from "lucide-react";
import {
  screeningQuestions,
  calculateScore,
  getLevel,
  levels,
  medicalDisclaimer,
} from "../data/screeningData";

/* ──────── animation variants ──────── */
const cardEnter = {
  hidden: { opacity: 0, y: 60, scale: 0.92, rotateX: 8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] },
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.92,
    rotateX: -8,
    transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
  },
};

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const resultChildVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const pulseRing = {
  initial: { scale: 1, opacity: 0.4 },
  animate: {
    scale: [1, 1.6, 1],
    opacity: [0.4, 0, 0.4],
    transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
  },
};

/* ──────── views ──────── */
const VIEW_LANDING = "landing";
const VIEW_QUIZ = "quiz";
const VIEW_RESULT = "result";
const VIEW_GAME = "game";

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
const Interaction = () => {
  const [view, setView] = useState(VIEW_LANDING);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [isGameActive, setIsGameActive] = useState(false);

  /* handlers */
  const startQuiz = useCallback(() => {
    setAnswers({});
    setCurrentQ(0);
    setScore(null);
    setView(VIEW_QUIZ);
  }, []);

  const handleAnswer = useCallback(
    (answer) => {
      const q = screeningQuestions[currentQ];
      const newAnswers = { ...answers, [q.id]: answer };
      setAnswers(newAnswers);

      if (currentQ < screeningQuestions.length - 1) {
        setCurrentQ((p) => p + 1);
      } else {
        const finalScore = calculateScore(newAnswers);
        setScore(finalScore);
        setView(VIEW_RESULT);
      }
    },
    [currentQ, answers]
  );

  const goBack = useCallback(() => {
    setView(VIEW_LANDING);
    setCurrentQ(0);
    setAnswers({});
    setScore(null);
    setIsGameActive(false);
  }, []);

  const startGame = useCallback(() => {
    setIsGameActive(true);
  }, []);

  /* ── RENDER ── */
  return (
    <Layout className={isGameActive && view === VIEW_GAME ? "bg-black/5" : ""}>
      {/* ────── Hero / Title (hidden in active game focus mode) ────── */}
      <AnimatePresence>
        {(!isGameActive || view !== VIEW_GAME) && (
          <motion.section 
            className="section-block pb-0"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20, height: 0, padding: 0, overflow: "hidden" }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="container-content">
              <motion.div
                className="flex items-center justify-center gap-3 mb-2"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                <Users
                  size={32}
                  className="text-[var(--color-sky-calm-dark)]"
                />
                <h1 className="section-heading !mb-0 text-gradient">التفاعل</h1>
              </motion.div>
              <motion.p
                className="text-intro"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                نقدم لكم أدوات تفاعلية تساعد في تعزيز مهارات الطفل وتقديم تقييم
                مبدئي لمستوى التواصل والتفاعل الاجتماعي.
              </motion.p>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ────── Main Content Area ────── */}
      <section className={`section-block pt-2 transition-all duration-700 ${isGameActive && view === VIEW_GAME ? "py-0" : ""}`}>
        <div className={`container-content mx-auto transition-all duration-700 ${isGameActive && view === VIEW_GAME ? "max-w-none px-0" : "max-w-5xl"}`}>
          <AnimatePresence mode="wait">
            {/* ═══════════ LANDING ═══════════ */}
            {view === VIEW_LANDING && (
              <motion.div
                key="landing"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -30, transition: { duration: 0.3 } }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {/* Card 1: Parents Quiz */}
                <motion.button
                  variants={itemVariants}
                  onClick={startQuiz}
                  className="group relative overflow-hidden rounded-[2rem] p-8 text-right cursor-pointer border-2 border-transparent hover:border-[var(--color-sky-calm)] transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(124,165,216,0.08), rgba(184,169,212,0.08))",
                  }}
                  whileHover={{ y: -4 }}
                >
                  {/* glow blob */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-sky-calm)]/10 blur-[60px] rounded-full group-hover:bg-[var(--color-sky-calm)]/20 transition-all duration-700" />

                  <div className="relative z-10">
                    <div
                      className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-sky-calm), var(--color-lavender))",
                      }}
                    >
                      <Shield size={36} className="text-white" />
                    </div>

                    <h3 className="text-2xl font-black text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-sky-calm-dark)] transition-colors">
                      تقييم الوالدين
                    </h3>
                    <p className="text-[var(--color-ink-muted)] leading-relaxed mb-6 text-sm">
                      اختبار فحص مبدئي مكون من 10 أسئلة مبنية على مقياس
                      M-CHAT-R المعتمد عالمياً. يساعدك في فهم مستوى تواصل وتفاعل
                      طفلك الاجتماعي.
                    </p>

                    <div className="flex items-center gap-2 text-[var(--color-sky-calm-dark)] font-bold text-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <span>ابدأ التقييم</span>
                      <ArrowLeft size={16} />
                    </div>
                  </div>

                  {/* bottom badge */}
                  <div className="absolute bottom-4 left-4 badge text-xs">
                    10 أسئلة
                  </div>
                </motion.button>

                {/* Card 2: Emotion Game */}
                <motion.button
                  variants={itemVariants}
                  onClick={() => setView(VIEW_GAME)}
                  className="group relative overflow-hidden rounded-[2rem] p-8 text-right cursor-pointer border-2 border-transparent hover:border-[var(--color-apricot)] transition-all duration-500"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(244,196,160,0.08), rgba(168,213,186,0.08))",
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--color-apricot)]/10 blur-[60px] rounded-full group-hover:bg-[var(--color-apricot)]/20 transition-all duration-700" />

                  <div className="relative z-10">
                    <div
                      className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-6 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--color-apricot), var(--color-mint))",
                      }}
                    >
                      <Gamepad2 size={36} className="text-white" />
                    </div>

                    <h3 className="text-2xl font-black text-[var(--color-ink)] mb-3 group-hover:text-[var(--color-apricot-dark)] transition-colors">
                      لعبة التعرف على المشاعر
                    </h3>
                    <p className="text-[var(--color-ink-muted)] leading-relaxed mb-6 text-sm">
                      لعبة تفاعلية ممتعة تساعد الطفل في التعرف على المشاعر
                      المختلفة ومطابقة الأشكال، مما يعزز مهارات التواصل العاطفي.
                    </p>

                    <div className="flex items-center gap-2 text-[var(--color-apricot-dark)] font-bold text-sm opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <span>ابدأ اللعب</span>
                      <ArrowLeft size={16} />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 badge text-xs" style={{ background: "var(--color-apricot-light)", color: "var(--color-apricot-dark)" }}>
                    لعبة تفاعلية
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* ═══════════ QUIZ ═══════════ */}
            {view === VIEW_QUIZ && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                {/* Back button */}
                <button
                  onClick={goBack}
                  className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-sky-calm)] mb-6 transition-colors"
                >
                  <ArrowRight size={16} />
                  <span>العودة</span>
                </button>

                {/* ── Progress Bar ── */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[var(--color-ink-muted)]">
                      السؤال {currentQ + 1} من {screeningQuestions.length}
                    </span>
                    <span className="text-sm font-bold text-[var(--color-sky-calm)]">
                      {Math.round(
                        ((currentQ + 1) / screeningQuestions.length) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full h-3 bg-[var(--color-cloud-dark)] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-sky-calm), var(--color-lavender))",
                      }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          ((currentQ + 1) / screeningQuestions.length) * 100
                        }%`,
                      }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </div>
                  {/* step dots */}
                  <div className="flex justify-between mt-3 px-1">
                    {screeningQuestions.map((_, i) => (
                      <div
                        key={i}
                        className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                        style={{
                          background:
                            i <= currentQ
                              ? "var(--color-sky-calm)"
                              : "var(--color-cloud-dark)",
                          transform: i === currentQ ? "scale(1.4)" : "scale(1)",
                          boxShadow:
                            i === currentQ
                              ? "0 0 8px var(--color-sky-calm)"
                              : "none",
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Question Card ── */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQ}
                    variants={cardEnter}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative rounded-[2rem] overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(145deg, rgba(255,255,255,0.9), rgba(245,246,248,0.95))",
                      backdropFilter: "blur(20px)",
                      boxShadow:
                        "0 20px 60px rgba(0,0,0,0.08), 0 0 0 1px rgba(124,165,216,0.1)",
                    }}
                  >
                    {/* decorative top bar */}
                    <div
                      className="h-1.5 w-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--color-sky-calm), var(--color-lavender), var(--color-mint))",
                      }}
                    />

                    <div className="p-8 md:p-12">
                      {/* question emoji & number */}
                      <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="text-5xl">
                          {screeningQuestions[currentQ].icon}
                        </div>
                        <div
                          className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg text-white shadow-lg"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--color-sky-calm), var(--color-lavender))",
                          }}
                        >
                          {currentQ + 1}
                        </div>
                      </div>

                      {/* question text */}
                      <h2 className="text-2xl md:text-3xl font-black text-[var(--color-ink)] text-center mb-4 leading-relaxed">
                        {screeningQuestions[currentQ].question}
                      </h2>

                      {/* example */}
                      <p className="text-center text-[var(--color-ink-muted)] text-sm mb-10 max-w-lg mx-auto leading-relaxed">
                        {screeningQuestions[currentQ].example}
                      </p>

                      {/* answer buttons */}
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                        <motion.button
                          onClick={() => handleAnswer("yes")}
                          className="w-full sm:w-44 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 border-2 transition-all duration-300 cursor-pointer"
                          style={{
                            borderColor: "var(--color-mint)",
                            color: "var(--color-mint-dark)",
                            background: "rgba(168,213,186,0.08)",
                          }}
                          whileHover={{
                            scale: 1.04,
                            background: "rgba(168,213,186,0.18)",
                            boxShadow: "0 8px 30px rgba(168,213,186,0.25)",
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <CheckCircle2 size={22} />
                          <span>نعم</span>
                        </motion.button>

                        <motion.button
                          onClick={() => handleAnswer("no")}
                          className="w-full sm:w-44 py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 border-2 transition-all duration-300 cursor-pointer"
                          style={{
                            borderColor: "var(--color-apricot)",
                            color: "var(--color-apricot-dark)",
                            background: "rgba(244,196,160,0.08)",
                          }}
                          whileHover={{
                            scale: 1.04,
                            background: "rgba(244,196,160,0.18)",
                            boxShadow: "0 8px 30px rgba(244,196,160,0.25)",
                          }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <XCircle size={22} />
                          <span>لا</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* medical disclaimer mini */}
                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[var(--color-ink-muted)] opacity-60">
                  <Info size={14} />
                  <span>هذا فحص أولي وليس تشخيصاً طبياً</span>
                </div>
              </motion.div>
            )}

            {/* ═══════════ RESULT ═══════════ */}
            {view === VIEW_RESULT && score !== null && (
              <motion.div
                key="result"
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                {(() => {
                  const levelNum = getLevel(score);
                  const levelData = levels[levelNum];
                  return (
                    <>
                      {/* Back button */}
                      <motion.button
                        variants={resultChildVariants}
                        onClick={goBack}
                        className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-sky-calm)] mb-6 transition-colors"
                      >
                        <ArrowRight size={16} />
                        <span>العودة للصفحة الرئيسية</span>
                      </motion.button>

                      {/* Result card */}
                      <motion.div
                        variants={resultChildVariants}
                        className="relative rounded-[2.5rem] overflow-hidden"
                        style={{
                          background: "var(--color-white)",
                          boxShadow:
                            "0 25px 80px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.03)",
                        }}
                      >
                        {/* top colored bar */}
                        <div
                          className="h-2 w-full"
                          style={{
                            background: `linear-gradient(90deg, ${levelData.color}, ${levelData.colorLight})`,
                          }}
                        />

                        <div className="p-8 md:p-12">
                          {/* score circle */}
                          <motion.div
                            variants={resultChildVariants}
                            className="flex flex-col items-center mb-10"
                          >
                            <div className="relative mb-6">
                              {/* pulse rings */}
                              <motion.div
                                className="absolute inset-0 rounded-full"
                                style={{
                                  border: `3px solid ${levelData.color}`,
                                }}
                                variants={pulseRing}
                                initial="initial"
                                animate="animate"
                              />
                              <motion.div
                                className="absolute inset-[-8px] rounded-full"
                                style={{
                                  border: `2px solid ${levelData.colorLight}`,
                                }}
                                variants={pulseRing}
                                initial="initial"
                                animate="animate"
                                transition={{ delay: 0.5 }}
                              />
                              <div
                                className="w-28 h-28 rounded-full flex items-center justify-center text-5xl shadow-xl relative z-10"
                                style={{
                                  background: `linear-gradient(135deg, ${levelData.colorLight}, ${levelData.color})`,
                                }}
                              >
                                {levelData.emoji}
                              </div>
                            </div>

                            <h2
                              className="text-3xl md:text-4xl font-black mb-2 text-center"
                              style={{ color: levelData.colorDark }}
                            >
                              {levelData.title}
                            </h2>
                            <p
                              className="font-bold text-lg mb-2"
                              style={{ color: levelData.color }}
                            >
                              {levelData.subtitle}
                            </p>
                            <div
                              className="px-4 py-1.5 rounded-full text-sm font-bold"
                              style={{
                                background: levelData.colorLight,
                                color: levelData.colorDark,
                              }}
                            >
                              النتيجة: {score} من 10 (نطاق المستوى:{" "}
                              {levelData.scoreRange})
                            </div>
                          </motion.div>

                          {/* description */}
                          <motion.div
                            variants={resultChildVariants}
                            className="max-w-2xl mx-auto mb-10"
                          >
                            <p className="text-center text-[var(--color-ink-light)] text-lg leading-[2]">
                              {levelData.description}
                            </p>
                          </motion.div>

                          {/* characteristics + tips grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                            {/* characteristics */}
                            <motion.div
                              variants={resultChildVariants}
                              className="p-6 rounded-[1.5rem]"
                              style={{
                                background: `linear-gradient(135deg, ${levelData.colorLight}30, transparent)`,
                                border: `1px solid ${levelData.colorLight}`,
                              }}
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{
                                    background: levelData.colorLight,
                                  }}
                                >
                                  <Info
                                    size={20}
                                    style={{ color: levelData.colorDark }}
                                  />
                                </div>
                                <h4
                                  className="font-bold text-lg"
                                  style={{ color: levelData.colorDark }}
                                >
                                  سمات هذا المستوى
                                </h4>
                              </div>
                              <ul className="space-y-3">
                                {levelData.characteristics.map((c, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-3 text-[var(--color-ink-light)] text-sm leading-relaxed"
                                  >
                                    <div
                                      className="w-2 h-2 rounded-full mt-2 shrink-0"
                                      style={{
                                        background: levelData.color,
                                      }}
                                    />
                                    {c}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>

                            {/* tips */}
                            <motion.div
                              variants={resultChildVariants}
                              className="p-6 rounded-[1.5rem]"
                              style={{
                                background:
                                  "linear-gradient(135deg, rgba(124,165,216,0.06), transparent)",
                                border:
                                  "1px solid var(--color-sky-calm-light)",
                              }}
                            >
                              <div className="flex items-center gap-3 mb-4">
                                <div
                                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                                  style={{
                                    background: "var(--color-sky-calm-light)",
                                  }}
                                >
                                  <Heart
                                    size={20}
                                    style={{
                                      color: "var(--color-sky-calm-dark)",
                                    }}
                                  />
                                </div>
                                <h4 className="font-bold text-lg text-[var(--color-sky-calm-dark)]">
                                  نصائح وتوجيهات
                                </h4>
                              </div>
                              <ul className="space-y-3">
                                {levelData.tips.map((t, i) => (
                                  <li
                                    key={i}
                                    className="flex items-start gap-3 text-[var(--color-ink-light)] text-sm leading-relaxed"
                                  >
                                    <CheckCircle2
                                      size={16}
                                      className="mt-0.5 shrink-0 text-[var(--color-sky-calm)]"
                                    />
                                    {t}
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          </div>

                          {/* medical disclaimer */}
                          <motion.div
                            variants={resultChildVariants}
                            className="p-6 rounded-[1.5rem] mb-8"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(244,196,160,0.1), rgba(229,165,118,0.05))",
                              border: "1px solid var(--color-apricot-light)",
                            }}
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-xl bg-[var(--color-apricot-light)] flex items-center justify-center shrink-0">
                                <AlertTriangle
                                  size={22}
                                  className="text-[var(--color-apricot-dark)]"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-[var(--color-apricot-dark)] mb-2">
                                  {medicalDisclaimer.title}
                                </h4>
                                <p className="text-sm text-[var(--color-ink-muted)] leading-[1.9]">
                                  {medicalDisclaimer.text}
                                </p>
                                <p className="text-xs text-[var(--color-ink-muted)] mt-2 opacity-70">
                                  {medicalDisclaimer.source}
                                </p>
                              </div>
                            </div>
                          </motion.div>

                          {/* action buttons */}
                          <motion.div
                            variants={resultChildVariants}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4"
                          >
                            <button
                              onClick={startQuiz}
                              className="btn-primary gap-2 px-8 py-3"
                            >
                              <RotateCcw size={18} />
                              أعد التقييم
                            </button>
                            <button
                              onClick={goBack}
                              className="btn-soft gap-2 px-8 py-3"
                            >
                              <Home size={18} />
                              العودة
                            </button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </>
                  );
                })()}
              </motion.div>
            )}

            {/* ═══════════ GAME ═══════════ */}
            {view === VIEW_GAME && (
              <motion.div
                key="game"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.4 } }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className={isGameActive ? "w-full min-h-[90vh] flex flex-col" : ""}
              >
                {/* Back button (Only skip if in deep focus) */}
                <div className={`${isGameActive ? "px-6 py-4 bg-white/80 backdrop-blur-md border-b border-soft flex items-center justify-between" : "mb-6"}`}>
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 text-sm font-bold text-[var(--color-ink-muted)] hover:text-[var(--color-sky-calm)] transition-colors group"
                  >
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    <span>العودة للمنصة</span>
                  </button>

                  {isGameActive && (
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <span className="text-xs font-bold text-[var(--color-ink-muted)] uppercase tracking-wider">Focus Mode Active</span>
                    </div>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {!isGameActive ? (
                    /* ── PRE-PLAY PREPARATION SCREEN ── */
                    <motion.div
                      key="prepare"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.1 }}
                      className="max-w-4xl mx-auto w-full"
                    >
                      <div 
                        className="card-base p-12 text-center relative overflow-hidden"
                        style={{ borderTop: "4px solid var(--color-apricot)" }}
                      >
                        {/* Decorative background blobs */}
                        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-[var(--color-apricot-light)]/20 blur-[80px] rounded-full" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-[var(--color-mint-light)]/20 blur-[80px] rounded-full" />

                        <div className="relative z-10">
                          <motion.div 
                            className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[var(--color-apricot)] to-[var(--color-mint)] flex items-center justify-center mx-auto mb-8 shadow-xl"
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                          >
                            <Gamepad2 size={48} className="text-white" />
                          </motion.div>

                          <h2 className="text-3xl md:text-4xl font-black text-[var(--color-ink)] mb-4">
                            لعبة التعرف على المشاعر
                          </h2>
                          <p className="text-lg text-[var(--color-ink-muted)] mb-10 max-w-2xl mx-auto leading-relaxed">
                            مرحباً بك في عالم المشاعر! سنقوم معاً برحلة ممتعة لنتعلم كيف نميز بين الفرح، الحزن، والغضب من خلال مطابقة الأشكال والألوان.
                          </p>

                          {/* Quick sensory check / tips */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                            <div className="p-4 rounded-2xl bg-white/50 border border-soft shadow-sm">
                              <Sparkles size={24} className="mx-auto mb-2 text-[var(--color-apricot)]" />
                              <span className="text-sm font-bold text-[var(--color-ink)]">ألوان هادئة</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/50 border border-soft shadow-sm">
                              <Shield size={24} className="mx-auto mb-2 text-[var(--color-mint-dark)]" />
                              <span className="text-sm font-bold text-[var(--color-ink)]">بيئة آمنة</span>
                            </div>
                            <div className="p-4 rounded-2xl bg-white/50 border border-soft shadow-sm">
                              <RotateCcw size={24} className="mx-auto mb-2 text-[var(--color-lavender)]" />
                              <span className="text-sm font-bold text-[var(--color-ink)]">العب براحتك</span>
                            </div>
                          </div>

                          <motion.button
                            onClick={startGame}
                            className="btn-primary-alt px-12 py-5 text-xl flex items-center gap-4 mx-auto group"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>ابدأ اللعب الآن</span>
                            <ArrowLeft size={24} className="transition-transform group-hover:-translate-x-2" />
                          </motion.button>

                          <p className="mt-8 text-xs text-[var(--color-ink-muted)] opacity-60">
                            صُممت هذه اللعبة لتكون متوافقة مع احتياجات أبطالنا من ذوي التوحد
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    /* ── ACTIVE GAME THEATER MODE ── */
                    <motion.div
                      key="active-game"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex-1 flex flex-col bg-white"
                    >
                      <div className="flex-1 w-full relative group/iframe">
                        {/* Soft frame shadow overlay inside */}
                        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.02)] z-10" />
                        
                        <iframe
                          src="/assets/games/interaction-game/index.html"
                          title="لعبة التعرف على المشاعر"
                          className="w-full h-full border-none block"
                          style={{ minHeight: "80vh" }}
                          allowFullScreen
                        />
                      </div>
                      
                      {/* Footer bar for game controls/info */}
                      <div className="p-4 bg-[var(--color-cloud)] border-t border-soft flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-[var(--color-ink-muted)] text-sm font-medium">
                          <Info size={16} />
                          <span>هل تواجه مشكلة؟ قم بتحديث الصفحة</span>
                        </div>
                        <button 
                          onClick={() => setIsGameActive(false)}
                          className="text-sm font-bold text-[var(--color-lavender-dark)] hover:text-[var(--color-sky-calm)] transition-colors flex items-center gap-2"
                        >
                          <ChevronLeft size={16} />
                          إعادة شاشة البداية
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default Interaction;
