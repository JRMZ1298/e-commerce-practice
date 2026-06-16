"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-canvas">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banner-home-v2.webp"
          alt=""
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-[23rem] bg-gradient-to-t from-background to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full pt-24 pb-16">
        <div className="mx-auto px-6 lg:px-8">
          <div className="max-w-2xl">
            <span
              className="text-[1.4rem] uppercase mb-6 block text-white/70 animate-blur-in opacity-0 tracking-wide"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              Colección Otoño 2025
            </span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 text-balance text-white">
              <span
                className="block animate-blur-in opacity-0 font-bold"
                style={{
                  animationDelay: "0.4s",
                  animationFillMode: "forwards",
                }}
              >
                Tu estilo,
              </span>
              <span
                className="block animate-blur-in opacity-0 font-light lg:text-8xl text-6xl"
                style={{
                  animationDelay: "0.6s",
                  animationFillMode: "forwards",
                }}
              >
                tu esencia
              </span>
            </h2>
            <p
              className="text-[1.6rem] leading-relaxed mb-10 max-w-md text-white/80 animate-blur-in opacity-0"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              Descubre nuestra colección de ropa y accesorios diseñados para
              quienes buscan expresar su personalidad a través de la moda.
            </p>
            <div
              className="flex flex-col sm:flex-row gap-4 animate-blur-in opacity-0"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-3 bg-white text-brand-green px-8 py-4 rounded-full text-[1.4rem] tracking-wide boty-transition hover:bg-white/90 boty-shadow"
              >
                Explorar colección
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </Link>
              <Link
                href="/categories"
                className="group inline-flex items-center justify-center gap-3 border border-white/30 text-white px-8 py-4 rounded-full text-[1.4rem] tracking-wide boty-transition hover:bg-white/10"
              >
                Ver categorías
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white">
        <span className="text-xs tracking-widest uppercase font-bold">
          Scroll
        </span>
        <div className="w-px h-12 bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
