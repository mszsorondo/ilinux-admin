import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();

    const cursoRows = await sql`SELECT id, clase_actual, finalizado FROM curso LIMIT 1`;
    if (cursoRows.length === 0) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }
    const curso = cursoRows[0];

    const clases = await sql`
      SELECT numero, titulo, video_url, markdown, meeting_url, completada
      FROM clases
      WHERE curso_id = ${curso.id}
      ORDER BY numero ASC
    `;

    return NextResponse.json({
      curso: { clase_actual: curso.clase_actual, finalizado: curso.finalizado },
      clases,
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
