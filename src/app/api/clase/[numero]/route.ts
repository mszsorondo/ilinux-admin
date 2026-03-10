import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { intentarAvanzarClaseActual } from "@/lib/clase-actual";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ numero: string }> }
) {
  try {
    const { numero } = await params;
    const num = parseInt(numero, 10);
    if (isNaN(num) || num < 1 || num > 24) {
      return NextResponse.json({ error: "Numero invalido" }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const profesorId = searchParams.get('profesorId');

    if (!profesorId) {
      return NextResponse.json({ error: "profesorId es requerido" }, { status: 400 });
    }

    const sql = getDb();
    const cursoRows = await sql`SELECT id, clase_actual FROM curso WHERE profesor_id = ${profesorId}`;
    if (cursoRows.length === 0) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }

    const claseRows = await sql`
      SELECT numero, titulo, video_url, markdown, meeting_url, completada
      FROM clases
      WHERE curso_id = ${cursoRows[0].id} AND numero = ${num}
    `;

    if (claseRows.length === 0) {
      return NextResponse.json({ error: "Clase no encontrada" }, { status: 404 });
    }

    return NextResponse.json({
      clase: claseRows[0],
      clase_actual: cursoRows[0].clase_actual,
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ numero: string }> }
) {
  try {
    const { numero } = await params;
    const num = parseInt(numero, 10);
    if (isNaN(num) || num < 1 || num > 24) {
      return NextResponse.json({ error: "Numero invalido" }, { status: 400 });
    }

    const body = await request.json();
    const { profesorId } = body;

    if (!profesorId) {
      return NextResponse.json({ error: "profesorId es requerido" }, { status: 400 });
    }

    const sql = getDb();

    const cursoRows = await sql`SELECT id FROM curso WHERE profesor_id = ${profesorId}`;
    if (cursoRows.length === 0) {
      return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });
    }
    const cursoId = cursoRows[0].id;

    // Update only provided fields
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIdx = 1;

    if ("video_url" in body) {
      updates.push(`video_url = $${paramIdx++}`);
      let url = body.video_url || null;
      if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      values.push(url);
    }
    if ("markdown" in body) {
      updates.push(`markdown = $${paramIdx++}`);
      values.push(body.markdown || null);
    }
    if ("meeting_url" in body) {
      updates.push(`meeting_url = $${paramIdx++}`);
      let url = body.meeting_url || null;
      if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      values.push(url);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 });
    }

    updates.push(`updated_at = now()`);
    values.push(cursoId, num);

    const query = `
      UPDATE clases
      SET ${updates.join(", ")}
      WHERE curso_id = $${paramIdx++} AND numero = $${paramIdx}
      RETURNING numero, titulo, video_url, markdown, meeting_url, completada
    `;

    const pool = (await import("@/lib/db")).default;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Clase no encontrada" }, { status: 404 });
    }

    const clase = result.rows[0];

    // Condition A: if class now has both video+markdown, try to advance
    if (clase.video_url && clase.markdown) {
      await intentarAvanzarClaseActual(num, cursoId);
    }

    // Get updated clase_actual
    const cursoAfter = await sql`SELECT clase_actual FROM curso WHERE profesor_id = ${profesorId}`;

    return NextResponse.json({
      clase,
      clase_actual: cursoAfter[0].clase_actual,
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
