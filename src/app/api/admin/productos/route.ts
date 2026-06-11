import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { productSchema } from "@/lib/validations/product";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { size: "asc" } },
    },
  });

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
    }

    const { variants, ...productData } = parsed.data;
    const images: { url: string; position: number }[] = Array.isArray(body.images) ? body.images : [];

    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (existing) {
      return NextResponse.json({ error: "Ya existe un producto con ese slug" }, { status: 409 });
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        variants: { create: variants },
        images: { create: images },
      },
      include: {
        category: true,
        variants: true,
        images: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
