'use client';
import { useContext, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, type Variants } from 'motion/react';
// Internal Next context — lets us "freeze" the outgoing route's content so it
// stays rendered while it animates out (App Router otherwise unmounts it
// instantly, which would kill the exit half of the swipe).
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { swipeDirection } from '@/components/swipe/pageOrder';
import Header from '@/components/home/Header';

function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext ?? ({} as never));
  const frozen = useRef(context).current;
  if (!frozen) return <>{children}</>;
  return <LayoutRouterContext.Provider value={frozen}>{children}</LayoutRouterContext.Provider>;
}

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 32 };
const variants: Variants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.95 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { x: SPRING, opacity: { duration: 0.25 } },
  },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 0.95,
    transition: { x: SPRING, opacity: { duration: 0.25 } },
  }),
};

/**
 * Shared layout for the swipe group (About / Construct / Shop / Contact +
 * product). On client-side navigation between these routes the page slides
 * horizontally (direction derived from PAGE_ORDER) — the signature swipe.
 * Real Next routes underneath, so SEO + shareable URLs are preserved.
 */
export default function SwipeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Track the previous path + direction across renders (this layout persists
  // while navigating within the group). Computed at render time so the exiting
  // page already has the right direction.
  const prevPath = useRef(pathname);
  const dir = useRef(1);
  if (pathname !== prevPath.current) {
    dir.current = swipeDirection(prevPath.current, pathname);
    prevPath.current = pathname;
  }

  return (
    <>
      {/* Single shared navbar — OUTSIDE the transforming wrapper so it stays
          viewport-fixed during the slide (a fixed element inside a transform
          breaks). Navigating between swipe pages via the navbar also triggers
          the swipe. */}
      <Header />
      <AnimatePresence mode="popLayout" initial={false} custom={dir.current}>
        <motion.div
          key={pathname}
          custom={dir.current}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="min-h-screen w-full bg-ink will-change-transform md:pl-24"
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
