"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Profesor {
  id: string;
  nombre: string;
  horario: string;
}

export default function ProfesoresPage() {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profesores")
      .then((res) => res.json())
      .then((data) => {
        setProfesores(data.profesores);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Cargando...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-[#1A1A2E]">Profesores</h1>
        <Link
          href="/profesores/nuevo"
          className="rounded-lg bg-[#F5A623] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#D4A017] transition-colors"
        >
          Crear profesor
        </Link>
      </div>

      {profesores.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500 mb-4">No hay profesores creados todavia.</p>
          <Link
            href="/profesores/nuevo"
            className="text-[#1E3A8A] hover:text-[#F5A623] font-medium text-sm"
          >
            Crear el primer profesor
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {profesores.map((profesor) => (
            <Link
              key={profesor.id}
              href={`/profesor/${profesor.id}`}
              className="block rounded-lg border border-gray-200 bg-white p-5 hover:border-[#1E3A8A] hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#1A1A2E]">
                    {profesor.nombre}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{profesor.horario}</p>
                </div>
                <span className="text-[#1E3A8A] text-sm font-medium">
                  Ver curso &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
