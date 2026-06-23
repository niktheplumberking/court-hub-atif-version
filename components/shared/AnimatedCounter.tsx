'use client';
import { useEffect, useState, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

/**
 * Counts from 0 → value once, the first time it scrolls into view (ease-out
 * cubic). Ported from the design project. Honors prefers-reduced-motion by
 * snapping straight to the final value.
 */
export function AnimatedCounter({
  value,
  duration = 1500,
  decimals = 0,
  suffix = '',
  prefix = '',
  className = '',
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(value);
      setHasAnimated(true);
      return;
    }
    const el = elementRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHasAnimated(true);
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  useEffect(() => {
    if (!hasAnimated) return;
    const totalFrames = Math.max(1, duration / 16.67);
    let frame = 0;
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      if (frame >= totalFrames) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(value * eased);
      }
    }, 16.67);
    return () => clearInterval(counter);
  }, [hasAnimated, value, duration]);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
}
