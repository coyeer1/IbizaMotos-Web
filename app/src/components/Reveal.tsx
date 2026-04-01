import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'fade';
  className?: string;
  amount?: number;
}

/**
 * Wrapper that fades+slides children into view when they enter the viewport.
 * Uses Framer Motion whileInView — fires once, respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className,
  amount = 0.12,
}: RevealProps) {
  const offsets = {
    up:    { y: 28, x: 0 },
    left:  { y: 0,  x: 28 },
    right: { y: 0,  x: -28 },
    fade:  { y: 0,  x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...offsets[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.52, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
