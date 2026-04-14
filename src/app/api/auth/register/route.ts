import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (!body.email || !body.password || !body.name) {
    return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email: body.email } });
  if (exists) {
    return NextResponse.json({ error: "El email ya está registrado" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(body.password, 12);
  const user = await prisma.user.create({
    data: {
      email: body.email,
      password: hashed,
      name: body.name,
      role: "employee",
    },
  });

  return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
}
