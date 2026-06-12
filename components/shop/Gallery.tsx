'use client';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Gallery({ images, title, sold }: { images: string[]; title: string; sold?: boolean }) {
  const [active, setActive] = useState(0);
  const frameRef = useRef<HTMLDivElement>(null);

  // Entrance: masked reveal — clip-path wipe up + the image settling from 1.3
  // scale (motion bible #4). All inside the reduced-motion guard so the gallery
  // simply renders static when motion is off.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline();
        tl.fromTo(
          frame,
          { clipPath: 'inset(100% 0% 0% 0% round 20px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 20px)', duration: 1.2, ease: 'expo.out' }
        ).fromTo(
          '[data-gallery-zoom]',
          { scale: 1.3 },
          { scale: 1, duration: 1.4, ease: 'expo.out' },
          0
        );
        if (frame.parentElement?.querySelector('[data-gallery-thumbs]')) {
          tl.from(
            '[data-gallery-thumb]',
            { y: 14, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06 },
            0.5
          );
        }
      });
    }, frame.parentElement ?? frame);

    return () => ctx.revert();
  }, []);

  return (
    <div className="space-y-3">
      <div
        ref={frameRef}
        className="relative aspect-square bg-ink-2 rounded-[20px] overflow-hidden border border-white/5"
      >
        {images.length > 0 ? (
          // All shots stay stacked; switching thumbnails crossfades opacity over
          // 350ms — the outgoing and incoming images blend instead of swapping.
          <div data-gallery-zoom className="absolute inset-0 will-change-transform">
            {images.map((img, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img + i}
                src={img}
                alt={i === active ? title : ''}
                aria-hidden={i !== active}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[350ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${i === active ? 'opacity-100' : 'opacity-0'}`}
              />
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-display tracking-widest">COURT HUB</div>
        )}
        {sold && (
          <span className="absolute inset-0 bg-ink/70 flex items-center justify-center text-white font-display font-bold text-2xl tracking-widest">SOLD</span>
        )}
      </div>
      {images.length > 1 && (
        <div data-gallery-thumbs className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              data-gallery-thumb
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${images.length}`}
              aria-current={i === active}
              className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-[border-color,opacity,transform] duration-200 active:scale-95 ${i === active ? 'border-lime' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
