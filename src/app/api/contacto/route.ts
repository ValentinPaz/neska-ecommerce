import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  nombre: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = schema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  // Aquí se integraría el envío de email (Resend, Nodemailer, etc.)
  // Por ahora solo confirma la recepción
  console.log("Contacto recibido:", result.data);

  return NextResponse.json({ ok: true });
}
