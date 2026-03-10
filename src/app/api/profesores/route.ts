import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import pool from "@/lib/db";

const TITULOS_CLASES = [
  'Introduccion',
  'Instalacion del Sistema Operativo',
  'Proceso de Login y Primeros Comandos',
  'Comandos GNU/Linux',
  'Manejo de Archivos',
  'Editor de Textos VI',
  'Administracion de Dispositivos de Almacenamiento',
  'Administracion de Procesos',
  'Administracion de Usuarios y Permisos',
  'Administracion de Paquetes',
  'RAID',
  'LVM (Logical Volume Management)',
  'Shell Scripting',
  'Syslog y Tareas Programadas',
  'Quotas de Disco',
  'Conceptos Fundamentales sobre Redes',
  'Configuracion de DHCP',
  'Configuracion de DNS',
  'Configuracion de SSH',
  'Configuracion de FTP',
  'Configuracion de NFS',
  'Configuracion de Samba',
  'Apache Web Server',
  'SQUID e IPTABLES',
];

export async function GET() {
  try {
    const sql = getDb();
    const profesores = await sql`
      SELECT id, nombre, horario FROM profesores ORDER BY created_at ASC
    `;
    return NextResponse.json({ profesores });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, horario } = body;

    if (!nombre || !horario) {
      return NextResponse.json({ error: "Nombre y horario son requeridos" }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Create profesor
      const profesorResult = await client.query(
        'INSERT INTO profesores (nombre, horario) VALUES ($1, $2) RETURNING id, nombre, horario',
        [nombre, horario]
      );
      const profesor = profesorResult.rows[0];

      // Create curso for this profesor
      const cursoResult = await client.query(
        'INSERT INTO curso (profesor_id) VALUES ($1) RETURNING id',
        [profesor.id]
      );
      const cursoId = cursoResult.rows[0].id;

      // Create 24 clases
      for (let i = 0; i < TITULOS_CLASES.length; i++) {
        await client.query(
          'INSERT INTO clases (curso_id, numero, titulo) VALUES ($1, $2, $3)',
          [cursoId, i + 1, TITULOS_CLASES[i]]
        );
      }

      await client.query('COMMIT');

      return NextResponse.json({ profesor }, { status: 201 });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
