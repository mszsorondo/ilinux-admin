"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface ClaseData {
  numero: number;
  titulo: string;
  video_url: string | null;
  markdown: string | null;
  meeting_url: string | null;
  completada: boolean;
}

export default function ClaseEditorPage() {
  const params = useParams();
  const router = useRouter();
  const profesorId = params.profesorId as string;
  const numero = params.numero as string;

  const [clase, setClase] = useState<ClaseData | null>(null);
  const [claseActual, setClaseActual] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  useEffect(() => {
    fetch(`/api/clase/${numero}?profesorId=${profesorId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.clase) {
          setClase(data.clase);
          setVideoUrl(data.clase.video_url || "");
          setMarkdown(data.clase.markdown || "");
          setMeetingUrl(data.clase.meeting_url || "");
          setClaseActual(data.clase_actual);
        }
      })
      .finally(() => setLoading(false));
  }, [numero, profesorId]);

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/clase/${numero}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video_url: videoUrl,
          markdown: markdown,
          meeting_url: meetingUrl,
          profesorId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Error al guardar" });
        return;
      }
      setClase(data.clase);
      setClaseActual(data.clase_actual);
      setMessage({ type: "ok", text: "Cambios guardados" });
    } catch {
      setMessage({ type: "error", text: "Error de conexion" });
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkCompleted() {
    if (clase?.completada) return;
    setMarking(true);
    setMessage(null);
    try {
      const res = await fetch("/api/clase-actual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: parseInt(numero, 10), profesorId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Error" });
        return;
      }
      setClaseActual(data.clase_actual);
      setClase((prev) => prev ? { ...prev, completada: true } : prev);
      setMessage({ type: "ok", text: "Clase marcada como completada" });
    } catch {
      setMessage({ type: "error", text: "Error de conexion" });
    } finally {
      setMarking(false);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Cargando...</p>;
  }

  if (!clase) {
    return <p className="text-red-600">Clase no encontrada</p>;
  }

  const esActual = clase.numero === claseActual;

  return (
    <div>
      <Link href={`/profesor/${profesorId}`} className="text-sm text-[#1E3A8A] hover:text-[#F5A623] mb-4 inline-block">
        &larr; Volver al dashboard
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-xl font-bold text-[#1A1A2E]">
          Clase {clase.numero}: {clase.titulo}
        </h1>
        {esActual && (
          <span className="rounded-full bg-[#1E3A8A] px-2 py-0.5 text-xs text-white font-medium">
            Clase actual
          </span>
        )}
        {clase.completada && (
          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 font-medium">
            Completada
          </span>
        )}
      </div>

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-3 text-sm ${
            message.type === "ok"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-5 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link del video
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Markdown (notas / material)
          </label>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            rows={16}
            placeholder="# Titulo de la clase&#10;&#10;Contenido en Markdown..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-mono focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Link de reunion virtual
          </label>
          <input
            type="url"
            value={meetingUrl}
            onChange={(e) => setMeetingUrl(e.target.value)}
            placeholder="https://meet.google.com/... o https://zoom.us/..."
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1E3A8A] focus:outline-none focus:ring-1 focus:ring-[#1E3A8A]"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#F5A623] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#D4A017] transition-colors disabled:opacity-50"
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>

          {!clase.completada && (
            <button
              onClick={handleMarkCompleted}
              disabled={marking}
              className="rounded-lg border border-[#1E3A8A] px-6 py-2.5 text-sm font-semibold text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white transition-colors disabled:opacity-50"
            >
              {marking ? "Marcando..." : "Marcar como completada"}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Clase actual del curso: {claseActual}
      </div>
    </div>
  );
}
