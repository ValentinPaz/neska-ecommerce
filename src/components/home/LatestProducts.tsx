import Link from "next/link";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/types";

export function LatestProducts({ products }: { products: Product[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Encabezado */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#C8A86B] mb-2">
            Recién llegados
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#6E5C52] tracking-wide uppercase">
            Últimos Ingresos
          </h2>
        </div>
        <Link
          href="/catalogo"
          className="hidden sm:inline-block text-xs tracking-widest uppercase text-[#6E5C52] border-b border-[#C8A86B] pb-0.5 hover:text-[#C8A86B] transition-colors"
        >
          Ver todo
        </Link>
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Ver todo — mobile */}
      <div className="mt-8 text-center sm:hidden">
        <Link
          href="/catalogo"
          className="inline-block px-8 py-3 border border-[#C8A86B] text-[#C8A86B] text-xs tracking-widest uppercase hover:bg-[#C8A86B] hover:text-white transition-colors rounded"
        >
          Ver todo el catálogo
        </Link>
      </div>
    </section>
  );
}
