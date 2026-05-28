import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
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
 * Uses a manual IntersectionObserver (via useInView) so that elements which are
 * already in OR past the viewport on mount (e.g. after browser "back" + scroll
 * restoration) immediately become visible — fixes the "blank page on back"
 * bug where whileInView never fires for content above the restored scroll pos.
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

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount });
  const [forceShow, setForceShow] = useState(false);

  // On mount, if the element is already above the viewport (i.e. user is
  // scrolled past it — typical when restoring scroll after back-nav), make it
  // visible immediately. Otherwise whileInView never triggers for it.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom < 0 || rect.top < vh) {
      setForceShow(true);
    }
  }, []);

  const animate = inView || forceShow
    ? { opacity: 1, x: 0, y: 0 }
    : { opacity: 0, ...offsets[direction] };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={animate}
      transition={{ duration: 0.52, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
