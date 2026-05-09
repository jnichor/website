"use client";

import { useRef, useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);
  const main = images[active] ?? images[0];

  // 3D tilt — moves the image based on cursor position over the container.
  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = tiltRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 → 1
    const y = (e.clientY - rect.top) / rect.height; // 0 → 1
    const ry = (x - 0.5) * 14; // -7° → 7°
    const rx = -(y - 0.5) * 10; // -5° → 5°
    el.style.setProperty("--ry", `${ry}deg`);
    el.style.setProperty("--rx", `${rx}deg`);
  };

  const handleLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  return (
    <div>
      <div
        ref={tiltRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="tilt-3d relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100 shadow-2xl ring-1 ring-white/20"
      >
        <Image
          src={main}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
        {/* Inner glow on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 50%, rgba(0,210,255,0.15) 100%)",
          }}
        />
      </div>
      {images.length > 1 && (
        <div
          className="mt-4 grid grid-cols-4 gap-3"
          role="tablist"
          aria-label="Galería del producto"
        >
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Imagen ${i + 1} de ${images.length}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 bg-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                active === i
                  ? "border-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.4)]"
                  : "border-slate-700 hover:border-slate-500"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
