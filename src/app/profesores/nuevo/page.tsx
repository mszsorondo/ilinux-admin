"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoProfesorPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [horario, setHorario] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profesores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, horario }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error al crear profesor");
        return;
      }
      router.push("/");
    } catch {
      setError("Error de conexion");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <Link href="/" className="text-sm text-[#1E3A8A] hover:text-[#F5A623] mb-4 inline-block">
        &larr; Volver a profesores
      </Link>

      <h1 className="text-xl font-bold text-[#1A1A2E] mb-6">Crear profesor</h1>

      {error && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            placeholder="Nombre del profesor"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horario
          </label>
          <input
            type="text"
            value={horario}
            onChange={(e) => setHorario(e.target.value)}
            required
            placeholder="Martes y Jueves 19hs"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#F5A623] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#D4A017] transition-colors disabled:opacity-50"
          >
            {saving ? "Creando..." : "Crear profesor"}
          </button>
        </div>
      </form>
    </div>
  );
}
