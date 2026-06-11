import type { Metadata } from "next";
import { getShopProducts, getShopCategories } from "@/lib/db/shop";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { MobileFiltersDrawer } from "@/components/catalog/MobileFiltersDrawer";
import { ProductCard } from "@/components/catalog/ProductCard";
import { SearchBar } from "@/components/catalog/SearchBar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Catálogo | NESKA Bs As",
  description: "Explorá toda nuestra colección de ropa femenina. Envíos a todo el país.",
};

interface Props {
  searchParams: Promise<{
    categoria?: string;
    min?: string;
    max?: string;
    q?: string;
  }>;
}

export default async function CatalogoPage({ searchParams }: Props) {
  const { categoria, min, max, q } = await searchParams;

  const [products, categories] = await Promise.all([
    getShopProducts({
      categorySlug: categoria,
      minPrice: min ? Number(min) : undefined,
      maxPrice: max ? Number(max) : undefined,
      query: q,
    }),
    getShopCategories(),
  ]);

  const activeCategory = categories.find((c) => c.slug === categoria);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="text-xs text-[#B8A79B] tracking-wider mb-6">
        <span>Inicio</span>
        <span className="mx-2">/</span>
        <span className="text-[#6E5C52]">Catálogo</span>
        {activeCategory && (
          <>
            <span className="mx-2">/</span>
            <span className="text-[#6E5C52]">{activeCategory.name}</span>
          </>
        )}
      </div>

      <div className="flex gap-10">
        {/* Sidebar — solo desktop */}
        <div className="hidden md:block">
          <FilterSidebar
            categories={categories}
            activeCategory={categoria}
            minPrice={min ? Number(min) : undefined}
            maxPrice={max ? Number(max) : undefined}
          />
        </div>

        {/* Contenido principal */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <div className="md:hidden">
                <MobileFiltersDrawer
                  categories={categories}
                  activeCategory={categoria}
                  minPrice={min ? Number(min) : undefined}
                  maxPrice={max ? Number(max) : undefined}
                />
              </div>
              <p className="text-sm text-[#B8A79B]">
                <span className="font-semibold text-[#6E5C52]">{products.length}</span>{" "}
                {products.length === 1 ? "producto" : "productos"}
                {q && (
                  <span className="ml-1">
                    para <span className="italic text-[#6E5C52]">&ldquo;{q}&rdquo;</span>
                  </span>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <SearchBar />
              <h1 className="hidden md:block font-heading text-2xl font-bold text-[#6E5C52] tracking-wide uppercase">
                {activeCategory?.name ?? "Catálogo Completo"}
              </h1>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-heading text-2xl text-[#B8A79B] tracking-wide mb-3">
                Sin resultados
              </p>
              <p className="text-sm text-[#B8A79B] mb-6">
                No hay productos que coincidan con tu búsqueda.
              </p>
              <a
                href="/catalogo"
                className="px-6 py-2.5 border border-[#C8A86B] text-[#C8A86B] text-xs tracking-widest uppercase hover:bg-[#C8A86B] hover:text-white transition-colors rounded"
              >
                Ver todo
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
