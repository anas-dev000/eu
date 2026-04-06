import React from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import games from "../data/gamesData";
import {
  containerVariants,
  titleVariants,
  itemVariants,
  cardVariants,
  viewportOnce,
} from "../utils/animations";

import { Gamepad2 } from "lucide-react";

const Games = () => {
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
            <Gamepad2 size={32} className="text-[var(--color-apricot-dark)]" />
            <h1 className="section-heading !mb-0 text-gradient">
              الألعاب التفاعلية
            </h1>
          </motion.div>
          <motion.p
            className="text-intro"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            نقدم مجموعة من الألعاب التعليمية والتفاعلية المصممة خصيصًا لدعم
            الأطفال ذوي اضطراب طيف التوحد. تهدف هذه الألعاب إلى تعزيز المهارات
            الحسية، اللغوية، الاجتماعية، والإبداعية.
          </motion.p>
        </div>
      </section>

      <section className="section-block pt-0">
        <div className="container-content">
          <motion.div
            className="grid-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {games.map((game, index) => (
              <motion.div
                key={index}
                className="card-base flex flex-col items-center text-center"
                style={{ borderTop: `3px solid var(--color-apricot)` }}
                variants={cardVariants}
                custom={index}
              >
                {/* Image */}
                <a
                  href={game.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block w-full mb-3 ${!game.link ? "pointer-events-none" : ""}`}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-44 object-cover rounded-[var(--radius-md)] hover:scale-105 transition-transform duration-500"
                  />
                </a>

                {/* Content */}
                <h2 className="text-[var(--color-apricot-dark)] font-bold mb-2">
                  {game.title}
                </h2>
                <p className="text-sm leading-relaxed flex-1 mb-4">
                  {game.description}
                </p>

                {/* Button */}
                <a
                  href={game.link || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    mt-auto w-full
                    ${game.link
                      ? "btn-primary"
                      : "btn-soft opacity-50 cursor-not-allowed pointer-events-none"
                    }
                  `}
                >
                  {game.link ? "زيارة اللعبة" : "غير متوفرة حالياً"}
                </a>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Games;
