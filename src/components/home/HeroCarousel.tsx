"use client";

import React, { useCallback, useEffect } from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { formatPrice, formatInstallments } from "@/lib/utils";
import { products } from "@/lib/data/products";

// Producto con mejor precio como "mejor oferta"
const bestOffer = [...products].sort((a, b) => a.price - b.price)[0];

const slides = [
  {
    id: "catalogo",
    tag: "Nueva Colección",
    title: "Invierno\n2026",
    subtitle: "Descubrí nuestra nueva colección que fusiona confort y elegancia.",
    cta: { label: "VER CATÁLOGO", href: "/catalogo" },
    // Paleta: fondo nude con degradado dorado
    bg: "bg-[#E8D7CC]",
    overlay: "from-[#6E5C52]/60 via-[#6E5C52]/30 to-transparent",
    accent: "text-[#C8A86B]",
    tagBg: "bg-[#C8A86B]/20 text-[#C8A86B] border border-[#C8A86B]/40",
    btnPrimary: "bg-[#C8A86B] text-white hover:bg-[#b5945a]",
    extra: null,
  },
  {
    id: "oferta",
    tag: "Mejor Oferta",
    title: bestOffer.name,
    subtitle: `Solo por tiempo limitado — ${formatInstallments(bestOffer.price)}`,
    cta: { label: "COMPRAR AHORA", href: `/catalogo/${bestOffer.slug}` },
    bg: "bg-[#F3E6E6]",
    overlay: "from-[#6E5C52]/50 via-[#6E5C52]/20 to-transparent",
    accent: "text-white",
    tagBg: "bg-white/20 text-white border border-white/40",
    btnPrimary: "bg-white text-[#6E5C52] hover:bg-[#F9F7F4]",
    extra: { price: bestOffer.price },
  },
];

// Indicadores de slide
function SlideIndicators({
  count,
  current,
  onSelect,
}: {
  count: number;
  current: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i === current
              ? "w-8 bg-[#C8A86B]"
              : "w-4 bg-white/50 hover:bg-white/80"
          }`}
          aria-label={`Ir al slide ${i + 1}`}
        />
      ))}
    </div>
  );
}

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    return () => { api.off("select", onSelect); };
  }, [api, onSelect]);

  const scrollTo = useCallback(
    (i: number) => {
      api?.scrollTo(i);
      autoplay.current.reset();
    },
    [api]
  );

  return (
    <div className="relative w-full">
      <Carousel
        opts={{ loop: true, align: "start" }}
        plugins={[autoplay.current]}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              {/* Slide container */}
              <div className={`relative w-full h-[420px] md:h-[560px] ${slide.bg} overflow-hidden`}>

                {/* Patrón decorativo de fondo */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #6E5C52 1px, transparent 0)`,
                    backgroundSize: "32px 32px",
                  }}
                />

                {/* Overlay degradado lateral */}
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.overlay} z-10`} />

                {/* Elemento decorativo — círculo dorado grande */}
                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border-[60px] border-[#C8A86B]/10 z-0" />
                <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border-[40px] border-[#C8A86B]/15 z-0" />

                {/* Contenido del slide */}
                <div className="relative z-20 h-full flex flex-col justify-center px-8 md:px-20 max-w-2xl">
                  {/* Tag */}
                  <span className={`inline-block text-[10px] tracking-[0.3em] uppercase px-3 py-1 rounded-full mb-4 w-fit ${slide.tagBg}`}>
                    {slide.tag}
                  </span>

                  {/* Título */}
                  <h1 className="font-heading font-bold text-white text-4xl md:text-6xl leading-tight tracking-wide uppercase whitespace-pre-line mb-4">
                    {slide.title}
                  </h1>

                  {/* Precio si es oferta */}
                  {slide.extra?.price && (
                    <p className="text-white text-2xl font-bold mb-1">
                      {formatPrice(slide.extra.price)}
                    </p>
                  )}

                  {/* Subtítulo */}
                  <p className="text-white/80 text-sm md:text-base leading-relaxed mb-8 max-w-sm">
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  <div className="flex gap-3">
                    <Link
                      href={slide.cta.href}
                      className={`inline-block px-7 py-3 text-xs tracking-[0.2em] uppercase font-semibold rounded transition-colors ${slide.btnPrimary}`}
                    >
                      {slide.cta.label}
                    </Link>
                    {slide.id === "catalogo" && (
                      <Link
                        href="/catalogo"
                        className="inline-block px-7 py-3 text-xs tracking-[0.2em] uppercase font-semibold rounded border border-white/40 text-white hover:bg-white/10 transition-colors"
                      >
                        VER COLECCIÓN
                      </Link>
                    )}
                  </div>
                </div>

                {/* Número de slide decorativo */}
                <span className="absolute bottom-6 right-8 z-20 font-heading text-white/20 text-7xl font-bold leading-none select-none">
                  0{slides.indexOf(slide) + 1}
                </span>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Flechas de navegación */}
        <button
          onClick={() => { api?.scrollPrev(); autoplay.current.reset(); }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors flex items-center justify-center backdrop-blur-sm"
          aria-label="Slide anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          onClick={() => { api?.scrollNext(); autoplay.current.reset(); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/20 border border-white/30 text-white hover:bg-white/30 transition-colors flex items-center justify-center backdrop-blur-sm"
          aria-label="Slide siguiente"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </Carousel>

      {/* Indicadores */}
      <SlideIndicators count={slides.length} current={current} onSelect={scrollTo} />
    </div>
  );
}
