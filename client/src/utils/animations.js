/**
 * Shared animation variants for Framer Motion.
 * Centralized to avoid duplicating identical objects in every page.
 * All animations follow the "Sensory-Safe" principle:
 * - Slow durations (0.5s+)
 * - Ease-in-out curves (no spring/bounce)
 * - Small, predictable movements
 */

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

export const titleVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

export const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1],
    },
  }),
};

export const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
};

/** Safe hover config — subtle scale only */
export const safeHover = {
  whileHover: { scale: 1.02 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
};

/** Viewport trigger for whileInView */
export const viewportOnce = { once: true, amount: 0.2 };
