import { prisma } from "@/lib/prisma";
import type { Category, Product } from "@/types";

// ─── Tipo de retorno de Prisma para producto ───────────────────────────────
type PrismaProduct = Awaited<ReturnType<typeof findProduct>>;

async function findProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { size: "asc" } },
    },
  });
}

// ─── Mapper Prisma → tipo de tienda ────────────────────────────────────────
function mapProduct(p: NonNullable<PrismaProduct>): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description ?? "",
    price: p.price,
    images: p.images.map((img) => img.url),
    category: {
      id: p.category.id,
      name: p.category.name,
      slug: p.category.slug,
      count: 0,
    },
    sizes: p.variants.map((v) => v.size),
    isNew: p.isNew,
    createdAt: p.createdAt.toISOString(),
  };
}

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getShopCategories(): Promise<Category[]> {
  const cats = await prisma.category.findMany({
    orderBy: { position: "asc" },
    include: { _count: { select: { products: { where: { isActive: true } } } } },
  });
  return cats.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    count: c._count.products,
  }));
}

export async function getShopProducts(opts: {
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  query?: string;
} = {}): Promise<Product[]> {
  const { categorySlug, minPrice, maxPrice, query } = opts;

  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      ...(categorySlug && { category: { slug: categorySlug } }),
      ...(minPrice !== undefined && { price: { gte: minPrice } }),
      ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
      ...(query && {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { orderBy: { size: "asc" } },
    },
  });

  return rows.map((p) => mapProduct(p as NonNullable<PrismaProduct>));
}

export async function getShopProductBySlug(slug: string): Promise<Product | null> {
  const p = await findProduct(slug);
  if (!p) return null;
  return mapProduct(p);
}

export async function getRelatedProducts(categorySlug: string, excludeId: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug },
      NOT: { id: excludeId },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { orderBy: { size: "asc" } },
    },
  });

  return rows.map((p) => mapProduct(p as NonNullable<PrismaProduct>));
}

export async function getLatestShopProducts(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      category: true,
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: { orderBy: { size: "asc" } },
    },
  });

  return rows.map((p) => mapProduct(p as NonNullable<PrismaProduct>));
}
