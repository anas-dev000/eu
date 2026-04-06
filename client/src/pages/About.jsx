import Logo from "../components/Logo";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  cardVariants,
  viewportOnce,
} from "../utils/animations";

const teamMembers = [
  { avatar: "/assets/images/avatars/boy1.png", title: "مطور واجهات" },
  { avatar: "/assets/images/avatars/girl1.png", title: "أخصائية توحد" },
  { avatar: "/assets/images/avatars/boy2.png", title: "مخطط محتوى" },
  { avatar: "/assets/images/avatars/girl1.png", title: "مصممة تعليمية" },
  { avatar: "/assets/images/avatars/girl1.png", title: "باحثة علمية" },
  { avatar: "/assets/images/avatars/girl1.png", title: "أخصائية تواصل" },
  { avatar: "/assets/images/avatars/girl1.png", title: "مديرة المشروع" },
];

const goals = [
  "توفير معلومات مثبتة بالأدلة والبراهين العلمية ومحتوى تعليمي عالي الجودة للأسر.",
  "تقديم أدوات تعليمية وسلوكية مناسبة.",
  "بناء مجتمع داعم للأهالي والمختصين.",
  "مواكبة التحول والتعلم الرقمي بجميع الأشكال بطريقة مبتكرة.",
  "تقديم الإفادة لأولياء الأمور في التعامل مع أطفال التوحد.",
  "تقديم النفع للأولاد من ذوي اضطراب التوحد.",
  "تفاعل الأولاد مع الألعاب والأدوات التعليمية.",
];

const pages = [
  { name: "الصفحة الرئيسية", desc: "تحتوي على محتويات المشروع والمنصة الأساسية." },
  { name: "من نحن", desc: "تعرّف بالفريق الخاص بالمشروع." },
  { name: "المدونة", desc: "طرق التعامل مع طيف التوحد في التمارين اليومية والحياتية." },
  { name: "البودكاست", desc: "تتحدث عن مستويات التوحد وطريقة التعامل مع كل مستوى." },
  { name: "الأدوات التعليمية", desc: "أدوات تعليمية وألعاب نفعية للفئة." },
  { name: "القصص الرقمية", desc: "قصص رقمية منتجة بالذكاء الاصطناعي عن طيف التوحد." },
  { name: "أساليب التفاعل", desc: "أساليب التعامل والتفاعل مع الأطفال." },
  { name: "الألعاب التفاعلية", desc: "ألعاب يتفاعل معها الطلاب ويستفيدون منها." },
];

const About = () => {
  return (
    <Layout>
      {/* About Us */}
      <section className="section-block">
        <div className="container-content max-w-3xl mx-auto">
          <motion.div
            className="card-base text-center"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="section-heading text-gradient">من نحن</h2>
            <p className="text-intro !mb-0">
              نحن منصة تعليمية وتفاعلية تهدف إلى دعم الأطفال ذوي اضطراب طيف
              التوحد وأسرهم من خلال توفير محتوى علمي موثوق، أدوات تعليمية
              مبتكرة، وبيئة داعمة تعزز الاندماج والتفاعل.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Goals */}
      <section className="section-block bg-white">
        <div className="container-content max-w-3xl mx-auto">
          <motion.h2
            className="section-heading text-gradient"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            الأهداف
          </motion.h2>
          <motion.div
            className="space-y-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {goals.map((goal, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-3 p-4 rounded-[var(--radius-lg)] bg-[var(--color-cloud)] border-r-3 border-r-[var(--color-mint)]"
                variants={itemVariants}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--color-mint)] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm leading-relaxed !text-[var(--color-ink)]">{goal}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-block">
        <div className="container-content max-w-3xl mx-auto">
          <motion.div
            className="card-base bg-gradient-to-br from-[var(--color-sky-calm-light)]/30 to-[var(--color-lavender-light)]/30"
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            <h2 className="section-heading text-gradient">رسالة المشروع</h2>
            <p className="text-intro !mb-0 !text-[var(--color-ink)]">
              نسعى من خلال هذا المشروع إلى تمكين الأهل، المعلمين، والمجتمع من
              فهم ودعم الأفراد المصابين باضطراب طيف التوحد، من خلال التوعية،
              التدريب، وخلق بيئة آمنة ومحفزة تضمن لهم الاندماج، التقدير، وفرصًا
              متكافئة للحياة والتعلم. نؤمن أن الاختلاف ليس عيبًا بل تميزًا، وأن
              لكل طفل قدراته الخاصة التي تستحق أن تُكتشف وتُحترم.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Project Pages */}
      <section className="section-block bg-white">
        <div className="container-content max-w-3xl mx-auto">
          <motion.h2
            className="section-heading text-gradient"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            صفحات المنصة
          </motion.h2>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {pages.map((page, index) => (
              <motion.div
                key={index}
                className="card-base p-4"
                variants={cardVariants}
                custom={index}
              >
                <h4 className="font-bold text-[var(--color-sky-calm)] text-sm mb-1">
                  {page.name}
                </h4>
                <p className="text-xs leading-relaxed">{page.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="section-block">
        <div className="container-content">
          <motion.h2
            className="section-heading text-gradient"
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            فريق العمل
          </motion.h2>
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-6 justify-items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className={`card-base flex flex-col items-center text-center p-4 min-h-[140px] w-full max-w-[200px] ${
                  index === 6 ? "md:col-start-2" : ""
                }`}
                variants={cardVariants}
                custom={index}
              >
                <img
                  src={member.avatar}
                  alt="عضو فريق العمل"
                  className="w-24 h-24 rounded-full object-cover shadow-md mb-2"
                />
                {/* {member.title && (
                  <p className="text-xs font-semibold !text-[var(--color-ink-muted)]">
                    {member.title}
                  </p>
                )} */}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
