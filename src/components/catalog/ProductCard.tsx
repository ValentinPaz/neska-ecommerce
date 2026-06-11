import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatInstallments } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/catalogo/${product.slug}`} className="group block">
      {/* Imagen */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded bg-[#F3E6E6]">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          /* Placeholder cuando no hay imagen */
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-[#B8A79B] text-4xl tracking-widest opacity-40 select-none">
              N
            </span>
          </div>
        )}

        {/* Badge Nuevo */}
        {product.isNew && (
          <Badge className="absolute top-2 left-2 bg-[#C8A86B] text-white text-[10px] tracking-wider uppercase px-2 py-0.5 rounded-none border-0">
            Nuevo
          </Badge>
        )}

        {/* Badge categoría */}
        <Badge
          variant="secondary"
          className="absolute top-2 right-2 bg-white/80 text-[#6E5C52] text-[10px] tracking-wide rounded-none border-0 backdrop-blur-sm"
        >
          {product.category.name}
        </Badge>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-[#6E5C52] group-hover:text-[#C8A86B] transition-colors leading-snug">
          {product.name}
        </h3>
        <p className="text-base font-bold text-[#6E5C52]">
          {formatPrice(product.price)}
        </p>
        <p className="text-[11px] text-[#B8A79B]">
          {formatInstallments(product.price)}
        </p>
      </div>
    </Link>
  );
}
