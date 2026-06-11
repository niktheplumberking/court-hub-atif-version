'use client';
import { useState } from 'react';

export default function Gallery({ images, title, sold }: { images: string[]; title: string; sold?: boolean }) {
  const [active, setActive] = useState(0);
  return (
    <div className="space-y-3">
      <div className="relative aspect-square bg-ink-2 rounded-[20px] overflow-hidden border border-white/5">
        {images[active] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[active]} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 font-display tracking-widest">COURT HUB</div>
        )}
        {sold && (
          <span className="absolute inset-0 bg-ink/70 flex items-center justify-center text-white font-display font-bold text-2xl tracking-widest">SOLD</span>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img} alt="" onClick={() => setActive(i)}
              className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 ${i === active ? 'border-lime' : 'border-transparent opacity-60'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
