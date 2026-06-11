export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Params = { params: Promise<{ id: string }> };

export default async function EditarProductoPage({ params }: Params) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { size: "asc" } },
      },
    }),
    prisma.category.findMany({
      orderBy: { position: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/productos"
          className="mb-2 flex items-center gap-1 text-sm text-[#B8A79B] hover:text-[#6E5C52]"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a productos
        </Link>
        <h1 className="text-2xl font-semibold text-[#6E5C52]">Editar: {product.name}</h1>
      </div>

      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          price: product.price,
          categoryId: product.categoryId,
          isNew: product.isNew,
          isActive: product.isActive,
          images: product.images.map((img) => ({ id: img.id, url: img.url })),
          variants: product.variants.map((v) => ({ id: v.id, size: v.size, stock: v.stock })),
        }}
        categories={categories}
      />
    </div>
  );
}
