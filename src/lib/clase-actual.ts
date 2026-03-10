import { getDb } from "@/lib/db";

/**
 * Intenta avanzar clase_actual si `numero` es la clase actual.
 * Retorna el nuevo valor de clase_actual.
 */
export async function intentarAvanzarClaseActual(numero: number, cursoId: string): Promise<number> {
  const sql = getDb();

  const cursoRows = await sql`SELECT id, clase_actual, finalizado FROM curso WHERE id = ${cursoId}`;
  if (cursoRows.length === 0) return 1;

  const curso = cursoRows[0];

  if (curso.finalizado || numero !== curso.clase_actual) {
    return curso.clase_actual;
  }

  if (curso.clase_actual === 24) {
    await sql`UPDATE curso SET finalizado = true, updated_at = now() WHERE id = ${curso.id}`;
    return 24;
  }

  const newClaseActual = curso.clase_actual + 1;
  await sql`UPDATE curso SET clase_actual = ${newClaseActual}, updated_at = now() WHERE id = ${curso.id}`;
  return newClaseActual;
}
