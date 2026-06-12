import Header from '@/components/home/Header';

/**
 * The ONE navbar — the hero navbar from the homepage, used on every page.
 * `spacer` pushes in-flow content below the fixed bar on utility pages
 * (shop, cart, legal). Marketing pages with full-bleed heroes omit it.
 */
export default function SiteHeader({ spacer = false }: { spacer?: boolean }) {
  return (
    <>
      <Header />
      {spacer && <div aria-hidden className="h-20 md:h-24" />}
    </>
  );
}
