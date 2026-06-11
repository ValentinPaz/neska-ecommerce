import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { mpPreference } from "@/lib/mp";
import { checkoutSchema } from "@/lib/validations/checkout";

const itemSchema = z.object({
  productId: z.string(),
  name: z.string(),
  size: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
});

const requestSchema = z.object({
  customer: checkoutSchema,
  items: z.array(itemSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.issues }, { status: 400 });
    }

    const { customer, items } = parsed.data;
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // Resolver variantId para cada item (buscar por productId + size)
    const resolvedItems = await Promise.all(
      items.map(async (i) => {
        const variant = await prisma.productVariant.findUnique({
          where: { productId_size: { productId: i.productId, size: i.size } },
        });
        if (!variant) throw new Error(`Talle ${i.size} no encontrado para el producto ${i.name}`);
        return { ...i, variantId: variant.id };
      })
    );

    // Crear orden en la DB
    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        total,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: customer.address,
        shippingCity: customer.city,
        shippingZip: customer.zip,
        notes: customer.notes,
        items: {
          create: resolvedItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            unitPrice: i.price,
          })),
        },
      },
    });

    // Crear preferencia en Mercado Pago
    const preference = await mpPreference.create({
      body: {
        external_reference: order.id,
        items: items.map((i) => ({
          id: i.productId,
          title: `${i.name} — Talle ${i.size}`,
          quantity: i.quantity,
          unit_price: i.price,
          currency_id: "ARS",
        })),
        payer: {
          name: customer.name,
          email: customer.email,
          phone: { number: customer.phone },
          address: { street_name: customer.address, zip_code: customer.zip },
        },
        back_urls: {
          success: `${baseUrl}/checkout/exitoso`,
          failure: `${baseUrl}/checkout/error`,
          pending: `${baseUrl}/checkout/pendiente`,
        },
        auto_return: "approved",
        notification_url: `${baseUrl}/api/checkout/webhook`,
        statement_descriptor: "NESKA BS AS",
        metadata: { orderId: order.id },
      },
    });

    return NextResponse.json({
      orderId: order.id,
      initPoint: preference.sandbox_init_point ?? preference.init_point,
    });
  } catch (err) {
    console.error("[checkout/preference]", err);
    return NextResponse.json({ error: "Error al crear el pago" }, { status: 500 });
  }
}
