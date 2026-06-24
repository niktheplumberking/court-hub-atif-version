// Tiny shared flag that tells the swipe layout HOW the next in-group navigation
// should animate. The hero SwipeArrows set `current = true` immediately before
// navigating, so ONLY arrow clicks get the horizontal hero-to-hero slide. Every
// other navigation (side-rail links, the in-hero navbar, product drill-downs)
// leaves it false and keeps the clean fade + scroll-to-top. The layout reads it
// once per pathname change and resets it.
export const swipeIntent = { current: false };
