import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/db";
import { crearToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y password son requeridos" },
        { status: 400 }
      );
    }

    const sql = getDb();

    const rows = await sql`
      SELECT id, nombre, email, password_hash
      FROM usuarios
      WHERE email = ${email} AND rol = 'admin'
    `;

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const admin = rows[0];
    const passwordValido = await bcrypt.compare(password, admin.password_hash);

    if (!passwordValido) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const token = await crearToken({
      userId: admin.id,
      email: admin.email,
    });

    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
