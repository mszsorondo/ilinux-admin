"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Clase {
  numero: number;
  titulo: string;
  video_url: string | null;
  markdown: string | null;
  meeting_url: string | null;
  completada: boolean;
}

interface Curso {
  clase_actual: number;
  finalizado: boolean;
}

interface Profesor {
  id: string;
  nombre: string;
  horario: string;
}

export default function ProfesorDashboardPage() {
  const params = useParams();
  const profesorId = params.profesorId as string;

  const [clases, setClases] = useState<Clase[]>([]);
  const [curso, setCurso] = useState<Curso | null>(null);
  const [profesor, setProfesor] = useState<Profesor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/clases?profesorId=${profesorId}`).then((res) => res.json()),
      fetch("/api/profesores").then((res) => res.json()),
    ])
      .then(([clasesData, profesoresData]) => {
        setClases(clasesData.clases);
        setCurso(clasesData.curso);
        const prof = profesoresData.profesores?.find((p: Profesor) => p.id === profesorId);
        setProfesor(prof || null);
      })
      .finally(() => setLoading(false));
  }, [profesorId]);

  if (loading) {
    return <p className="text-gray-500">Cargando...</p>;
  }

  function getEstado(clase: Clase) {
    if (clase.video_url && clase.markdown) return "publicada";
    if (clase.video_url || clase.markdown) return "parcial";
    return "vacia";
  }

  const estadoBadge = {
    publicada: "bg-green-100 text-green-800",
    parcial: "bg-yellow-100 text-yellow-800",
    vacia: "bg-gray-100 text-gray-500",
  };

  const estadoLabel = {
    publicada: "Publicada",
    parcial: "Parcial",
    vacia: "Vacia",
  };

  return (
    <div>
      <Link href="/" className="text-sm text-[#1E3A8A] hover:text-[#F5A623] mb-4 inline-block">
        &larr; Volver a profesores
      </Link>

      {profesor && (
        <div className="mb-4">
          <h1 className="text-xl font-bold text-[#1A1A2E]">{profesor.nombre}</h1>
          <p className="text-sm text-gray-500">{profesor.horario}</p>
        </div>
      )}

      {/* Curso info */}
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-white text-sm font-semibold">
          Clase actual: {curso?.clase_actual}
        </div>
        {curso?.finalizado && (
          <div className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm font-semibold">
            Curso finalizado
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3">Titulo</th>
              <th className="px-4 py-3 w-20 text-center">Video</th>
              <th className="px-4 py-3 w-20 text-center">Markdown</th>
              <th className="px-4 py-3 w-20 text-center">Meeting</th>
              <th className="px-4 py-3 w-24 text-center">Estado</th>
              <th className="px-4 py-3 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => {
              const estado = getEstado(clase);
              const esActual = clase.numero === curso?.clase_actual;
              return (
                <tr
                  key={clase.numero}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    esActual ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono font-semibold">
                    {clase.numero}
                    {esActual && (
                      <span className="ml-1 text-[#1E3A8A]" title="Clase actual">
                        *
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{clase.titulo}</td>
                  <td className="px-4 py-3 text-center">
                    {clase.video_url ? (
                      <span className="text-green-600">Si</span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {clase.markdown ? (
                      <span className="text-green-600">Si</span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {clase.meeting_url ? (
                      <span className="text-green-600">Si</span>
                    ) : (
                      <span className="text-gray-300">&mdash;</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${estadoBadge[estado]}`}
                    >
                      {estadoLabel[estado]}
                    </span>
                    {clase.completada && (
                      <span className="ml-1 text-xs text-blue-600" title="Marcada completada">
                        C
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/profesor/${profesorId}/clase/${clase.numero}`}
                      className="text-[#1E3A8A] hover:text-[#F5A623] font-medium text-xs"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
