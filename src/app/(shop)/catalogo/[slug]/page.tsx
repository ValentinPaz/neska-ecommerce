import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { getShopProductBySlug, getRelatedProducts } from "@/lib/db/shop";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductCard } from "@/components/catalog/ProductCard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getShopProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | NESKA Bs As`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getShopProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product.category.slug, product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-[#B8A79B] tracking-wider mb-8 flex items-center gap-2">
        <Link href="/" className="hover:text-[#C8A86B] transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-[#C8A86B] transition-colors">Catálogo</Link>
        <span>/</span>
        <Link
          href={`/catalogo?categoria=${product.category.slug}`}
          className="hover:text-[#C8A86B] transition-colors"
        >
          {product.category.name}
        </Link>
        <span>/</span>
        <span className="text-[#6E5C52] truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* Producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-[#DCCBB8] pt-14">
          <div className="mb-8">
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C8A86B] mb-2">
              También te puede gustar
            </p>
            <h2 className="font-heading text-2xl font-bold text-[#6E5C52] tracking-wide uppercase">
              {product.category.name}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
