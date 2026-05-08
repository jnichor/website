"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const main = images[active] ?? images[0];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
        <Image
          src={main}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-4 gap-3" role="tablist" aria-label="Galería del producto">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              role="tab"
              aria-selected={active === i}
              aria-label={`Imagen ${i + 1} de ${images.length}`}
              onClick={() => setActive(i)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active === i ? "border-primary" : "border-transparent hover:border-muted-foreground"}`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
