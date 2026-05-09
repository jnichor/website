"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  delayMs?: number;
  className?: string;
}

/**
 * Wraps children with a scroll-triggered reveal. Adds the `is-visible` class
 * once the element enters the viewport (50% threshold), then unobserves so
 * the animation plays exactly once. Honors `prefers-reduced-motion` via the
 * global CSS rule that flattens transitions.
 */
export function RevealOnScroll({ children, delayMs = 0, className = "" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            const t = setTimeout(() => setVisible(true), delayMs);
            return () => clearTimeout(t);
          }
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delayMs]);

  return (
    <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
