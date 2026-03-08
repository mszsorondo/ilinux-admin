import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { intentarAvanzarClaseActual } from "@/lib/clase-actual";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const numero = body.numero;

    if (typeof numero !== "number" || numero < 1 || numero > 24) {
      return NextResponse.json({ error: "Número de clase inválido" }, { status: 400 });
    }

    const sql = getDb();
    const cursoRows = await sql`SELECT id FROM curso LIMIT 1`;
    if (cursoRows.length === 0) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    // Mark as completed
    await sql`
      UPDATE clases SET completada = true, updated_at = now()
      WHERE curso_id = ${cursoRows[0].id} AND numero = ${numero}
    `;

    // Condition B: try to advance clase_actual
    const newClaseActual = await intentarAvanzarClaseActual(numero);

    return NextResponse.json({ clase_actual: newClaseActual });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
