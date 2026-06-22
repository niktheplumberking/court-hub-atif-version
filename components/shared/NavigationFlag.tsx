'use client';
import { usePathname } from 'next/navigation';

/**
 * Tracks whether an in-app (client-side) route change has happened since the
 * current document was loaded. The homepage uses this to show its preloader
 * ONLY on a genuine first/external landing — never when the user navigates back
 * to "/" from another page in the same session.
 *
 * Why module state works here: a full page (re)load re-evaluates this module,
 * resetting the flags; Next.js client-side navigations keep the module alive, so
 * `navigated` survives across in-app route changes. It is guarded to the browser
 * so the server module instance (which Next may reuse across requests) never
 * mutates and never leaks state between visitors.
 */
let lastPath: string | null = null;
let navigated = false;

function track(path: string) {
  if (typeof window === 'undefined') return; // client-only — never mutate on the server
  if (lastPath === null) {
    lastPath = path; // the first view of this document load
  } else if (path !== lastPath) {
    lastPath = path;
    navigated = true; // an in-app route change occurred
  }
}

/** True once any client-side navigation has occurred in this document load. */
export function hasClientNavigated(): boolean {
  if (typeof window === 'undefined') return false;
  return navigated;
}

/**
 * Renders nothing. Mounted once, high in the tree (above the page), so it
 * renders before the page on every navigation — the flag is therefore current
 * before the page reads it at render time. `track` is idempotent, so React
 * StrictMode's double render is harmless.
 */
export default function NavigationFlag() {
  const pathname = usePathname();
  track(pathname);
  return null;
}
