import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations/product";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { size: "asc" } },
    },
  });

  if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
    }

    const { variants, ...productData } = parsed.data;
    const incomingImages: { url: string; position: number }[] = Array.isArray(body.images) ? body.images : [];

    const slugConflict = await prisma.product.findFirst({
      where: { slug: productData.slug, NOT: { id } },
    });
    if (slugConflict) {
      return NextResponse.json({ error: "Ya existe otro producto con ese slug" }, { status: 409 });
    }

    // Sync variants
    const existingVariants = await prisma.productVariant.findMany({ where: { productId: id } });
    const incomingVariantIds = variants.filter((v) => v.id).map((v) => v.id as string);
    const variantsToDelete = existingVariants.filter((v) => !incomingVariantIds.includes(v.id));

    await prisma.$transaction([
      // Delete removed variants
      ...variantsToDelete.map((v) => prisma.productVariant.delete({ where: { id: v.id } })),
      // Upsert remaining variants
      ...variants.map((v) =>
        v.id
          ? prisma.productVariant.update({ where: { id: v.id }, data: { size: v.size, stock: v.stock } })
          : prisma.productVariant.create({ data: { productId: id, size: v.size, stock: v.stock } })
      ),
      // Replace all images
      prisma.productImage.deleteMany({ where: { productId: id } }),
      ...incomingImages.map((img) =>
        prisma.productImage.create({ data: { productId: id, url: img.url, position: img.position } })
      ),
      // Update product fields
      prisma.product.update({
        where: { id },
        data: productData,
      }),
    ]);

    const updated = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, variants: { orderBy: { size: "asc" } } },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}
