import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mpPayment } from "@/lib/mp";

// MP payment status → nuestro OrderStatus
const STATUS_MAP: Record<string, string> = {
  approved: "APPROVED",
  rejected: "REJECTED",
  cancelled: "CANCELLED",
  in_process: "PENDING",
  pending: "PENDING",
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // Solo procesamos notificaciones de pagos
    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ ok: true });
    }

    const payment = await mpPayment.get({ id: String(data.id) });
    const mpStatus = payment.status ?? "";
    const orderId = payment.external_reference ?? (payment.metadata as Record<string, string> | undefined)?.orderId;

    if (!orderId) return NextResponse.json({ ok: true });

    const newStatus = STATUS_MAP[mpStatus] ?? "PENDING";

    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: newStatus as "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED",
        mpPaymentId: String(data.id),
        mpStatus,
      },
    });

    // Descontar stock al aprobar
    if (newStatus === "APPROVED") {
      const orderItems = await prisma.orderItem.findMany({ where: { orderId } });
      await prisma.$transaction(
        orderItems.map((item) =>
          prisma.productVariant.update({
            where: { id: item.variantId },
            data: { stock: { decrement: item.quantity } },
          })
        )
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[checkout/webhook]", err);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
