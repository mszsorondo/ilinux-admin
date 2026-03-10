import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const profesorId = searchParams.get('profesorId');

    if (!profesorId) {
      return NextResponse.json({ error: "profesorId es requerido" }, { status: 400 });
    }

    const sql = getDb();

    const cursoRows = await sql`SELECT id, clase_actual, finalizado FROM curso WHERE profesor_id = ${profesorId}`;
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
