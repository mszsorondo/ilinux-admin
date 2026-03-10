import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { intentarAvanzarClaseActual } from "@/lib/clase-actual";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { numero, profesorId } = body;

    if (typeof numero !== "number" || numero < 1 || numero > 24) {
      return NextResponse.json({ error: "Numero de clase invalido" }, { status: 400 });
    }

    if (!profesorId) {
      return NextResponse.json({ error: "profesorId es requerido" }, { status: 400 });
    }

    const sql = getDb();
    const cursoRows = await sql`SELECT id FROM curso WHERE profesor_id = ${profesorId}`;
    if (cursoRows.length === 0) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    const cursoId = cursoRows[0].id;

    // Mark as completed
    await sql`
      UPDATE clases SET completada = true, updated_at = now()
      WHERE curso_id = ${cursoId} AND numero = ${numero}
    `;

    // Condition B: try to advance clase_actual
    const newClaseActual = await intentarAvanzarClaseActual(numero, cursoId);

    return NextResponse.json({ clase_actual: newClaseActual });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
