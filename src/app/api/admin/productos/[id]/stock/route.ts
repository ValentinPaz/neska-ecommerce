import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { stockPatchSchema } from "@/lib/validations/product";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const parsed = stockPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
    }

    const { variants } = parsed.data;

    await prisma.$transaction(
      variants.map((v) =>
        v.id
          ? prisma.productVariant.update({ where: { id: v.id }, data: { stock: v.stock } })
          : prisma.productVariant.upsert({
              where: { productId_size: { productId: id, size: v.size } },
              update: { stock: v.stock },
              create: { productId: id, size: v.size, stock: v.stock },
            })
      )
    );

    const updated = await prisma.productVariant.findMany({
      where: { productId: id },
      orderBy: { size: "asc" },
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
