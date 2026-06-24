'use client';
import { MotionConfig } from 'motion/react';

/**
 * Forces every Framer Motion component on the site to animate regardless of the
 * OS "reduce motion" setting. The brand experience is motion-led (looping hero
 * CTAs, the heading underline draw, marquees, the smooth Lenis scroll), and the
 * owner wants those to always play — without this, a visitor (or the owner's own
 * machine) with reduced-motion enabled sees frozen idle animations.
 */
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
