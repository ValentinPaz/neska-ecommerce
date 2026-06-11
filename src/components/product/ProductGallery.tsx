"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  // Placeholder cuando no hay imágenes
  if (!images.length || !images[0]) {
    return (
      <div className="aspect-[3/4] w-full bg-[#F3E6E6] rounded flex items-center justify-center">
        <span className="font-heading text-[#B8A79B] text-8xl opacity-30 select-none">N</span>
      </div>
    );
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnails — visible si hay más de 1 imagen */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-16 shrink-0">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-square rounded overflow-hidden border-2 transition-colors ${
                i === active ? "border-[#C8A86B]" : "border-transparent"
              }`}
            >
              <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Imagen principal */}
      <div className="relative flex-1 aspect-[3/4] rounded overflow-hidden bg-[#F3E6E6]">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
